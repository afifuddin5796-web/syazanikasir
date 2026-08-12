/* ==========================================================================
   SyazaniKasir - Application Logic (Versi localForage + Photo Compressor)
   Data disimpan permanen menggunakan localForage (IndexedDB Wrapper),
   sehingga foto produk & riwayat penjualan TIDAK hilang saat aplikasi ditutup.
   ========================================================================== */

// Konfigurasi Database localForage
localforage.config({
  name: 'SyazaniKasirDB',
  storeName: 'syazani_store'
});

let cart = []; // { productId, name, price, qty }
let productsCache = [];

/* ------------------------------ Formatting ------------------------------- */

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/* --------------------------- Photo Compressor --------------------------- */

// Mengompres foto produk agar ringan & tidak menghabiskan kuota penyimpanan Android
function compressImage(fileInput) {
  return new Promise((resolve) => {
    const file = fileInput.files[0];
    if (!file) return resolve('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 300; // Lebar maksimal 300px (Sangat cukup untuk thumbnail kasir)
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Kompresi ke JPEG dengan kualitas 70%
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve('');
    };
    reader.readAsDataURL(file);
  });
}

/* ------------------------------- Products -------------------------------- */

async function loadProducts() {
  try {
    productsCache = (await localforage.getItem('products')) || [];
    renderProductList();
  } catch (err) {
    console.error('Gagal memuat produk dari localForage:', err);
    productsCache = [];
  }
}

function renderProductList() {
  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';

  if (productsCache.length === 0) {
    container.innerHTML = `<p class="col-span-full text-slate-500 text-sm text-center py-8">Belum ada produk. Klik "+ Tambah Produk" untuk mulai.</p>`;
    return;
  }

  productsCache.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col justify-between hover:border-amber-500 cursor-pointer transition';
    
    // Tampilkan gambar jika ada
    const imageTag = p.photo 
      ? `<img src="${p.photo}" class="w-full h-24 object-cover rounded mb-2" alt="${escapeHtml(p.name)}">` 
      : '';

    card.innerHTML = `
      <div>
        ${imageTag}
        <p class="text-sm font-semibold text-white truncate">${escapeHtml(p.name)}</p>
        <p class="text-xs text-slate-500 truncate">${escapeHtml(p.barcode || '-')}</p>
      </div>
      <div class="mt-2 flex justify-between items-end">
        <span class="text-amber-400 font-bold text-sm">${formatRupiah(p.price)}</span>
        <span class="text-[10px] text-slate-500">Stok: ${p.stock ?? 0}</span>
      </div>
    `;
    card.addEventListener('click', () => addToCart(p));
    container.appendChild(card);
  });
}

async function saveNewProduct(productData) {
  try {
    productData.id = Date.now(); // Unique ID berdasarkan timestamp
    productsCache.push(productData);
    await localforage.setItem('products', productsCache);
    await loadProducts();
  } catch (err) {
    console.error('Gagal menyimpan produk baru:', err);
    alert('Terjadi kesalahan saat menyimpan produk.');
  }
}

async function findProductByBarcode(barcode) {
  return productsCache.find((p) => p.barcode && p.barcode === barcode);
}

/* ---------------------------------- Cart ---------------------------------- */

