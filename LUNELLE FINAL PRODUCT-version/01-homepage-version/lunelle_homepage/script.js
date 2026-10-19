// LUNELLE homepage interactions. The catalogue is sample data for the first build.
const products = [
  { id: 1, name: "Rose Velvet Lipstick", category: "Lips", price: 15000, rating: "★★★★★", reviews: 24, emoji: "💄", bg: "#f2d8d2", badge: "BEST LOVED" },
  { id: 2, name: "Soft Matte Foundation", category: "Face", price: 22000, rating: "★★★★★", reviews: 18, emoji: "🧴", bg: "#f1dfce", badge: "FAVOURITE" },
  { id: 3, name: "Everyday Eyes Palette", category: "Eyes", price: 28000, rating: "★★★★★", reviews: 16, emoji: "🎨", bg: "#ead6d2", badge: "LUNELLE PICK" },
  { id: 4, name: "Lash Definition Mascara", category: "Eyes", price: 18000, rating: "★★★★★", reviews: 12, emoji: "🖤", bg: "#e8d9d3", badge: "" },
  { id: 5, name: "Dewy Face Moisturizer", category: "Skincare", price: 16000, rating: "★★★★★", reviews: 9, emoji: "🫙", bg: "#f3e1d6", badge: "" },
  { id: 6, name: "Petal Shine Lip Gloss", category: "Lips", price: 12000, rating: "★★★★★", reviews: 11, emoji: "✨", bg: "#f0d0d1", badge: "NEW" },
  { id: 7, name: "Soft Glow Blush", category: "Face", price: 16000, rating: "★★★★★", reviews: 8, emoji: "🌸", bg: "#f3d7d5", badge: "NEW" },
  { id: 8, name: "Precision Liquid Liner", category: "Eyes", price: 14000, rating: "★★★★★", reviews: 7, emoji: "✒️", bg: "#e7d9d4", badge: "" },
  { id: 9, name: "Rosewater Setting Mist", category: "Face", price: 18000, rating: "★★★★★", reviews: 6, emoji: "🧴", bg: "#f4dcd4", badge: "NEW" },
  { id: 10, name: "Nude Blending Sponge", category: "Tools", price: 8000, rating: "★★★★★", reviews: 5, emoji: "💗", bg: "#f0d9d2", badge: "" }
];

const cart = [];
const wishlist = new Set();
let currentFilter = "all";

const money = (amount) => `${amount.toLocaleString("en-US")} RWF`;
const productGrid = document.getElementById("product-grid");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderProducts() {
  const visible = products.filter(product => currentFilter === "all" || product.category === currentFilter);
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-visual" style="--product-bg:${product.bg}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="wishlist-mini" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">${wishlist.has(product.id) ? "♥" : "♡"}</button>
        <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-meta">${product.category} · Sample product</p>
        <div class="stars" aria-label="Sample rating">${product.rating}</div>
        <p class="product-meta">(${product.reviews} sample reviews)</p>
        <p class="product-price">${money(product.price)}</p>
        <button class="add-button" data-add="${product.id}">＋ Add to bag</button>
      </div>
    </article>`).join("");
}

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wishlist]");
  if (addButton) {
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    cart.push(product);
    updateCartCount();
    showToast(`${product.name} added to your bag.`);
  }
  if (wishButton) {
    const id = Number(wishButton.dataset.wishlist);
    const product = products.find(item => item.id === id);
    if (wishlist.has(id)) wishlist.delete(id); else wishlist.add(id);
    renderProducts();
    showToast(wishlist.has(id) ? `${product.name} saved to your wishlist.` : `${product.name} removed from your wishlist.`);
  }
});

document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
    renderProducts();
  });
});

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    currentFilter = card.dataset.category;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === currentFilter));
    renderProducts();
  });
});

document.getElementById("cart-button").addEventListener("click", () => {
  if (!cart.length) return showToast("Your bag is empty. Add a sample product to get started.");
  const summary = cart.map(item => item.name).join(", ");
  showToast(`Your bag has ${cart.length} item(s). Checkout will be added in a later part.`);
  console.info("Sample cart:", summary);
});

document.getElementById("wishlist-button").addEventListener("click", () => {
  if (!wishlist.size) return showToast("Your wishlist is waiting for a favourite.");
  showToast(`You have saved ${wishlist.size} favourite(s).`);
});

const searchInput = document.getElementById("search-input");
const suggestions = document.getElementById("search-suggestions");
function updateSuggestions() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { suggestions.hidden = true; suggestions.innerHTML = ""; return; }
  const matches = products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(query)).slice(0, 5);
  suggestions.innerHTML = matches.length
    ? matches.map(p => `<button type="button" data-search-product="${p.id}">${p.name} <small>· ${money(p.price)}</small></button>`).join("")
    : `<button type="button" disabled>No sample products found</button>`;
  suggestions.hidden = false;
}
searchInput.addEventListener("input", updateSuggestions);
suggestions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-product]");
  if (!button) return;
  const product = products.find(p => p.id === Number(button.dataset.searchProduct));
  currentFilter = product.category;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === currentFilter));
  renderProducts();
  suggestions.hidden = true;
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  showToast(`Showing ${product.category.toLowerCase()} products.`);
});
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  const match = products.find(p => `${p.name} ${p.category}`.toLowerCase().includes(query));
  if (match) {
    currentFilter = match.category;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === currentFilter));
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    showToast(`Showing ${match.category.toLowerCase()} products.`);
  } else if (query) showToast("No sample match yet. Try lipstick, face or eyes.");
  suggestions.hidden = true;
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".search")) suggestions.hidden = true;
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  const nav = document.getElementById("main-nav");
  const open = nav.classList.toggle("open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
  document.getElementById("menu-toggle").setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
document.querySelectorAll("#main-nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("main-nav").classList.remove("open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
}));

document.getElementById("newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("newsletter-email").value.trim();
  document.getElementById("newsletter-message").textContent = `Thank you! ${email} is entered for this demo. Connect a mailing service before launch.`;
  event.target.reset();
});
document.getElementById("quiz-button").addEventListener("click", () => {
  document.getElementById("quiz-message").textContent = "The interactive shade quiz will be built in a later part. For now, explore the Face and Lips categories above.";
});
document.querySelector(".announcement-close").addEventListener("click", () => {
  document.querySelector(".announcement").remove();
});
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
