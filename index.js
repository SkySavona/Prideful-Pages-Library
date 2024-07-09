function openMenu() {
  document.body.classList += " menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

document.addEventListener("DOMContentLoaded", function () {
  const currentLocation = location.href;
  const navLinks = document.querySelectorAll(".nav__link");
  const navLinksLength = navLinks.length;

  for (let i = 0; i < navLinksLength; i++) {
    if (navLinks[i].href === currentLocation) {
      navLinks[i].classList.add("active");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const popup = document.getElementById("popup");
      if (popup) {
        popup.style.display = "block";

        setTimeout(function () {
          popup.style.display = "none";
          contactForm.reset();
        }, 3000);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const currentLocation = location.href;
  const navLinks = document.querySelectorAll(".nav__link");
  const navLinksLength = navLinks.length;

  for (let i = 0; i < navLinksLength; i++) {
    if (navLinks[i].href === currentLocation) {
      navLinks[i].classList.add("active");
    }
  }

  if (document.body.classList.contains("home-page")) {
    await initializeHomePage();
  }

  const booksWrapper = document.querySelector("#best-sellers");
  if (booksWrapper) {
    booksWrapper.addEventListener("click", function (event) {
      const bookLink = event.target.closest("a.btn");
      if (bookLink) {
        event.preventDefault();
        const href = bookLink.getAttribute("href");
        console.log("Navigating to:", href);
        window.location.href = href;
      }
    });
    console.log("Book details link handler initialized");
  }
});

async function fetchBooks() {
  try {
    const response = await fetch("../../all_books.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error("Error fetching books data:", error);
    return [];
  }
}

async function initializeHomePage() {
  const bestSellersContainer = "#best-sellers";
  const books = await fetchBooks();
  const topRatedBooks = books
    .filter((book) => book.star_rating >= 4.5 && book.rating_count >= 1000)
    .slice(0, 16);
  renderBooks(topRatedBooks, bestSellersContainer);
}

// function createAmazonAffiliateLink(book) {
//   let searchTerm = book.isbn ? book.isbn : `${book.title} ${book.author}`;
//   return `https://www.amazon.com/s?k=${encodeURIComponent(
//     searchTerm
//   )}&tag=eduhub0a-20`;
// }

// function renderBooks(booksToRender, containerSelector) {
//   const booksWrapper = document.querySelector(containerSelector);
//   if (!booksWrapper) {
//     console.error(`Container ${containerSelector} not found`);
//     return;
//   }

//   booksWrapper.innerHTML = booksToRender
//     .map((book) => {
//       return `
//       <div class="book" data-key="${book.isbn}">
//         <figure class="book__img--wrapper">
//           <img class="book__img" src="${book.cover_img}" alt="${
//         book.title
//       }" loading="lazy">
//         </figure>
//         <div class="book__title">${book.title}</div>
//         <div class="book__authors">${book.author}</div>
//         <div class="book__rating">${
//           book.star_rating
//             ? `${renderStarRating(book.star_rating)} (${book.rating_count})`
//             : "Not rated"
//         }</div>
//         <a href="./components/bookDetail/book-detail.html?isbn=${
//           book.isbn
//         }" class="btn"> Details</a>
//       </div>
//     `;
//     })
//     .join("");
// }

// async function initializeBookDetailPage() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const isbn = urlParams.get("isbn");

//   if (!isbn) {
//     console.error("No ISBN provided in the URL");
//     displayError("No book selected. Please go back and select a book.");
//     return;
//   }

//   const books = await fetchBooks();
//   const book = books.find((b) => b.isbn === isbn);

//   if (!book) {
//     console.error("Book not found");
//     displayError(
//       "Book not found. Please try again or select a different book."
//     );
//     return;
//   }

//   const detailContainer = document.querySelector(".book-details");
//   if (!detailContainer) {
//     console.error("Book details container not found");
//     return;
//   }

//   detailContainer.innerHTML = `
//     <div class="book-cover">
//       <img src="${
//         book.cover_img || "../../assets/no_img_book_cover.svg"
//       }" alt="${book.title}" class="book-img">
//     </div>
//     <div class="book-info">
//       <h1 class="book-title">${book.title}</h1>
//       <p class="book-author">by ${book.author}</p>
//       <div class="book-rating">
//         ${renderStarRating(book.star_rating)} ${book.star_rating.toFixed(1)} 
//         (${book.rating_count.toLocaleString()} ratings)
//       </div>
//       <p class="book-publish-date"><strong>Published:</strong> ${
//         book.publish_date
//       }</p>
//       <p class="book-isbn"><strong>ISBN:</strong> ${book.isbn}</p>
//       <p class="book-category"><strong>Category:</strong> ${book.category}</p>
//       <div class="book-bio">
//         <h2>Book Description</h2>
//         <p>${book.bio}</p>
//       </div>
//       <div class="book-reviews">
//         <h2>Reviews</h2>
//         <ul>
//           ${book.reviews.map((review) => `<li>${review}</li>`).join("")}
//         </ul>
//       </div>
//       <div class="book-other-info">
//         <h2>Additional Information</h2>
//         <p>${book.other_info}</p>
//       </div>
//       <a href="${createAmazonAffiliateLink(
//         book
//       )}" class="btn" target="_blank">View on Amazon</a>
//     </div>
//   `;
// }

// function displayError(message) {
//   const detailContainer = document.querySelector(".book-details");
//   if (detailContainer) {
//     detailContainer.innerHTML = `<p class="error-message">${message}</p>`;
//   }
// }

// function renderStarRating(rating) {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5 ? 1 : 0;
//   const emptyStars = 5 - fullStars - halfStar;
//   return `${"★".repeat(fullStars)}${halfStar ? "½" : ""}${"☆".repeat(
//     emptyStars
//   )}`;
// }

// Uncomment if needed
// document.addEventListener('DOMContentLoaded', function() {
//     const currentLocation = location.href;
//     const cartIcon = document.querySelector('.cart__icon--big');

//     if (cartIcon && currentLocation.includes('cart.html')) {
//         cartIcon.classList.add('active');
//     }
// });
