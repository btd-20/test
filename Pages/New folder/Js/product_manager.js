const { initializeApp } = firebase;
const {
  getDatabase,
  ref,
  push,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
} = firebase.database;

// Initialize Firebase
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

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Rest of your existing product_manager.js code remains the same...
let selectedCategory = "";
let editingId = null;
let productList = {};

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
const successAlert = document.getElementById("successAlert");
const errorAlert = document.getElementById("errorAlert");

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Category selection
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

  // Form actions
  saveButton.addEventListener("click", saveProduct);
  resetButton.addEventListener("click", resetForm);

  // Color management
  document.getElementById("addColor").addEventListener("click", addColorGroup);
  colorContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-color")) {
      if (document.querySelectorAll(".color-group").length > 1) {
        e.target.closest(".color-group").remove();
      } else {
        alert("At least one color is required.");
      }
    }
  });

  // Live preview updates
  productNameInput.addEventListener("input", updatePreview);
  productTypeInput.addEventListener("input", updatePreview);
  priceInput.addEventListener("input", updatePreview);
  discountInput.addEventListener("input", updatePreview);
});

// Save product to Firebase
async function saveProduct() {
  const name = productNameInput.value;
  const type = productTypeInput.value;
  const originalPrice = parseInt(priceInput.value);
  const discountPrice = parseInt(discountInput.value) || originalPrice;

  if (!selectedCategory || !name || !type || !originalPrice) {
    showAlert(errorAlert);
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
    showAlert(errorAlert);
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
      showAlert(successAlert, "Product updated successfully!");
    } else {
      await push(ref(db, "products"), product);
      showAlert(successAlert, "Product added successfully!");
    }

    resetForm();
    loadProducts(selectedCategory);
  } catch (err) {
    showAlert(errorAlert, "Error saving product: " + err.message);
  }
}

// Load products from Firebase
async function loadProducts(category) {
  productGrid.innerHTML = "Loading...";

  try {
    const q = query(
      ref(db, "products"),
      orderByChild("category"),
      equalTo(category)
    );
    const snapshot = await get(q);

    if (snapshot.exists()) {
      productList = snapshot.val();
      renderProductCards(productList);
    } else {
      productGrid.innerHTML = "<p>No products found in this category.</p>";
    }
  } catch (error) {
    productGrid.innerHTML = "<p>Error loading products.</p>";
    console.error("Error loading products:", error);
  }
}

// Render product cards
function renderProductCards(products) {
  productGrid.innerHTML = "";

  Object.entries(products).forEach(([id, product]) => {
    const img =
      product.colors?.[0]?.images?.[0] ||
      "https://via.placeholder.com/300x300?text=No+Image";
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
              ? `
            <span class="original-price">${product.originalPrice.toLocaleString()}₫</span>
            <span class="discount-percent">${discount}% off</span>
          `
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

// Edit product
function editProduct(id) {
  const product = productList[id];
  if (!product) return;

  // Fill the form
  productNameInput.value = product.name;
  productTypeInput.value = product.type;
  priceInput.value = product.originalPrice;
  discountInput.value = product.discountedPrice || "";

  // Clear color groups and add one for each color
  colorContainer.innerHTML = "";
  product.colors.forEach((color) => {
    const group = createColorGroup();
    group.querySelector(".color-name").value = color.name;
    group.querySelector(".image-urls").value = color.images.join(", ");

    // Check the sizes checkboxes
    color.sizes.forEach((size) => {
      const checkbox = group.querySelector(`input[value="${size}"]`);
      if (checkbox) checkbox.checked = true;
    });

    colorContainer.appendChild(group);
  });

  // Set editing state
  editingId = id;
  saveButton.textContent = "Update Product";
  updatePreview();
}

// Delete product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await remove(ref(db, `products/${id}`));
      showAlert(successAlert, "Product deleted successfully!");
      loadProducts(selectedCategory);
    } catch (error) {
      showAlert(errorAlert, "Error deleting product: " + error.message);
    }
  }
}

// Reset form
function resetForm() {
  productNameInput.value = "";
  productTypeInput.value = "";
  priceInput.value = "";
  discountInput.value = "";
  editingId = null;
  saveButton.textContent = "Add Product";

  // Reset color groups (keep one empty group)
  colorContainer.innerHTML = "";
  colorContainer.appendChild(createColorGroup());

  updatePreview();
}

// Update preview panel
function updatePreview() {
  const name = productNameInput.value || "Product Name";
  const type = productTypeInput.value || "Product Type";
  const originalPrice = parseInt(priceInput.value) || 0;
  const discountPrice = parseInt(discountInput.value) || originalPrice;

  document.getElementById("previewName").textContent = name;
  document.getElementById("previewType").textContent = type;

  if (originalPrice > 0) {
    document.getElementById("previewOriginalPrice").textContent =
      originalPrice.toLocaleString() + "₫";

    if (discountPrice > 0 && discountPrice < originalPrice) {
      const discountPercent = Math.round(
        (1 - discountPrice / originalPrice) * 100
      );
      document.getElementById("previewDiscountedPrice").textContent =
        discountPrice.toLocaleString() + "₫";
      document.getElementById("previewDiscountPercent").textContent =
        discountPercent + "% off";
    } else {
      document.getElementById("previewDiscountedPrice").textContent =
        originalPrice.toLocaleString() + "₫";
      document.getElementById("previewDiscountPercent").textContent = "";
    }
  }
}

// Helper to create color group
function createColorGroup() {
  const group = document.createElement("div");
  group.className = "color-group";
  group.innerHTML = `
    <div class="form-group">
      <label>Color Name *</label>
      <input type="text" class="form-control color-name" placeholder="e.g. Red">
    </div>
    <div class="form-group">
      <label>Image URLs (comma separated) *</label>
      <input type="text" class="form-control image-urls" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg">
    </div>
    <div class="form-group">
      <label>Available Sizes *</label>
      <div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-40" value="EU 40">
          <label for="size-40">EU 40</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-40.5" value="EU 40.5">
          <label for="size-40.5">EU 40.5</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-41" value="EU 41">
          <label for="size-41">EU 41</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-42" value="EU 42">
          <label for="size-42">EU 42</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-42.5" value="EU 42.5">
          <label for="size-42.5">EU 42.5</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-43" value="EU 43">
          <label for="size-43">EU 43</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-44" value="EU 44">
          <label for="size-44">EU 44</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-45" value="EU 45">
          <label for="size-45">EU 45</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-46" value="EU 46">
          <label for="size-46">EU 46</label>
        </div>
        <div class="size-checkbox">
          <input type="checkbox" id="size-47.5" value="EU 47.5">
          <label for="size-47.5">EU 47.5</label>
        </div>
      </div>
    </div>
    <button class="btn btn-danger remove-color">Remove Color</button>
  `;
  return group;
}

// Show alert
function showAlert(element, message = "") {
  if (message) element.textContent = message;
  element.style.display = "block";
  setTimeout(() => {
    element.style.display = "none";
  }, 3000);
}

// Make functions available globally
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
