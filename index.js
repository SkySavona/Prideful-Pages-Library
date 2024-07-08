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
  const bestSellersContainer = "#best-sellers"; // Use selector as string
  const books = await fetchBooks();
  const topRatedBooks = books
    .filter((book) => book.star_rating >= 4.5 && book.rating_count >= 1000)
    .slice(0, 16);
  renderBooks(topRatedBooks, bestSellersContainer);
}

function createAmazonAffiliateLink(book) {
  let searchTerm = book.isbn ? book.isbn : `${book.title} ${book.author}`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(
    searchTerm
  )}&tag=eduhub0a-20`;
}

function renderBooks(booksToRender, containerSelector) {
  const booksWrapper = document.querySelector(containerSelector);
  if (!booksWrapper) {
    console.error(`Container ${containerSelector} not found`);
    return;
  }

  booksWrapper.innerHTML = booksToRender
    .map((book) => {
      return `
      <div class="book" data-key="${book.isbn}">
        <figure class="book__img--wrapper">
          <img class="book__img" src="${book.cover_img}" alt="${
        book.title
      }" loading="lazy">
        </figure>
        <div class="book__title">${book.title}</div>
        <div class="book__authors">${book.author}</div>
        <div class="book__rating">${
          book.star_rating
            ? `${renderStarRating(book.star_rating)} (${book.rating_count})`
            : "Not rated"
        }</div>
                  <a href="../components/bookDetail/book-detail.html?isbn=${book.isbn}" class="btn">View Details</a>
      </div>

    `;
    })
    .join("");
}

function renderStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return `${"★".repeat(fullStars)}${halfStar ? "½" : ""}${"☆".repeat(
    emptyStars
  )}`;
}

// document.addEventListener('DOMContentLoaded', function() {
//     const currentLocation = location.href;
//     const cartIcon = document.querySelector('.cart__icon--big');

//     if (cartIcon && currentLocation.includes('cart.html')) {
//         cartIcon.classList.add('active');
//     }
// });


