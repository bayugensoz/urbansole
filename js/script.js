/* js/script.js
   URBANSOLE — Frontend logic (production-like)
   - Light/Dark theme toggle with preference persistence
   - Product storage using localStorage (client-side)
   - Product listing, search, filter, detail, add product
   - Forms: register, contact (client-side storage)
   Notes: localStorage used for frontend-only persistence.
*/

/* THEME */
(function ThemeManager(){
  const root = document.documentElement;
  const key = 'urbansole_theme';

  function applyTheme(theme){
    const btn = document.getElementById('themeToggleBtn');
    if(!btn) return;

    const sun = btn.querySelector('#icon-sun');
    const moon = btn.querySelector('#icon-moon');

    if(theme === 'dark'){
      root.classList.add('dark');
      sun.style.display = 'none';
      moon.style.display = 'block';
    } else {
      root.classList.remove('dark');
      sun.style.display = 'block';
      moon.style.display = 'none';
    }
  }

  // Apply saved or default (light)
  const saved = localStorage.getItem(key) || 'light';
  applyTheme(saved);

  // Global toggle function
  window.toggleTheme = function(){
    const newTheme = root.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem(key, newTheme);
    applyTheme(newTheme);
  };
})();


/* APP STORAGE */
const Storage = (function () {
  const KEY_PRODUCTS = "urbansole_products";
  const KEY_USERS = "urbansole_users";
  const KEY_MESSAGES = "urbansole_messages";

  function seed() {
    const data = [
      {
        id: "p1",
        name: "Nike Air Max 270",
        category: "Sneakers",
        price: 2300000,
        stock: 12,
        img: "img/nike-airmax.jpg",
        desc: "Silhouette modern, cushioning responsif, ideal untuk kegiatan harian.",
      },
      {
        id: "p2",
        name: "Adidas Forum Low",
        category: "Sneakers",
        price: 1800000,
        stock: 8,
        img: "img/adidas-forum.jpg",
        desc: "Desain klasik yang mudah dipadupadankan, material berkualitas.",
      },
      {
        id: "p3",
        name: "New Balance 550",
        category: "Sneakers",
        price: 1650000,
        stock: 6,
        img: "img/nb-550.jpg",
        desc: "Retro aesthetic dengan kenyamanan tinggi untuk penggunaan urban.",
      },
      {
        id: "p4",
        name: "Nike Dunk SB",
        category: "Sneakers",
        price: 2500000,
        stock: 4,
        img: "img/nike-dunksb.jpg",
        desc: "Detail premium pada upper dan sole, desain skate-inspired.",
      },
      {
        id: "p5",
        name: "Converse Chuck 70",
        category: "Sneakers",
        price: 900000,
        stock: 15,
        img: "img/converse-chuck70.jpg",
        desc: "Klasik, ringan, dan mudah dipadu-padankan.",
      },
      {
        id: "p6",
        name: "Oversized Hoodie — Black",
        category: "Apparel",
        price: 450000,
        stock: 20,
        img: "img/hoodie-oversized.jpg",
        desc: "Fleece lembut, potongan oversized untuk layering.",
      },
      {
        id: "p7",
        name: "Graphic Tee — Minimal",
        category: "Apparel",
        price: 150000,
        stock: 50,
        img: "img/graphic-tee.jpg",
        desc: "Cotton combed, print tahan lama dengan desain minimal.",
      },
      {
        id: "p8",
        name: "Cargo Pants — Utility",
        category: "Apparel",
        price: 320000,
        stock: 10,
        img: "img/cargo-pants.jpg",
        desc: "Bahan tebal, potongan relaxed, kantong fungsional.",
      },
      {
        id: "p9",
        name: "Varsity Jacket",
        category: "Apparel",
        price: 600000,
        stock: 5,
        img: "img/jacket-varsity.jpg",
        desc: "Perpaduan wool dan faux leather, finishing rapi.",
      },
    ];
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(data));
    return data;
  }

  function loadProducts() {
    const raw = localStorage.getItem(KEY_PRODUCTS);
    return raw ? JSON.parse(raw) : seed();
  }
  function saveProducts(list) {
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  }
  function addProduct(product) {
    const list = loadProducts();
    list.unshift(product);
    saveProducts(list);
  }

  function addUser(user) {
    const raw = localStorage.getItem(KEY_USERS);
    const list = raw ? JSON.parse(raw) : [];
    list.push(user);
    localStorage.setItem(KEY_USERS, JSON.stringify(list));
  }

  function addMessage(msg) {
    const raw = localStorage.getItem(KEY_MESSAGES);
    const list = raw ? JSON.parse(raw) : [];
    list.push(msg);
    localStorage.setItem(KEY_MESSAGES, JSON.stringify(list));
  }

  return {
    loadProducts,
    saveProducts,
    addProduct,
    addUser,
    addMessage,
  };
})();

/* HELPERS */
function formatRupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

