const { initializeApp } = firebase;
const { getDatabase, ref, get, query, orderByChild, equalTo } =
  firebase.database;

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Product functions
export async function getProductsByCategory(category) {
  try {
    const q = query(
      ref(db, "products"),
      orderByChild("category"),
      equalTo(category)
    );
    const snapshot = await get(q);

    if (!snapshot.exists()) return null;

    const products = snapshot.val();
    // Add id to each product
    return Object.entries(products).reduce((acc, [id, product]) => {
      acc[id] = { ...product, id };
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting products:", error);
    return null;
  }
}

export async function getProductById(id) {
  try {
    const snapshot = await get(ref(db, `products/${id}`));
    return snapshot.exists() ? { ...snapshot.val(), id } : null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
}

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
