document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            return fetch('footer.html');
        })
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            initializeHeader();
        });
});



// Initialize header features (e.g., login/logout)
function initializeHeader() {
    let SuccessUserLogin = localStorage.getItem("SuccessUserLogin");
let usernameIndicator = document.getElementById("SuccessUserLoginPrintout");
let logoutBtn = document.getElementById("logoutBtn");

    if (SuccessUserLogin) {
        usernameIndicator.textContent = SuccessUserLogin;
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('SuccessUserLogin');
            window.location.href = 'login.html';
        });
    } else {
        usernameIndicator.textContent = '';
        logoutBtn.textContent = 'Login';
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}


// Handle logout functionality when user is logged in
logoutBtn.addEventListener("click", function () {
    if (SuccessUserLogin) {
        // Clear login data and redirect to login page
        localStorage.removeItem("SuccessUserLogin");
        window.location.href = "./login.html";
    }
});
