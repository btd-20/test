// 🌐 Import Firebase SDK modules directly from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// ✅ Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK0BdPNJIYF5v_ar_pQNsZ_gRHJpUZWfc",
  authDomain: "clothingco-database.firebaseapp.com",
  databaseURL:
    "https://clothingco-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clothingco-database",
  storageBucket: "clothingco-database.firebasestorage.app",
  messagingSenderId: "437133311430",
  appId: "1:437133311430:web:21afdc50ee24eddb1646c7",
  measurementId: "G-SGGWD7SM9R",
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Reference to Realtime Database

// 📦 Global variables
let selectedCategory = "";
let editingId = null;
let productList = {};

// 🔗 Grab DOM elements
const productNameInput = document.getElementById("productName");
const productTypeInput = document.getElementById("productType");
const priceInput = document.getElementById("originalPrice");
const discountInput = document.getElementById("discountedPrice");
const saveButton = document.getElementById("saveProduct");
const resetButton = document.getElementById("resetForm");
const categoryLabel = document.getElementById("currentCategory");
const categoryListLabel = document.getElementById("currentCategoryList");
const productGrid = document.getElementById("productsGrid");
const colorContainer = document.getElementById("colorsContainer");

// ✅ Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Handle category selection from navigation
  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const main = link
        .closest(".nav-item")
        ?.querySelector(".dropbtn")
        ?.textContent.trim();
      const sub = link
        .closest(".column")
        ?.querySelector("h6")
        ?.textContent.trim();
      const leaf = link.textContent.trim();
      selectedCategory = `${main}${sub ? " > " + sub : ""} > ${leaf}`;

      categoryLabel.textContent = selectedCategory;
      categoryListLabel.textContent = selectedCategory;
      loadProducts(selectedCategory);
    });
  });

  // Button actions
  saveButton.addEventListener("click", saveProduct);
  resetButton.addEventListener("click", resetForm);
});

// 🧠 Save a new product or update existing one
async function saveProduct() {
  const name = productNameInput.value;
  const type = productTypeInput.value;
  const originalPrice = parseInt(priceInput.value);
  const discountPrice = parseInt(discountInput.value) || originalPrice;

  if (!selectedCategory || !name || !type || !originalPrice) {
    alert("Please fill out all required fields and select a category!");
    return;
  }

  const colors = [...document.querySelectorAll(".color-group")]
    .map((group) => {
      const colorName = group.querySelector(".color-name").value.trim();
      const images = group
        .querySelector(".image-urls")
        .value.split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      const sizes = [
        ...group.querySelectorAll("input[type='checkbox']:checked"),
      ].map((cb) => cb.value);
      if (colorName && images.length && sizes.length) {
        return { name: colorName, images, sizes };
      }
    })
    .filter(Boolean);

  if (colors.length === 0) {
    alert("At least one color option with images and sizes is required.");
    return;
  }

  const product = {
    name,
    type,
    category: selectedCategory,
    originalPrice,
    discountedPrice: discountPrice,
    colors,
    createdAt: new Date().toISOString(),
  };

  try {
    if (editingId) {
      await update(ref(db, `products/${editingId}`), product);
      alert("Product updated!");
    } else {
      await push(ref(db, "products"), product);
      alert("Product added!");
    }

    resetForm();
    loadProducts(selectedCategory);
  } catch (err) {
    alert("Error saving product: " + err.message);
  }
}

// 🔄 Load products for a selected category
async function loadProducts(category) {
  productGrid.innerHTML = "Loading...";
  const q = query(
    ref(db, "products"),
    orderByChild("category"),
    equalTo(category)
  );
  const snapshot = await get(q);
  productList = snapshot.exists() ? snapshot.val() : {};
  renderProductCards(productList);
}

// 🧱 Show product cards
function renderProductCards(products) {
  productGrid.innerHTML = "";
  if (Object.keys(products).length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  Object.entries(products).forEach(([id, product]) => {
    const img = product.colors[0]?.images[0] || "";
    const discount =
      product.originalPrice > product.discountedPrice
        ? Math.round(
            100 - (product.discountedPrice / product.originalPrice) * 100
          )
        : 0;

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <img src="${img}" alt="${product.name}">
        <div class="card-body">
          <h3>${product.name}</h3>
          <p>${product.type}</p>
          <p class="price">
            <span class="discount-price">${product.discountedPrice.toLocaleString()}₫</span>
            ${
              discount > 0
                ? `<span class="original-price">${product.originalPrice.toLocaleString()}₫</span>
            <span class="discount-percent">${discount}% off</span>`
                : ""
            }
          </p>
          <p>Colors: ${product.colors.length}</p>
          <div class="actions">
            <button class="btn btn-primary" onclick="editProduct('${id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteProduct('${id}')">Delete</button>
          </div>
        </div>
      `;

    productGrid.appendChild(card);
  });
}

// 🧽 Clear the form
function resetForm() {
  productNameInput.value = "";
  productTypeInput.value = "";
  priceInput.value = "";
  discountInput.value = "";
  editingId = null;
  saveButton.textContent = "Add Product";

  // Reset color section (if needed)
  const groups = document.querySelectorAll(".color-group");
  for (let i = 1; i < groups.length; i++) groups[i].remove();
  const first = groups[0];
  if (first) {
    first.querySelector(".color-name").value = "";
    first.querySelector(".image-urls").value = "";
    first
      .querySelectorAll("input[type='checkbox']")
      .forEach((cb) => (cb.checked = false));
  }
}

// 📝 Optional: implement editProduct(id), deleteProduct(id) later
