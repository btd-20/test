document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
      return fetch("footer.html");
    })
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("beforeend", data);
      initializeHeader();
    });
});

function initializeHeader() {
  const username = localStorage.getItem("name");
  const usernameIndicator = document.getElementById("SuccessUserLoginPrintout");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!usernameIndicator || !logoutBtn) return;

  // Remove previous event listeners by replacing the node
  const newLogoutBtn = logoutBtn.cloneNode(true);
  logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

  if (username) {
    usernameIndicator.textContent = username;
    newLogoutBtn.textContent = "Logout";
    newLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("name");
      localStorage.removeItem("userUID");
      window.location.href = "login.html";
    });
  } else {
    usernameIndicator.textContent = "";
    newLogoutBtn.textContent = "Login";
    newLogoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
  updateCartCount();
}

document.querySelectorAll('.dropdown-content a[href="#"]').forEach((a) => {
  const text = a.textContent.trim();
  const parent =
    a.closest(".nav-item")?.querySelector(".dropbtn")?.textContent.trim() ||
    "New";
  const url = `listing.html?category=${encodeURIComponent(
    parent
  )}&subcategory=${encodeURIComponent(text)}`;
  a.href = url;
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize header and footer
  initializeHeader();

  // Set up navigation links
  document.querySelectorAll('.dropdown-content a[href="#"]').forEach((a) => {
    const text = a.textContent.trim();
    const parent =
      a.closest(".nav-item")?.querySelector(".dropbtn")?.textContent.trim() ||
      "New";
    const subcategory =
      a.closest(".column")?.querySelector("h6")?.textContent.trim() || "";

    // Create category path like "Men > Shoes > Running"
    const category = [parent, subcategory, text].filter(Boolean).join(" > ");
    a.href = `listing.html?category=${encodeURIComponent(category)}`;
  });
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.textContent = cart.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  }
}