/* RENDER: product grid */
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
        <div class="card-title">${p.name}</div>
        <div class="card-desc">${
          p.desc.length > 110 ? p.desc.slice(0, 110) + "…" : p.desc
        }</div>
        <div class="card-meta">
          <div>
            <div class="price">${formatRupiah(p.price)}</div>
            <div style="font-size:.85rem;color:var(--muted)">Stok ${
              p.stock
            } • ${p.category}</div>
          </div>
          <div>
            <a class="btn btn-outline" href="detail-produk.html?id=${encodeURIComponent(
              p.id
            )}">Lihat</a>
          </div>
        </div>
      </div>
    `;
    cont.appendChild(el);
  });
}

/* PAGE: produk (search & filter) */
function initProdukPage() {
  const products = Storage.loadProducts();
  renderProductGrid("#produk-grid", products);

  const sel = document.querySelector("#filter-category");
  const search = document.querySelector("#search-input");

  if (sel) {
    sel.addEventListener("change", () => {
      const val = sel.value;
      const list = val
        ? Storage.loadProducts().filter((x) => x.category === val)
        : Storage.loadProducts();
      renderProductGrid("#produk-grid", list);
    });
  }
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      const list = Storage.loadProducts().filter(
        (x) =>
          x.name.toLowerCase().includes(q) || x.desc.toLowerCase().includes(q)
      );
      renderProductGrid("#produk-grid", list);
    });
  }
}

/* PAGE: tambah-produk */
function initTambahProduk() {
  const form = document.querySelector("#form-tambah");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("nama_produk").trim();
    const price = Number(fd.get("harga")) || 0;
    const category = fd.get("kategori");
    const stock = Number(fd.get("stok")) || 0;
    const desc = fd.get("deskripsi").trim();
    const file = fd.get("gambar");

    if (!name || !price || !category) {
      alert("Nama produk, harga, dan kategori wajib diisi.");
      return;
    }

    const handleSave = (imgSrc) => {
      const product = {
        id: "p" + Date.now(),
        name,
        category,
        price,
        stock,
        img: imgSrc,
        desc,
      };
      Storage.addProduct(product);
      // redirect to product list
      window.location.href = "produk.html";
    };

    if (file && file.size > 0 && file instanceof File) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        handleSave(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      handleSave("img/placeholder.jpg");
    }
  });
}

/* PAGE: detail-produk */
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  const p = Storage.loadProducts().find((x) => x.id === id);
  const container = document.querySelector("#detail-container");
  if (!container) return;
  if (!p) {
    container.innerHTML = '<div class="form">Produk tidak ditemukan.</div>';
    return;
  }
  container.innerHTML = `
    <div class="detail">
      <div class="img"><img src="${p.img}" alt="${
    p.name
  }" style="width:100%;height:100%;object-fit:cover;"></div>
      <div>
        <h2>${p.name}</h2>
        <div style="color:var(--muted);margin-bottom:.6rem">${
          p.category
        } • Stok ${p.stock}</div>
        <div style="font-size:1.1rem;font-weight:800;margin-bottom:.8rem">${formatRupiah(
          p.price
        )}</div>
        <p style="color:var(--muted);margin-bottom:1rem">${p.desc}</p>
        <div style="display:flex;gap:.6rem;">
          <button id="add-to-cart" class="btn btn-primary">Tambah ke Keranjang</button>
          <a class="btn btn-outline" href="produk.html">Kembali</a>
        </div>
      </div>
    </div>
  `;
  const btn = document.getElementById("add-to-cart");
  if (btn)
    btn.addEventListener("click", () => {
      // light cart interaction: store in sessionStorage for session-only
      const cartKey = "urbansole_cart";
      const raw = sessionStorage.getItem(cartKey);
      const cart = raw ? JSON.parse(raw) : [];
      cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      sessionStorage.setItem(cartKey, JSON.stringify(cart));
      alert("Produk ditambahkan ke keranjang.");
    });
}

/* PAGE: register */
function initRegister() {
  const form = document.querySelector("#form-register");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get("username").trim();
    const email = fd.get("email").trim();
    const password = fd.get("password").trim();
    if (!username || !email || !password) {
      alert("Lengkapi data pendaftaran.");
      return;
    }
    Storage.addUser({
      id: "u" + Date.now(),
      username,
      email,
      created: new Date().toISOString(),
    });
    window.location.href = "index.html";
  });
}

/* PAGE: kontak */
function initKontak() {
  const form = document.querySelector("#form-kontak");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name").trim();
    const email = fd.get("email").trim();
    const message = fd.get("message").trim();
    if (!name || !email || !message) {
      alert("Mohon isi semua field.");
      return;
    }
    Storage.addMessage({
      id: "m" + Date.now(),
      name,
      email,
      message,
      created: new Date().toISOString(),
    });
    form.reset();
    alert("Pesan terkirim. Terima kasih.");
  });
}

/* INIT on DOMContentLoaded */
document.addEventListener("DOMContentLoaded", function () {
  try {
    renderProductGrid("#produk-grid", Storage.loadProducts().slice(0, 3));
  } catch (e) {}
  try {
    initProdukPage();
  } catch (e) {}
  try {
    initTambahProduk();
  } catch (e) {}
  try {
    initDetailPage();
  } catch (e) {}
  try {
    initRegister();
  } catch (e) {}
  try {
    initKontak();
  } catch (e) {}
});