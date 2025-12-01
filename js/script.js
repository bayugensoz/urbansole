/* ==========================================================
   JS/SCRIPT.JS — FINAL FULL VERSION
   Fitur: Register, Upload Gambar, Detail Produk, Dark Mode, SHOPPING CART, WISHLIST, CHECKOUT
   ========================================================== */

// 1. THEME MANAGER (DARK MODE)
(function ThemeManager() {
  const root = document.documentElement;
  const key = 'urbansole_theme';
  const saved = localStorage.getItem(key) || 'light';

  if (saved === 'dark') root.classList.add('dark');

  window.toggleTheme = function () {
    const isDark = root.classList.contains('dark');
    if (isDark) {
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
    list.unshift(product);
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  }

  return { loadProducts, addProduct };
})();

// 3. CART MANAGER
const CartManager = (function () {
  const KEY_CART = "urbansole_cart";

  function getCart() {
    return JSON.parse(localStorage.getItem(KEY_CART)) || [];
  }

  function saveCart(cart) {
    localStorage.setItem(KEY_CART, JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(product) {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
    alert("Barang masuk keranjang! 🛒");
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
  }

  function clearCart() {
    localStorage.removeItem(KEY_CART);
    updateCartCount();
    renderCartItems();
  }

  function getTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price, 0);
  }

  function updateCartCount() {
    const count = getCart().length;
    const badges = document.querySelectorAll(".cart-badge");
    badges.forEach(el => el.innerText = count);
  }

  return { getCart, addToCart, removeFromCart, clearCart, getTotal, updateCartCount };
})();

// 4. WISHLIST MANAGER
const WishlistManager = (function () {
  const KEY_WISHLIST = "urbansole_wishlist";

  function getWishlist() {
    return JSON.parse(localStorage.getItem(KEY_WISHLIST)) || [];
  }

  function saveWishlist(list) {
    localStorage.setItem(KEY_WISHLIST, JSON.stringify(list));
  }

  function toggleWishlist(product) {
    let list = getWishlist();
    const index = list.findIndex(item => item.id === product.id);

    if (index === -1) {
      list.push(product);
      alert("Disimpan ke Wishlist! ❤️");
    } else {
      list.splice(index, 1);
      alert("Dihapus dari Wishlist. 💔");
    }
    saveWishlist(list);

    // Refresh views
    const allProducts = Storage.loadProducts();
    if (document.querySelector("#home-product-grid")) renderProductGrid("#home-product-grid", allProducts.slice(0, 6));
    if (document.querySelector("#catalog-grid")) renderProductGrid("#catalog-grid", allProducts);
    if (document.querySelector("#wishlist-grid")) renderWishlistItems();
    if (document.getElementById("detail-container")) renderDetail();
  }

  function isInWishlist(id) {
    const list = getWishlist();
    return list.some(item => item.id === id);
  }

  return { getWishlist, toggleWishlist, isInWishlist };
})();

// HELPER: FORMAT RUPIAH
function formatRupiah(n) {
  return "IDR " + (n / 1000).toFixed(0) + "K";
}

// 5. RENDER FUNCTIONS

// Render Grid Kartu Produk
function renderProductGrid(selector, products) {
  const cont = document.querySelector(selector);
  if (!cont) return;
  cont.innerHTML = "";

  products.forEach((p) => {
    const el = document.createElement("div");
    el.className = "card";
    const productData = encodeURIComponent(JSON.stringify(p));

    // Wishlist Logic
    const isLoved = WishlistManager.isInWishlist(p.id);
    const heartClass = isLoved ? "btn-danger" : "btn-outline";
    const heartText = isLoved ? "❤️" : "🤍";

    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <div style="opacity:0.7; font-size:0.9rem;">${p.category}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
            <div class="card-price">${formatRupiah(p.price)}</div>
            <div style="display:flex; gap:5px;">
                <button onclick="toggleWishlistHandler('${productData}')" class="btn ${heartClass}" style="padding:5px 10px; font-size:0.8rem;">${heartText}</button>
                <a href="detail-produk.html?id=${p.id}" class="btn" style="padding:5px 10px; font-size:0.8rem; background:#fff; color:#000;">LIHAT</a>
                <button onclick="addToCartHandler('${productData}')" class="btn btn-primary" style="padding:5px 10px; font-size:0.8rem;">+</button>
            </div>
        </div>
      </div>
    `;
    cont.appendChild(el);
  });
}

// Render Wishlist Items
window.renderWishlistItems = function () {
  const cont = document.getElementById("wishlist-grid");
  if (!cont) return;

  const list = WishlistManager.getWishlist();
  cont.innerHTML = "";

  if (list.length === 0) {
    cont.innerHTML = `<p style="grid-column:1/-1; text-align:center; opacity:0.7;">Belum ada barang impian nih.</p>`;
    return;
  }

  list.forEach((p) => {
    const el = document.createElement("div");
    el.className = "card";
    const productData = encodeURIComponent(JSON.stringify(p));

    el.innerHTML = `
          <img src="${p.img}" alt="${p.name}">
          <div class="card-body">
            <h3 class="card-title">${p.name}</h3>
            <div style="opacity:0.7; font-size:0.9rem;">${p.category}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                <div class="card-price">${formatRupiah(p.price)}</div>
                <div style="display:flex; gap:5px;">
                    <button onclick="toggleWishlistHandler('${productData}')" class="btn btn-danger" style="padding:5px 10px; font-size:0.8rem;">💔</button>
                    <button onclick="addToCartHandler('${productData}')" class="btn btn-primary" style="padding:5px 10px; font-size:0.8rem;">🛒</button>
                </div>
            </div>
          </div>
        `;
    cont.appendChild(el);
  });
};

// Render Halaman Detail
function renderDetail() {
  const container = document.getElementById("detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const products = Storage.loadProducts();
  const p = products.find(item => item.id === id);

  if (!p) {
    container.innerHTML = `<h2>Produk tidak ditemukan :(</h2><a href="produk.html" class="btn">Kembali</a>`;
    return;
  }

  const productData = encodeURIComponent(JSON.stringify(p));
  const isLoved = WishlistManager.isInWishlist(p.id);
  const heartText = isLoved ? "HAPUS DARI WISHLIST 💔" : "SIMPAN KE WISHLIST ❤️";
  const heartClass = isLoved ? "btn-danger" : "btn-outline";

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
                    <button onclick="addToCartHandler('${productData}')" class="btn btn-primary">BELI SEKARANG</button>
                    <button onclick="toggleWishlistHandler('${productData}')" class="btn ${heartClass}">${heartText}</button>
                </div>
                <a href="produk.html" class="btn btn-outline" style="margin-top:1rem;">KEMBALI</a>
            </div>
        </div>
    `;
}

// Global Handlers
window.addToCartHandler = function (encodedProduct) {
  const product = JSON.parse(decodeURIComponent(encodedProduct));
  CartManager.addToCart(product);
};

window.toggleWishlistHandler = function (encodedProduct) {
  const product = JSON.parse(decodeURIComponent(encodedProduct));
  WishlistManager.toggleWishlist(product);
};

// 6. MODAL CART RENDERER
function initCartModal() {
  const modalHTML = `
    <div id="cart-modal" class="modal-overlay">
        <div class="modal-box">
            <div class="modal-header">
                <h2 class="modal-title">KERANJANG</h2>
                <button onclick="toggleCart()" class="btn btn-outline" style="padding:5px 10px;">X</button>
            </div>
            <div id="cart-items" class="cart-list"></div>
            <div class="modal-footer">
                <span class="cart-total">TOTAL: <span id="cart-total-price">IDR 0</span></span>
                <div style="display:flex; gap:1rem; justify-content:flex-end;">
                    <button onclick="CartManager.clearCart()" class="btn btn-danger" style="font-size:0.8rem;">KOSONGKAN</button>
                    <button onclick="checkoutHandler()" class="btn btn-primary">CHECKOUT</button>
                </div>
            </div>
        </div>
    </div>
    `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.toggleCart = function () {
  const modal = document.getElementById("cart-modal");
  modal.classList.toggle("active");
  if (modal.classList.contains("active")) {
    renderCartItems();
  }
};

window.renderCartItems = function () {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total-price");
  const cart = CartManager.getCart();

  list.innerHTML = "";
  if (cart.length === 0) {
    list.innerHTML = "<p style='text-align:center; opacity:0.7;'>Keranjang kosong melompong.</p>";
    totalEl.innerText = "IDR 0";
    return;
  }

  cart.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
            <img src="${item.img}" alt="img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)}</div>
            </div>
            <button onclick="CartManager.removeFromCart(${index})" class="btn btn-outline" style="padding:2px 8px; height:fit-content;">X</button>
        `;
    list.appendChild(el);
  });

  totalEl.innerText = formatRupiah(CartManager.getTotal());
};

window.checkoutHandler = function () {
  const cart = CartManager.getCart();
  if (cart.length === 0) {
    alert("Keranjang kosong, mau beli angin?");
    return;
  }
  // Redirect to checkout page if available, else alert
  if (window.location.href.includes("checkout.html")) {
    // Already there
  } else {
    window.location.href = "checkout.html";
  }
};


// 7. FORM FUNCTIONS
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

function initTambahProduk() {
  const form = document.querySelector("#form-tambah");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const product = {
      id: "p" + Date.now(),
      name: fd.get("nama_produk"),
      category: fd.get("kategori"),
      price: Number(fd.get("harga")),
      desc: fd.get("deskripsi"),
      img: "img/placeholder.jpg"
    };

    const file = fd.get("gambar");
    if (file && file.size > 0) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        product.img = ev.target.result;
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

// 8. CHECKOUT LOGIC
function renderCheckout() {
  const cont = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");

  const cart = CartManager.getCart();

  if (cart.length === 0) {
    cont.innerHTML = "<p>Keranjang kosong.</p>";
    window.location.href = "produk.html"; // Redirect if empty
    return;
  }

  cont.innerHTML = "";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.marginBottom = "0.5rem";
    row.innerHTML = `
          <span>${item.name}</span>
          <span>${formatRupiah(item.price)}</span>
        `;
    cont.appendChild(row);
  });

  const total = CartManager.getTotal();
  subtotalEl.innerText = formatRupiah(total);
  totalEl.innerText = formatRupiah(total);
}

// 11. ORDER MANAGER
const OrderManager = (function () {
  const KEY_ORDERS = "urbansole_orders";

  function getOrders() {
    return JSON.parse(localStorage.getItem(KEY_ORDERS)) || [];
  }

  function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
  }

  return { getOrders, saveOrder };
})();

function initCheckout() {
  const form = document.querySelector("#form-checkout");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const order = {
      id: "ORD-" + Date.now(),
      date: new Date().toLocaleString(),
      customer: {
        name: fd.get("nama"),
        phone: fd.get("phone"),
        address: fd.get("alamat"),
        city: fd.get("kota"),
        zip: fd.get("kodepos")
      },
      payment: fd.get("payment"),
      items: CartManager.getCart(),
      total: CartManager.getTotal(),
      status: "Pending"
    };

    OrderManager.saveOrder(order);

    alert(`Terima kasih ${order.customer.name}! Pesanan lo berhasil dibuat. \nID Pesanan: ${order.id}`);

    CartManager.clearCart();
    window.location.href = "index.html";
  });
}

// 12. ADMIN DASHBOARD LOGIC
function renderAdminOrders() {
  const tbody = document.getElementById("admin-orders-body");
  if (!tbody) return;

  const orders = OrderManager.getOrders();
  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada pesanan.</td></tr>`;
    return;
  }

  orders.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.date}</td>
            <td>${o.customer.name}</td>
            <td>${formatRupiah(o.total)}</td>
            <td><span class="status-badge">${o.status}</span></td>
            <td>
                <button class="btn btn-outline" style="padding:2px 5px; font-size:0.8rem;" onclick="alert('Detail: ${o.items.map(i => i.name).join(", ")}')">Lihat</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function renderAdminProducts() {
  const tbody = document.getElementById("admin-products-body");
  if (!tbody) return;

  const products = Storage.loadProducts();
  tbody.innerHTML = "";

  products.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><img src="${p.img}" style="width:50px; height:50px; object-fit:cover;"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${formatRupiah(p.price)}</td>
            <td>
                <button class="btn btn-danger" style="padding:2px 5px; font-size:0.8rem;" onclick="deleteProduct('${p.id}')">Hapus</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

window.deleteProduct = function (id) {
  if (!confirm("Yakin mau hapus produk ini?")) return;

  let products = Storage.loadProducts();
  products = products.filter(p => p.id !== id);
  localStorage.setItem("urbansole_products", JSON.stringify(products));

  renderAdminProducts();
  alert("Produk dihapus.");
};

function initAdmin() {
  if (document.getElementById("admin-orders-body")) {
    renderAdminOrders();
    renderAdminProducts();
  }
}

// 9. MAIN INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  const allProducts = Storage.loadProducts();

  // Init Admin
  initAdmin();

  // Init Cart Modal & Badge
  initCartModal();
  CartManager.updateCartCount();

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
      if (filter && filter.value) result = result.filter(x => x.category === filter.value);
      if (search && search.value) result = result.filter(x => x.name.toLowerCase().includes(search.value.toLowerCase()));
      renderProductGrid("#catalog-grid", result);
    };

    if (search) search.addEventListener("input", doFilter);
    if (filter) filter.addEventListener("change", doFilter);
  }

  // C. Halaman Detail
  if (document.getElementById("detail-container")) {
    renderDetail();
  }

  // D. Halaman Wishlist
  if (document.getElementById("wishlist-grid")) {
    renderWishlistItems();
  }

  // E. Init Forms
  initRegister();
  initLogin();
  initKontak();
  initTambahProduk();
  initCheckout();

  // F. Halaman Checkout
  if (document.getElementById("checkout-items")) {
    renderCheckout();
  }

  // G. Check Session
  UserManager.checkSession();
});

// 10. USER MANAGER (AUTH)
const UserManager = (function () {
  const KEY_USER = "urbansole_user";

  function login(username) {
    localStorage.setItem(KEY_USER, username);
    window.location.href = "index.html";
  }

  function logout() {
    localStorage.removeItem(KEY_USER);
    window.location.reload();
  }

  function getUser() {
    return localStorage.getItem(KEY_USER);
  }

  function checkSession() {
    const user = getUser();
    const headerActions = document.querySelector(".header .container > div:last-child");

    if (user && headerActions) {
      // User is logged in
      const userBtn = document.createElement("button");
      userBtn.className = "btn header-user-btn";
      // userBtn.style.padding = "5px 10px"; // Removed inline style
      // userBtn.style.background = "var(--yellow)"; // Removed inline style
      // userBtn.style.marginRight = "1rem"; // Removed inline style
      userBtn.innerText = `Hi, ${user}`;
      userBtn.onclick = () => {
        if (confirm("Mau logout?")) logout();
      };

      // Insert before the first child (Cart)
      headerActions.insertBefore(userBtn, headerActions.firstChild);
    } else if (headerActions) {
      // User is NOT logged in -> Add Login Button
      const loginBtn = document.createElement("a");
      loginBtn.href = "login.html";
      loginBtn.className = "btn header-user-btn"; // Reuse class for consistency
      // loginBtn.style.padding = "5px 10px";
      // loginBtn.style.marginRight = "1rem";
      // loginBtn.style.fontSize = "0.9rem";
      loginBtn.innerText = "LOGIN";

      headerActions.insertBefore(loginBtn, headerActions.firstChild);
    }
  }

  return { login, logout, getUser, checkSession };
})();

function initLogin() {
  const form = document.querySelector("#form-login");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get("username");

    // Mock Login Success
    alert("Login berhasil! Welcome back.");
    UserManager.login(username);
  });
}
