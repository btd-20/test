// Product Data
const product = {
  name: "Niake Revolution 7 EasyOn",
  category: "Men's Shoes",
  price: 1789000,
  originalPrice: 2929000,
  colors: [
    {
      name: "Red",
      images: {
        main: "../img/product1/1.png",
        thumbs: [
          "../img/product1/1.png",
          "../img/product1/2.png",
          "../img/product1/3.png",
        ],
        variants: [
          "../img/product1/colorvariant/1.png",
          "../img/product1/colorvariant/2.png",
          "../img/product1/colorvariant/3.png",
          "../img/product1/colorvariant/4.png",
          "../img/product1/colorvariant/5.png",
        ],
      },
    },
    // Add more color variants as needed
  ],
  sizes: [40, 40.5, 41, 42, 42.5, 43, 44, 45, 46, 47.5],
  rating: 4.3,
  reviews: 46,
  recommendationRate: 86,
  recommended: [
    {
      name: "Niake Dunk Low SE",
      category: "Baby/Toddler Shoes",
      price: 1431199,
      originalPrice: 1799000,
      image: "../img/product3/1.png",
    },
    // Add more recommended products
  ],
};

// Initialize Product Page
document.addEventListener("DOMContentLoaded", () => {
  initializeProduct();
  initializeRecommendations();
});

function initializeProduct() {
  // Set Basic Info
  document.querySelector(".upper h4").textContent = product.name;
  document.querySelector(".upper p").textContent = product.category;

  // Set Prices
  const priceElement = document.querySelector(".price");
  priceElement.innerHTML = `
        <span class="discount-price">${product.price.toLocaleString()}₫</span>
        <span class="original-price">${product.originalPrice.toLocaleString()}₫</span>
        <span class="discount-percent">${Math.round(
          (1 - product.price / product.originalPrice) * 100
        )}% off</span>
    `;

  // Initialize Image Gallery
  const imageContainer = document.querySelector(".image-container");
  const imageSwitcher = document.querySelector(".image-switcher");

  // Clear existing content
  imageContainer.innerHTML = "";
  imageSwitcher.innerHTML = "";

  // Create Images
  product.colors[0].images.thumbs.forEach((img, index) => {
    // Main Images
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.alt = `Image ${index + 1}`;
    imgElement.id = `img${index + 1}`;
    imgElement.className = "image";
    imgElement.style.display = index === 0 ? "block" : "none";
    imageContainer.appendChild(imgElement);

    // Thumbnails
    const thumbLink = document.createElement("a");
    thumbLink.href = `#img${index + 1}`;
    const thumbImg = document.createElement("img");
    thumbImg.src = img;
    thumbImg.alt = `Thumb ${index + 1}`;
    thumbLink.appendChild(thumbImg);
    imageSwitcher.appendChild(thumbLink);
  });

  // Color Variants
  const colorOptions = document.querySelector(".color-options");
  colorOptions.innerHTML = product.colors[0].images.variants
    .map(
      (variant, index) => `<img src="${variant}" data-color-index="${index}">`
    )
    .join("");

  // Size Picker
  const sizesContainer = document.querySelector(".sizes");
  sizesContainer.innerHTML = product.sizes
    .map((size) => `<div class="size">EU ${size}</div>`)
    .join("");

  // Ratings
  document.querySelector(".rating-summary h2").textContent = product.rating;
  document.querySelector(
    ".recommendation h3"
  ).textContent = `${product.recommendationRate}%`;
}

function initializeRecommendations() {
  const carousel = document.querySelector(".recommendation-carousel");
  carousel.innerHTML = product.recommended
    .map(
      (item) => `
        <div class="recommendation-item">
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>${item.category}</p>
            <p class="price">
                ${
                  item.originalPrice
                    ? `
                    <span class="new-price">${item.price.toLocaleString()}₫</span>
                    <span class="old-price">${item.originalPrice.toLocaleString()}₫</span>
                `
                    : `<span class="new-price">${item.price.toLocaleString()}₫</span>`
                }
            </p>
        </div>
    `
    )
    .join("");
}