function addToCart(product) {
  const existing = cart.find((item) => item.productId === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId: product.id, name: product.name, price: product.price, qty: 1 });
  }
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.productId !== productId);
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">Keranjang masih kosong</p>`;
  } else {
    cart.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2';
      row.innerHTML = `
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">${escapeHtml(item.name)}</p>
          <p class="text-xs text-slate-500">${formatRupiah(item.price)} x ${item.qty}</p>
        </div>
        <div class="flex items-center gap-2 ml-2">
          <button class="qty-btn w-6 h-6 rounded bg-slate-700 text-white text-xs" data-action="dec" data-id="${item.productId}">-</button>
          <span class="text-sm w-5 text-center">${item.qty}</span>
          <button class="qty-btn w-6 h-6 rounded bg-slate-700 text-white text-xs" data-action="inc" data-id="${item.productId}">+</button>
          <button class="ml-1 text-red-400 text-xs" data-action="remove" data-id="${item.productId}"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.qty-btn, [data-action="remove"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const action = e.currentTarget.dataset.action;
        if (action === 'inc') changeQty(id, 1);
        if (action === 'dec') changeQty(id, -1);
        if (action === 'remove') removeFromCart(id);
      });
    });
  }

  const total = cartTotal();
  const subtotalEl = document.getElementById('subtotalText');
  const totalEl = document.getElementById('totalText');
  if (subtotalEl) subtotalEl.textContent = formatRupiah(total);
  if (totalEl) totalEl.textContent = formatRupiah(total);
}

async function checkout() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong.');
    return;
  }

  const sale = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: cart.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
    total: cartTotal()
  };

  try {
    // Simpan data transaksi ke localForage
    let salesHistory = (await localforage.getItem('sales')) || [];
    salesHistory.push(sale);
    await localforage.setItem('sales', salesHistory);

    // Kurangi stok produk yang terjual
    for (const item of cart) {
      const product = productsCache.find((p) => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, (product.stock ?? 0) - item.qty);
      }
    }
    await localforage.setItem('products', productsCache);

    await loadProducts();
    cart = [];
    renderCart();
    alert('Transaksi berhasil disimpan!\nTotal: ' + formatRupiah(sale.total));
  } catch (err) {
    console.error('Gagal memproses transaksi:', err);
    alert('Gagal memproses transaksi.');
  }
}

/* ------------------------------- Add Product Modal ------------------------------- */

function setupAddProductModal() {
  const openBtn = document.getElementById('openAddProductModal');
  const modal = document.getElementById('addProductModal');
  const closeBtn = document.getElementById('closeAddProductModal');
  const form = document.getElementById('addProductForm');

  if (!openBtn || !modal || !form) return;

  openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productNameInput')?.value.trim();
    const price = Number(document.getElementById('productPriceInput')?.value);
    const stock = Number(document.getElementById('productStockInput')?.value) || 0;
    const barcode = document.getElementById('productBarcodeInput')?.value.trim();
    
    // Ambil elemen input foto jika ada
    const photoInput = document.getElementById('productPhotoInput') || document.querySelector('input[type="file"]');

    if (!name || !price) {
      alert('Nama dan harga produk wajib diisi.');
      return;
    }

    // Kompres foto secara otomatis sebelum disimpan
    let photoBase64 = '';
    if (photoInput && photoInput.files.length > 0) {
      photoBase64 = await compressImage(photoInput);
    }

    await saveNewProduct({ name, price, stock, barcode, photo: photoBase64 });
    form.reset();
    modal.classList.add('hidden');
  });
}

/* ------------------------------- Barcode Input ------------------------------- */

function setupBarcodeInput() {
  const input = document.getElementById('barcodeInput');
  if (!input) return;

  input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const value = input.value.trim();
    if (!value) return;

    const product = await findProductByBarcode(value);
    if (product) {
      addToCart(product);
    } else {
      const byName = productsCache.find((p) => p.name.toLowerCase().includes(value.toLowerCase()));
      if (byName) {
        addToCart(byName);
      } else {
        alert('Produk dengan barcode/nama "' + value + '" tidak ditemukan.');
      }
    }
    input.value = '';
  });
}

/* -------------------------------- QR / Barcode Scanner -------------------------------- */

let html5QrCode = null;
let scanning = false;

function setupCameraScanner() {
  const scanBtn = document.getElementById('startScanBtn');
  const readerDiv = document.getElementById('reader');

  if (!scanBtn || !readerDiv) return;

  scanBtn.addEventListener('click', async () => {
    if (scanning) {
      await stopScanner();
      return;
    }

    readerDiv.classList.remove('hidden');
    html5QrCode = new Html5Qrcode('reader');
    scanning = true;

    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
          const barcodeInput = document.getElementById('barcodeInput');
          if (barcodeInput) {
            barcodeInput.value = decodedText;
            barcodeInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          }
          stopScanner();
        },
        () => { /* ignore per-frame scan failures */ }
      );
    } catch (err) {
      console.error('Gagal mengakses kamera', err);
      alert('Tidak bisa mengakses kamera. Pastikan izin kamera diaktifkan.');
      scanning = false;
      readerDiv.classList.add('hidden');
    }
  });
}

async function stopScanner() {
  const readerDiv = document.getElementById('reader');
  if (html5QrCode && scanning) {
    try {
      await html5QrCode.stop();
      html5QrCode.clear();
    } catch (err) {
      console.warn(err);
    }
  }
  scanning = false;
  if (readerDiv) readerDiv.classList.add('hidden');
}

/* ------------------------------------ Init ------------------------------------ */

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  renderCart();

  setupAddProductModal();
  setupBarcodeInput();
  setupCameraScanner();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
});
