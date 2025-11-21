/* ==========================================================
   JS/SCRIPT.JS — FINAL FULL VERSION
   Fitur: Register, Upload Gambar, Detail Produk, Dark Mode
   ========================================================== */

// 1. THEME MANAGER (DARK MODE)
(function ThemeManager(){
  const root = document.documentElement;
  const key = 'urbansole_theme';
  const saved = localStorage.getItem(key) || 'light';
  
  if(saved === 'dark') root.classList.add('dark');

  window.toggleTheme = function(){
    const isDark = root.classList.contains('dark');
    if(isDark) {
      root.classList.remove('dark');
      localStorage.setItem(key, 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem(key, 'dark');
    }
  };
})();

// 2. DATABASE & LOGIC
const Storage = (function () {
  const KEY_PRODUCTS = "urbansole_products";

  function seed() {
    // Data sesuai nama file gambar kamu
    const data = [
      { id: "p1", name: "Nike Air Max 270", category: "Sneakers", price: 2300000, img: "img/nike-airmax.jpg", desc: "Sepatu running dengan bantalan udara yang nyaman untuk penggunaan sehari-hari." },
      { id: "p2", name: "Adidas Forum Low", category: "Sneakers", price: 1800000, img: "img/adidas-forum.jpg", desc: "Desain klasik 80-an dengan strap velcro yang ikonik." },
      { id: "p3", name: "New Balance 550", category: "Sneakers", price: 1650000, img: "img/nb-550.jpg", desc: "Sneakers basket retro yang kembali populer dengan gaya vintage." },
      { id: "p4", name: "Nike Dunk SB", category: "Sneakers", price: 2500000, img: "img/nike-dunksb.jpg", desc: "Cocok untuk skate maupun gaya casual. Kualitas premium." },
      { id: "p5", name: "Converse Chuck 70", category: "Sneakers", price: 900000, img: "img/converse-chuck70.jpg", desc: "Versi upgrade dari Chuck Taylor klasik dengan kanvas lebih tebal." },
      { id: "p6", name: "Oversized Hoodie", category: "Apparel", price: 450000, img: "img/hoodie-oversized.jpg", desc: "Hoodie bahan fleece tebal, potongan oversized boxy fit." },
      { id: "p7", name: "Graphic Tee", category: "Apparel", price: 150000, img: "img/graphic-tee.jpg", desc: "Kaos katun 24s dengan sablon plastisol tahan lama." },
      { id: "p8", name: "Cargo Pants", category: "Apparel", price: 320000, img: "img/cargo-pants.jpg", desc: "Celana kargo dengan banyak saku, fungsional dan stylish." },
      { id: "p9", name: "Varsity Jacket", category: "Apparel", price: 600000, img: "img/jacket-varsity.jpg", desc: "Jaket varsity kombinasi wool dan kulit sintetis." },
    ];
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(data));
    return data;
  }

  function loadProducts() {
    const raw = localStorage.getItem(KEY_PRODUCTS);
    return raw ? JSON.parse(raw) : seed();
  }
  
  function addProduct(product) {
    const list = loadProducts();
    list.unshift(product); // Tambah ke paling atas
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  }

  return { loadProducts, addProduct };
})();

// HELPER: FORMAT RUPIAH
function formatRupiah(n) {
  return "IDR " + (n/1000).toFixed(0) + "K";
}

// 3. RENDER FUNCTIONS

