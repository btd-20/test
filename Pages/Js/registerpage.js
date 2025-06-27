let usernameRegister = document.getElementById("usernameRegister");
let passwordRegister = document.getElementById("passwordRegister");
let registerBtn = document.querySelector(".registerBtn");

// Lấy phần listUser ra trước
let listUserLocalStorage = JSON.parse(localStorage.getItem("listUser"));
if (listUserLocalStorage === null) {
    localStorage.setItem("listUser", JSON.stringify([]));
    window.location.reload();
}

registerBtn.addEventListener("click", function () {
    console.log(usernameRegister.value);
    console.log(passwordRegister.value);

    // Check for duplicate username using a for loop
    let isDuplicate = false;
    for (let i = 0; i < listUserLocalStorage.length; i++) {
        if (listUserLocalStorage[i].username === usernameRegister.value) {
            isDuplicate = true;
        }
    }

    if (isDuplicate) {
        alert("That is already used.");
        usernameRegister.value = "";    
    } else {
        // Add the new user if the username is not duplicate
        listUserLocalStorage.push({
            username: usernameRegister.value,
            password: passwordRegister.value
        });
        alert("User registered successfully!");

        // Lưu lại mảng vào localStorage
        localStorage.setItem("listUser", JSON.stringify(listUserLocalStorage));
        window.location.href = "./"
    }

    //reset biến check

});



