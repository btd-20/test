// Standalone Firebase helpers for use with <script src="...firebase-app.js"></script> and <script src="...firebase-database.js"></script>
// Không dùng import/export, dùng biến global firebase

// Lấy tất cả sản phẩm theo category
function getProductsByCategory(category, callback) {
  const db = firebase.database();
  firebase
    .database()
    .ref("products")
    .on(
      "value",
      function (snapshot) {
        const data = snapshot.val() || {};
        const filtered = {};
        Object.entries(data).forEach(([id, p]) => {
          if (!category || (p.category && p.category === category)) {
            filtered[id] = { ...p, id };
          }
        });
        callback(filtered);
      },
      { onlyOnce: true }
    );
}

// Lấy chi tiết sản phẩm
function getProductById(id, callback) {
  firebase
    .database()
    .ref("products/" + id)
    .once("value", function (snapshot) {
      callback(snapshot.exists() ? { ...snapshot.val(), id } : null);
    });
}

// Thêm sản phẩm mới
function addProduct(product, callback) {
  const newRef = firebase.database().ref("products").push();
  newRef.set(product, callback);
}

// Sửa sản phẩm
function updateProduct(id, product, callback) {
  firebase
    .database()
    .ref("products/" + id)
    .update(product, callback);
}

// Xóa sản phẩm
function deleteProduct(id, callback) {
  firebase
    .database()
    .ref("products/" + id)
    .remove(callback);
}

// Đảm bảo các hàm có thể dùng global
window.getProductsByCategory = getProductsByCategory;
window.getProductById = getProductById;
window.addProduct = addProduct;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;

// Cart functions
export function getCartItems() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(productId, color, size) {
  const cart = getCartItems();
  const existingItem = cart.find(
    (item) =>
      item.productId === productId && item.color === color && item.size === size
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, color, size, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

export function removeCartItem(index) {
  const cart = getCartItems();
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

export function clearCart() {
  localStorage.setItem("cart", JSON.stringify([]));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCartItems();
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