// Render Grid Kartu Produk
function renderProductGrid(selector, products) {
  const cont = document.querySelector(selector);
  if (!cont) return;
  cont.innerHTML = "";
  
  products.forEach((p) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <div style="opacity:0.7; font-size:0.9rem;">${p.category}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
            <div class="card-price">${formatRupiah(p.price)}</div>
            <a href="detail-produk.html?id=${p.id}" class="btn" style="padding:5px 10px; font-size:0.8rem; background:#fff; color:#000;">LIHAT</a>
        </div>
      </div>
    `;
    cont.appendChild(el);
  });
}

// Render Halaman Detail
function renderDetail() {
    const container = document.getElementById("detail-container");
    if(!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const products = Storage.loadProducts();
    const p = products.find(item => item.id === id);

    if(!p) {
        container.innerHTML = `<h2>Produk tidak ditemukan :(</h2><a href="produk.html" class="btn">Kembali</a>`;
        return;
    }

    container.innerHTML = `
        <div class="bento-grid">
            <div class="bento-img" style="height:auto; min-height:400px;">
                <img src="${p.img}" alt="${p.name}" style="filter:none;">
            </div>
            <div class="bento-main" style="text-align:left; align-items:flex-start;">
                <div style="background:black; color:white; padding:2px 8px; font-weight:bold; margin-bottom:1rem;">${p.category}</div>
                <h1 style="font-family:'Archivo Black'; font-size:2.5rem; line-height:1.1; margin:0 0 1rem 0; text-transform:uppercase;">${p.name}</h1>
                <div style="font-size:2rem; font-weight:bold; color:var(--blue); margin-bottom:1.5rem;">${formatRupiah(p.price)}</div>
                
                <div style="border-top:3px solid black; border-bottom:3px solid black; padding:1rem 0; margin-bottom:2rem; width:100%;">
                    <h3 style="margin:0 0 0.5rem 0;">DESKRIPSI</h3>
                    <p style="line-height:1.6; margin:0;">${p.desc || "Tidak ada deskripsi."}</p>
                </div>

                <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                    <button onclick="alert('Barang masuk keranjang!')" class="btn btn-primary">BELI SEKARANG</button>
                    <a href="produk.html" class="btn btn-outline">KEMBALI</a>
                </div>
            </div>
        </div>
    `;
}

// 4. FORM FUNCTIONS (INI YANG TADI ILANG)

// Init Register (Tanpa Size Sepatu)
function initRegister() {
  const form = document.querySelector("#form-register");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get("username");
    
    alert(`Yo ${username}! Akun lo berhasil dibuat. Selamat datang di Circle!`);
    window.location.href = "index.html";
  });
}

// Init Kontak
function initKontak() {
  const form = document.querySelector("#form-kontak");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const nama = fd.get("name");
    const topik = fd.get("topic");
    
    alert(`Halo ${nama}, pesan lo tentang "${topik}" udah kami terima. Ditunggu balesannya ya!`);
    form.reset();
  });
}

// Init Tambah Produk (Dengan Upload Gambar)
function initTambahProduk() {
  const form = document.querySelector("#form-tambah");
  if(!form) return;
  
  form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      
      const product = {
          id: "p" + Date.now(),
          name: fd.get("nama_produk"),
          category: fd.get("kategori"),
          price: Number(fd.get("harga")),
          desc: fd.get("deskripsi"),
          img: "img/placeholder.jpg" // Default kalau gak upload
      };

      // Cek apakah user upload gambar
      const file = fd.get("gambar");
      if (file && file.size > 0) {
          const reader = new FileReader();
          reader.onload = function(ev) {
              product.img = ev.target.result; // Convert gambar jadi teks (Base64)
              Storage.addProduct(product);
              alert("Iklan berhasil ditayangkan!");
              window.location.href = "produk.html";
          };
          reader.readAsDataURL(file);
      } else {
          Storage.addProduct(product);
          alert("Iklan berhasil ditayangkan!");
          window.location.href = "produk.html";
      }
  });
}

// 5. MAIN INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  const allProducts = Storage.loadProducts();

  // A. Halaman Home (Index): Limit 6
  if (document.querySelector("#home-product-grid")) {
    renderProductGrid("#home-product-grid", allProducts.slice(0, 6));
  }

  // B. Halaman Koleksi (Produk): Show All + Filter
  if (document.querySelector("#catalog-grid")) {
    renderProductGrid("#catalog-grid", allProducts);
    
    const search = document.querySelector("#search-input");
    const filter = document.querySelector("#filter-category");
    
    const doFilter = () => {
        let result = allProducts;
        if(filter && filter.value) result = result.filter(x => x.category === filter.value);
        if(search && search.value) result = result.filter(x => x.name.toLowerCase().includes(search.value.toLowerCase()));
        renderProductGrid("#catalog-grid", result);
    };
    
    if(search) search.addEventListener("input", doFilter);
    if(filter) filter.addEventListener("change", doFilter);
  }

  // C. Halaman Detail
  if (document.getElementById("detail-container")) {
      renderDetail();
  }
  
  // D. Init Forms
  initRegister();      // <-- INI SUDAH ADA SEKARANG
  initKontak();        // <-- INI JUGA
  initTambahProduk();  // <-- DAN INI
});