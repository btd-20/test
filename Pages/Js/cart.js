  // Initialize Cart in Local Storage
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  
  // Add Item to Cart
  function addToCart(productId, productName, productPrice) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.push({ id: productId, name: productName, price: productPrice });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${productName} has been added to your cart!`);
  }
  
  // Update Cart Count in Navbar
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    document.getElementById('cart-count').textContent = cart.length;
  }
  3
  // Display Cart Items
  function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;
  
    cart.forEach((item, index) => {
      total += item.price;
      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <p>${item.name} - $${item.price.toFixed(2)}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>`;
    });
  
    cartTotalContainer.textContent = total.toFixed(2);
  }
  
  // Remove Item from Cart
  function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
  }
  
  // Event Listener for Page Load
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items')) {
      displayCartItems();
    }
  });
  