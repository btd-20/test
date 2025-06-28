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

  if (username) {
    usernameIndicator.textContent = username;
    logoutBtn.textContent = "Logout";

    // Remove previous event listeners by cloning the node
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

    newLogoutBtn.addEventListener("click", () => {
      // Clear user data on logout
      localStorage.removeItem("name");
      localStorage.removeItem("userUID");
      // Optionally sign out from Firebase auth as well:
      // signOut(auth).catch(console.error);

      window.location.href = "login.html";
    });
  } else {
    usernameIndicator.textContent = "";
    logoutBtn.textContent = "Login";

    // Remove previous event listeners by cloning the node
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

    newLogoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}
