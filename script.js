document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateNavbarBasedOnLoginStatus();
    updateCategories();
});
const imageBaseUrl ='https://merbmd-001-site1.itempurl.com/';
var products;

var Categories;

function updateCategories() {
    fetch('https://merbmd-001-site1.itempurl.com/api/Categories')
    .then(async response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        this.Categories = await response.json();
        return this.Categories;
    })
    .then(Categories => {
        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = ''; // Clear existing list

        Categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.className = 'nav-item';
            const link = document.createElement('a');
            link.className = 'nav-link';
            link.href = '#';
            link.textContent = `${category.name} (${category.count})`; // Display name and count
            link.onclick = function() { filterProductsByCategory(category.categoryID); }; // Use 'categoryID' for filtering

            listItem.appendChild(link);
            categoryList.appendChild(listItem);});
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function setupEventListeners() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) loginButton.addEventListener('click', () => loadLoginContent());

    const signupButton = document.getElementById('signupButton');
    if (signupButton) signupButton.addEventListener('click', () => loadSignupContent());

    const productsLink = document.getElementById('productsLink');
    if (productsLink) productsLink.addEventListener('click', (event) => {
        // Prevent the default link behavior to prevent the page from reloading when the link is clicked
        event.preventDefault();
        //loadProductContent();
    });
}

function loadProductContent() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ` `;

    fetch('https://merbmd-001-site1.itempurl.com/api/Products'/*, { mode: 'no-cors' }*/)
        .then(async response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            this.products = await response.json();
            return this.products;
        })
        .then(products => {
            if (products.length === 0) {
                productsContainer.innerHTML += '<p>No products available.</p>';
            } else {
                const productHtml = products.map(product => `
                    <div class="col-md-4 mb-3">
                        <img src="${imageBaseUrl}${product.imageURL}" class="card-img-top img-fluid" alt="${product.name}">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
                productsContainer.innerHTML += productHtml;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            productsContainer.innerHTML += '<p>Error loading products.</p>';
        });
}



function loadLoginContent() {
   
    document.getElementById('productsContainer').innerHTML = `
    <div id="content" class="container">
    <h2>Login</h2>
    <form id="loginForm">
        <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" class="form-control" id="email" required>
        </div>
        <div class="form-group">
            <label for="pwd">Password:</label>
            <input type="password" class="form-control" id="pwd" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
    </div>`;
    setupLoginForm();
       
}
function loadSignupContent() {
   
    document.getElementById('productsContainer').innerHTML = `
    <div class="container">
    <h2>Sign Up</h2>
    <form id="signupForm">
        <div class="form-group">
            <label for="newEmail">Email address:</label>
            <input type="email" class="form-control" id="newEmail" required>
        </div>
        <div class="form-group">
            <label for="newPwd">Password:</label>
            <input type="password" class="form-control" id="newPwd" required>
        </div>
        <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
    </div>`;
}
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Prevent the default form submission behavior to prevent the page from reloading when the form is submitted
            event.preventDefault();
            performLogin();
        });
    }
}

function performLogin() {
    var username = document.getElementById('email').value;
    var password = document.getElementById('pwd').value;
    if (username === "user@gmail.com" && password === "password123") {
        setCookie("currentUser", username, 7);
        updateNavbar(username);
        const productsContainer = document.getElementById('productsContainer');
         productsContainer.innerHTML =  `  `;
         loadProductContent();
        // window.location.href = './index.html';
    } else {
        alert("Incorrect username or password!");
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function updateNavbar(username) {
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('signupButton').style.display = 'none';
    var usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.textContent = username;
    usernameDisplay.style.display = 'block';
    document.getElementById('logoutButton').style.display = 'block';
}

function updateNavbarBasedOnLoginStatus() {
    var currentUser = getCookie("currentUser");
    if (currentUser) {
        updateNavbar(currentUser);
    } else {
        // Reset Navbar for non-logged in users
        document.getElementById('loginButton').style.display = 'block';
        document.getElementById('signupButton').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('usernameDisplay').style.display = 'none';
 
    }
}

function logout() {
    deleteCookie("currentUser");
    updateNavbarBasedOnLoginStatus();
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}



function showDashboard() {
    // ... existing showDashboard functionality ...
}
function filterProductsByCategory(category) {
    const filteredProducts = products.filter(product => product.categoryID === category);
    displayProducts(filteredProducts);
}

function displayProducts(productsList) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML =  `  `+ productsList.map(product => `
        <div class="col-md-4 mb-3">
            <div class="card">
            <img src="${imageBaseUrl}${product.imageURL}" class="card-img-top img-fluid" alt="${product.name}">

                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const name = document.getElementById('productName').value.toLowerCase();
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    const filteredProducts = products.filter(product => {
        const meetsNameCriteria = name ? product.name.toLowerCase().includes(name) : true;
        const meetsMinPriceCriteria = minPrice ? product.price >= minPrice : true;
        const meetsMaxPriceCriteria = maxPrice ? product.price <= maxPrice : true;
        return meetsNameCriteria && meetsMinPriceCriteria && meetsMaxPriceCriteria;
    });

    displayProducts(filteredProducts); // Assuming you have a function to display products
}



