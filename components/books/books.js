const categories = [
  "Top-Rated ⭐️",
  "Fiction 🛸",
  "Non-Fiction 📚",
  "Non-Fiction",
  "Fantasy 🧙‍♂️",
  "Mystery 🕵️",
  "Romance 💖",
  "Thriller 😱",
  "Biography 👤",
  "History 🏛️",
  "Science 🔬",
  "Philosophy 🤔",
  "Poetry 🎭",
];

document.addEventListener("DOMContentLoaded", async function () {
  if (document.body.classList.contains("books-page")) {
    await initializeBooksPage();
    setupFilterDropdown();
  } else if (document.body.classList.contains("book-detail-page")) {
    initializeBookDetailPage();
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

async function initializeBookDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const isbn = urlParams.get('isbn');
  
  if (!isbn) {
    console.error('No ISBN provided in the URL');
    displayError('No book selected. Please go back and select a book.');
    return;
  }

  const books = await fetchBooks();
  const book = books.find(b => b.isbn === isbn);

  if (!book) {
    console.error('Book not found');
    displayError('Book not found. Please try again or select a different book.');
    return;
  }

  const detailContainer = document.querySelector('.book-details');
  if (!detailContainer) {
    console.error('Book details container not found');
    return;
  }

  detailContainer.innerHTML = `
    <div class="book-cover">
      <img src="${book.cover_img || "../../assets/no_img_book_cover.svg"}" alt="${book.title}" class="book-img">
    </div>
    <div class="book-info">
      <h1 class="book-title">${book.title}</h1>
      <p class="book-author">by ${book.author}</p>
      <div class="book-rating">
        ${renderStarRating(book.star_rating)} ${book.star_rating.toFixed(1)} 
        (${book.rating_count.toLocaleString()} ratings)
      </div>
      <p class="book-publish-date"><strong>Published:</strong> ${book.publish_date}</p>
      <p class="book-isbn"><strong>ISBN:</strong> ${book.isbn}</p>
      <p class="book-category"><strong>Category:</strong> ${book.category}</p>
      <div class="book-bio">
        <h2>Book Description</h2>
        <p>${book.bio}</p>
      </div>
      <div class="book-reviews">
        <h2>Reviews</h2>
        <ul>
          ${book.reviews.map(review => `<li>${review}</li>`).join('')}
        </ul>
      </div>
      <div class="book-other-info">
        <h2>Additional Information</h2>
        <p>${book.other_info}</p>
      </div>
      <a href="${createAmazonAffiliateLink(book)}" class="btn" target="_blank">View on Amazon</a>
    </div>
  `;
}

function displayError(message) {
  const detailContainer = document.querySelector('.book-details');
  if (detailContainer) {
    detailContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}

function renderStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return `${"★".repeat(fullStars)}${halfStar ? "½" : ""}${"☆".repeat(emptyStars)}`;
}

function createAmazonAffiliateLink(book) {
  let searchTerm = book.isbn ? book.isbn : `${book.title} ${book.author}`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&tag=eduhub0a-20`;
}

document.addEventListener("DOMContentLoaded", function() {
  console.log('DOM fully loaded and parsed');
  if (document.body.classList.contains("book-detail-page")) {
    console.log('Initializing book detail page');
    initializeBookDetailPage();
  }
});

function renderStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return `${"★".repeat(fullStars)}${halfStar ? "½" : ""}${"☆".repeat(emptyStars)}`;
}

function createAmazonAffiliateLink(book) {
  let searchTerm = book.isbn ? book.isbn : `${book.title} ${book.author}`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&tag=eduhub0a-20`;
}

document.addEventListener("DOMContentLoaded", function() {
  if (document.body.classList.contains("book-detail-page")) {
    initializeBookDetailPage();
  }
});
function setupFilterDropdown() {
  const filterSelect = document.getElementById("filter-select");
  filterSelect.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory) {
      const categoryId = selectedCategory
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      const categorySection = document.getElementById(`section-${categoryId}`);
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

async function initializeBooksPage() {
  const categoriesContainer = document.getElementById("categories");
  const books = await fetchBooks();
  const categorizedBooks = categorizeBooks(books);

  categories.forEach((category) => {
    const categoryId = category
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const booksInCategory = categorizedBooks[category];

    console.log(`Processing category: ${category}`);
    console.log(`Books in ${category}:`, booksInCategory);
    console.log(
      "Before rendering, Non-Fiction books:",
      categorizedBooks["Non-Fiction 📚"]
    );

    if (booksInCategory && booksInCategory.length > 0) {
      console.log(`Creating section for: ${category}`);
      const categorySection = document.createElement("div");
      categorySection.className = "carousel-section";
      categorySection.id = `section-${categoryId}`;
      categorySection.innerHTML = `
        <h2>${category}</h2>
        <div class="carousel">
          <button class="carousel-button prev" id="prev-${categoryId}">&#10094;</button>
          <div class="carousel-container" id="${categoryId}"></div>
          <button class="carousel-button next" id="next-${categoryId}">&#10095;</button>
        </div>
      `;
      categoriesContainer.appendChild(categorySection);

      console.log(`Rendering books for: ${category}`);
      renderBooks(booksInCategory, `#${categoryId}`);

      console.log(`Initializing carousel for: ${category}`);
      initializeCarousel(categoryId);
    } else {
      console.log(`No books in category: ${category}`);
    }
  });
  initializeCarousels();
}
console.log("Available categories:", categories);
function categorizeBooks(books) {
  const categorizedBooks = {};
  categories.forEach(category => {
    categorizedBooks[category] = [];
  });

  books.forEach(book => {
    console.log(`Categorizing book: "${book.title}" (Original Category: ${book.category})`);
    
    if (book.star_rating >= 4.5 && book.rating_count >= 1000) {
      categorizedBooks["Top-Rated ⭐️"].push(book);
      console.log(`Added "${book.title}" to Top-Rated`);
    }

    // Improved category matching logic
    let matchedCategory = categories.find(category => {
      const normalizedCategory = category.toLowerCase().replace(/[^\w\s]/gi, '');
      const normalizedBookCategory = book.category.toLowerCase().replace(/[^\w\s]/gi, '');
      return normalizedCategory.includes(normalizedBookCategory) || 
             normalizedBookCategory.includes(normalizedCategory);
    });

    // If no match found, check for Non-Fiction explicitly
    if (!matchedCategory) {
      if (book.category.toLowerCase().includes('non-fiction') || 
          book.category.toLowerCase().includes('nonfiction')) {
        matchedCategory = "Non-Fiction 📚";
      } else {
        matchedCategory = "Fiction 🛸";
      }
    }

    categorizedBooks[matchedCategory].push(book);
    console.log(`Added "${book.title}" to ${matchedCategory}`);
  });

  console.log('Final categorized books:', categorizedBooks);
  return categorizedBooks;
}
function renderBooks(booksToRender, container) {
  const booksWrapper = document.querySelector(container);
  if (!booksWrapper) {
    console.error(`Container ${container} not found`);
    return;
  }

  booksWrapper.innerHTML = booksToRender
    .map((book) => {
      return `
      <div class="book" data-key="${book.isbn}">
        <figure class="book__img--wrapper">
            <img class="book__img" src="${
              book.cover_img || "../../assets/no_img_book_cover.svg"
            }" alt="${
        book.title
      }" loading="lazy" onerror="this.onerror=null; this.src='../../assets/no_img_book_cover.svg';">
        </figure>
        <div class="book__title">${book.title}</div>
        <div class="book__authors">${book.author}</div>
        <div class="book__rating">${
          book.star_rating
            ? `${book.star_rating.toFixed(1)} ${renderStarRating(book.star_rating)} <br> (${book.rating_count.toLocaleString()})`
            : "Not rated"
        }</div>
        <a href="../bookDetail/book-detail.html?isbn=${book.isbn}" class="btn">View Details</a>
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

function createAmazonAffiliateLink(book) {
  let searchTerm = book.isbn ? book.isbn : `${book.title} ${book.author}`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(
    searchTerm
  )}&tag=eduhub0a-20`;
}

function initializeCarousels() {
  categories.forEach((category) => {
    const categoryId = category
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    initializeCarousel(categoryId);
  });
}

function initializeCarousel(categoryId) {
  const container = document.getElementById(categoryId);
  const prevButton = document.getElementById(`prev-${categoryId}`);
  const nextButton = document.getElementById(`next-${categoryId}`);

  if (!container || !prevButton || !nextButton) return;

  const books = Array.from(container.children);
  const gap = 32;
  const bookWidth = books[0].offsetWidth + gap;
  const displayCount = 4;
  let currentIndex = 0;

  // Set initial positions
  books.forEach((book, index) => {
    book.style.left = `${index * bookWidth}px`;
  });

  function moveCarousel(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = books.length - displayCount;
    if (currentIndex > books.length - displayCount) currentIndex = 0;

    books.forEach((book, index) => {
      book.style.transform = `translateX(-${currentIndex * bookWidth}px)`;
    });
  }

  nextButton.addEventListener("click", () => moveCarousel(1));
  prevButton.addEventListener("click", () => moveCarousel(-1));
}
async function initializeBookDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const isbn = urlParams.get('isbn');
  
  if (!isbn) {
    console.error('No ISBN provided in the URL');
    displayError('No book selected. Please go back and select a book.');
    return;
  }

  const books = await fetchBooks();
  const book = books.find(b => b.isbn === isbn);

  if (!book) {
    console.error('Book not found');
    displayError('Book not found. Please try again or select a different book.');
    return;
  }

  const detailContainer = document.getElementById('book-detail-container');
  if (!detailContainer) {
    console.error('Book detail container not found');
    return;
  }

  detailContainer.innerHTML = `
    <div class="book-cover">
      <img src="${book.cover_img || "../../assets/no_img_book_cover.svg"}" alt="${book.title}" class="book-img">
    </div>
    <div class="book-info">
      <h1 class="book-title">${book.title}</h1>
      <p class="book-author">by ${book.author}</p>
      <div class="book-rating">
        ${renderStarRating(book.star_rating)} ${book.star_rating.toFixed(1)} 
        (${book.rating_count.toLocaleString()} ratings)
      </div>
      <p class="book-publish-date"><strong>Published:</strong> ${book.publish_date}</p>
      <p class="book-isbn"><strong>ISBN:</strong> ${book.isbn}</p>
      <p class="book-category"><strong>Category:</strong> ${book.category}</p>
      <div class="book-bio">
        <h2>Book Description</h2>
        <p>${book.bio}</p>
      </div>
      <div class="book-reviews">
        <h2>Reviews</h2>
        <ul>
          ${book.reviews.map(review => `<li>${review}</li>`).join('')}
        </ul>
      </div>
      <div class="book-other-info">
        <h2>Additional Information</h2>
        <p>${book.other_info}</p>
      </div>
      <a href="${createAmazonAffiliateLink(book)}" class="btn" target="_blank">View on Amazon</a>
    </div>
  `;
}

function displayError(message) {
  const detailContainer = document.getElementById('book-detail-container');
  if (detailContainer) {
    detailContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}
