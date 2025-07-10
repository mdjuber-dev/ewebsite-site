
let cartCount = 0;
let cartItems = [];
let wishlist = [];

const cartCounter = document.getElementById("cart-count");
const cartPreview = document.getElementById("cart-preview");
const boxes = document.querySelectorAll(".box");
const signupBtn = document.getElementById("signup-btn");
const signInBtn = document.querySelector(".signing");
const searchInput = document.getElementById("search-input1");
const searchSelect = document.getElementById("search-select1");
const cartIcon = document.querySelector(".nav-cart");

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.getElementById("toast-container").appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ✅ Extract URL from background-image: url("...")
function extractImageUrl(bgImage) {
  const match = bgImage.match(/url\(["']?(.*?)["']?\)/);
  return match ? match[1] : "";
}

function updateCartPreview() {
  cartPreview.innerHTML = `<h4>🛒 Your Cart</h4><ul>${cartItems
    .map(
      (item) => `
    <li>
      <div style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 50px; height: 50px; background-image: url('${item.image}'); background-size: cover; border-radius: 5px;"></div>
        <div>
          <p style="margin: 0; font-weight: bold;">${item.title}</p>
          <p style="margin: 0;">${item.price}</p>
        </div>
      </div>
    </li>`
    )
    .join("")}</ul>`;
}

function saveCartToLocalStorage() {
  sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("cartCount", cartCount);
}

function saveWishlist() {
  localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
}

boxes.forEach((box) => {
  const title = box.getAttribute("data-title") || "Unknown";
  const price = box.querySelector("big")?.textContent || "₹0";
  const imageDiv = box.querySelector("div[style*='background-image']");
  const bgImage = extractImageUrl(imageDiv?.style.backgroundImage || "");
  const innerContent = box.querySelector("div");

  const btn = document.createElement("button");
  btn.textContent = "Add to Cart";
  btn.classList.add("cart-btn");
  btn.addEventListener("click", () => {
    cartItems.push({ title, price, image: bgImage });
    cartCount++;
    cartCounter.textContent = cartCount;
    updateCartPreview();
    saveCartToLocalStorage();
    showToast("✅ Item added to cart!");
  });
  innerContent?.appendChild(btn);

  const heart = document.createElement("i");
  heart.className = "fa-regular fa-heart wishlist-icon";
  heart.title = "Add to Wishlist";
  heart.addEventListener("click", () => {
    heart.classList.toggle("fa-solid");
    heart.classList.toggle("wish-active");
    if (heart.classList.contains("fa-solid")) {
      wishlist.push(title);
      showToast(`❤️ ${title} added to wishlist`);
    } else {
      wishlist = wishlist.filter((item) => item !== title);
      showToast(`❌ ${title} removed from wishlist`);
    }
    saveWishlist();
  });
  box.style.position = "relative";
  box.appendChild(heart);
});

cartIcon.addEventListener("mouseenter", () => (cartPreview.style.display = "block"));
cartIcon.addEventListener("mouseleave", () => (cartPreview.style.display = "none"));
cartPreview.addEventListener("mouseleave", () => (cartPreview.style.display = "none"));
cartIcon.addEventListener("click", () => {
  cartPreview.style.display = cartPreview.style.display === "block" ? "none" : "block";
});

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    const category = searchSelect.value;
    if (query) alert(`🔍 Searching for "${query}" in "${category}"`);
    else alert("Please enter a search term!");
  }
});

signInBtn.addEventListener("click", () => {
  const userName = prompt("👤 Enter your name:");
  if (userName) {
    showToast("Welcome, " + userName + "!");
    signInBtn.innerHTML = `<p><span>Hello, ${userName}</span></p><p class="signup">Account & Lists</p>`;
  }
});

if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const name = prompt("👤 Enter your name to sign up:");
    if (name) {
      showToast(`✅ Signed in as ${name}`);
      signupBtn.textContent = `✅ Signed In as ${name}`;
      signupBtn.disabled = true;
      signupBtn.style.backgroundColor = "pink";
    }
  });
}

document.querySelector(".feedback-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  showToast("✅ Thank you for your feedback!");
  this.reset();
});

window.addEventListener("DOMContentLoaded", () => {
  cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  cartCount = parseInt(sessionStorage.getItem("cartCount")) || 0;
  wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

  cartCounter.textContent = cartCount;
  updateCartPreview();
});
