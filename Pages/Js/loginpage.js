let usernameLogin = document.getElementById("usernameLogin");
let passwordLogin = document.getElementById("passwordLogin");
let loginBtn = document.querySelector(".loginBtn");

loginBtn.addEventListener("click", function () {
    console.log(usernameLogin.value);
    console.log(passwordLogin.value);

    // lấy login credential từ local storage
    let listUserLocalStorage = JSON.parse(localStorage.getItem("listUser")) || [];


    let isAuthenticated = false;
    for (let i = 0; i < listUserLocalStorage.length; i++) {
        if (
            listUserLocalStorage[i].username === usernameLogin.value &&
            listUserLocalStorage[i].password === passwordLogin.value
        ) {
            isAuthenticated = true;
            break;
        }
    }

    if (isAuthenticated) {

        localStorage.setItem("SuccessUserLogin", usernameLogin.value);
        console.log("Login successful!");
        alert("Welcome back, " + usernameLogin.value + "!");


        // reset ô input
        usernameLogin.value = "";
        passwordLogin.value = "";
        window.location.href = "./index.html"

        

        //windows.location.href = "./home.html"
        //windows.location.href = "../Day9/day9.html"
        
    } else {
        console.log("Invalid username or password!");
        alert("Invalid username or password. Please try again.");
    }

});
