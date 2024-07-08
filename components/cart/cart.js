// let cart = JSON.parse(localStorage.getItem('cart')) || [];

// function addToCart(element) {
//     const bookElement = element.closest('.book');
//     const title = bookElement.dataset.title;
//     const price = parseFloat(bookElement.dataset.price);

//     cart.push({ title, price });
//     updateCart();
//     showPopup(`${title} added to cart!`);
// }

// function removeFromCart(index) {
//     cart.splice(index, 1);
//     updateCart();
// }

// function updateCart() {
//     updateCartCount();
//     updateCartDisplay();
//     localStorage.setItem('cart', JSON.stringify(cart));
// }

// function updateCartCount() {
//     const cartCount = document.getElementById('cart-count');
//     if (cartCount) {
//         cartCount.textContent = cart.length;
//     }
// }

// function updateCartDisplay() {
//     const cartItems = document.querySelector('.cart__items');
//     const cartTotal = document.getElementById('cart-total');
//     if (!cartItems || !cartTotal) return; // Not on cart page

//     let total = 0;
//     cartItems.innerHTML = '';
    
//     cart.forEach((item, index) => {
//         total += item.price;
//         cartItems.innerHTML += `
//             <div class="cart__item">
//                 <div class="cart__item-info">
//                     <div class="cart__item-title">${item.title}</div>
//                     <div class="cart__item-price">$${item.price.toFixed(2)}</div>
//                 </div>
//                 <div class="cart__item-remove" onclick="removeFromCart(${index})">
//                     <i class="fas fa-trash"></i>
//                 </div>
//             </div>
//         `;
//     });

//     cartTotal.textContent = `$${total.toFixed(2)}`;
// }

// function showPopup(message) {
//     const popup = document.createElement('div');
//     popup.className = 'popup';
//     popup.textContent = message;
//     document.body.appendChild(popup);

//     setTimeout(() => {
//         popup.classList.add('show');
//         setTimeout(() => {
//             popup.classList.remove('show');
//             setTimeout(() => {
//                 document.body.removeChild(popup);
//             }, 500);
//         }, 2000);
//     }, 10);
// }

// function checkout() {
//     alert('Thank you for your purchase!');
//     cart = [];
//     updateCart();
// }

// // Initialize cart on page load
// document.addEventListener('DOMContentLoaded', () => {
//     updateCartCount();
//     updateCartDisplay();
    
//     // Highlight active nav link
//     const currentPage = window.location.pathname.split("/").pop();
//     const navLinks = document.querySelectorAll('.nav__link');
//     navLinks.forEach(link => {
//         if (link.getAttribute('href') === currentPage) {
//             link.classList.add('active');
//         }
//     });
// });

// function initializeCart() {
//     const cartIcons = document.querySelectorAll('.cart__icon');
//     cartIcons.forEach(icon => {
//         icon.addEventListener('click', function() {
//             addToCart(this);
//         });
//     });

//     updateCartCount();
// }

// // Call initializeCart when the DOM is loaded
// document.addEventListener('DOMContentLoaded', initializeCart);