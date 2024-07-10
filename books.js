const categories = [
  "Top-Rated ⭐️",
  "Fiction 🛸",
  "Non-Fiction 📚",
  "Non-Fiction",
  "Fantasy 🧙‍♂️",
  "Mystery 🕵️",
  "Romance 💖",
  // , "Thriller 😱", "Biography 👤", "History 🏛️",
  // "Science 🔬", "Philosophy 🤔", "Poetry 🎭",
];

document.addEventListener("DOMContentLoaded", initializePage);

console.log("Script loaded");

async function fetchBooks() {
  console.log("Fetching books...");
  try {
    const response = await fetch("/all_books.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("Books fetched successfully:", data.books.length);
    return data.books;
  } catch (error) {
    console.error("Error fetching books data:", error);
    return [];
  }
}

async function initializePage() {
  console.log("Initializing page");
  const pageType = document.body.className;
  console.log("Page type:", pageType);

  switch (pageType) {
    case "books-page":
      await initializeBooksPage();
      break;
    case "book-detail-page":
      await initializeBookDetailPage();
      break;
    case "home-page":
      await initializeHomePage();
      break;
    case "about-page":
      initializeAboutPage();
      break;
    case "contact-page":
      initializeContactPage();
      break;
    default:
      console.log("Unknown page type");
  }

  setupScrollAnimations();
  addBookImageClickListeners();
}

function setupFilterDropdown() {
  const filterSelect = document.getElementById("filter-select");
  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      const selectedCategory = this.value;
      if (selectedCategory) {
        const categorySection = document.getElementById(
          `section-${getCategoryId(selectedCategory)}`
        );
        if (categorySection) {
          categorySection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  } else {
    console.error("Filter select element not found");
  }
}

function setupCarousels() {
  console.log("Setting up carousels");
  categories.forEach((category) => {
    const categoryId = getCategoryId(category);
    const container = document.querySelector(`#${categoryId}`);
    const prevBtn = document.querySelector(`#prev-${categoryId}`);
    const nextBtn = document.querySelector(`#next-${categoryId}`);

    if (container && prevBtn && nextBtn) {
      console.log(`Setting up carousel for category: ${category}`);

      const gap = 24;

      function getScrollAmount() {
        const books = container.querySelectorAll(".book");
        if (books.length > 0) {
          const book = books[0];
          return book.offsetWidth + gap;
        }
        return 0;
      }

      function scrollCarousel(direction) {
        const scrollAmount = getScrollAmount();
        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        let newScrollPosition;

        if (direction === "next") {
          newScrollPosition = Math.min(currentScroll + scrollAmount, maxScroll);
          if (
            newScrollPosition === maxScroll ||
            newScrollPosition === currentScroll
          ) {
            newScrollPosition = 0;
          }
        } else {
          newScrollPosition = Math.max(currentScroll - scrollAmount, 0);
          if (newScrollPosition === 0 && currentScroll === 0) {
            newScrollPosition = maxScroll;
          }
        }

        container.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
      }

      nextBtn.addEventListener("click", () => {
        console.log(`Next button clicked for ${category}`);
        scrollCarousel("next");
      });

      prevBtn.addEventListener("click", () => {
        console.log(`Prev button clicked for ${category}`);
        scrollCarousel("prev");
      });

      container.addEventListener("scroll", (event) => {
        event.preventDefault();
        const books = container.querySelectorAll(".book");
        books.forEach((book) => {
          book.classList.remove("animate-on-scroll");
          book.classList.remove("animate");
        });
      });

      window.addEventListener("resize", () => {
        console.log(`Recalculating scroll amount for ${category}`);
      });
    } else {
      console.error(`Carousel elements not found for category: ${category}`);
      if (!container) console.error(`Container not found for ${categoryId}`);
      if (!prevBtn) console.error(`Prev button not found for ${categoryId}`);
      if (!nextBtn) console.error(`Next button not found for ${categoryId}`);
    }
  });
}

async function initializeBooksPage() {
  console.log("Initializing books page");
  const categoriesContainer = document.getElementById("categories");
  if (!categoriesContainer) {
    console.error("Categories container not found");
    return;
  }

  const books = await fetchBooks();
  if (books.length === 0) {
    console.error("No books fetched");
    return;
  }

  const categorizedBooks = categorizeBooks(books);
  console.log("Categorized books:", categorizedBooks);

  categories.forEach((category) => {
    const categoryId = getCategoryId(category);
    const booksInCategory = categorizedBooks[category];

    if (booksInCategory && booksInCategory.length > 0) {
      console.log(`Rendering category: ${category}`);
      const categorySection = createCategorySection(category, categoryId);
      categoriesContainer.appendChild(categorySection);
      renderBooks(booksInCategory, `#${categoryId}`);
    } else {
      console.log(`No books in category: ${category}`);
    }
  });
  setupFilterDropdown();
  setupCarousels();
}

function categorizeBooks(books) {
  console.log("Categorizing books");
  const categorizedBooks = {};
  categories.forEach((category) => {
    categorizedBooks[category] = [];
  });

  books.forEach((book) => {
    if (book.star_rating >= 4.5 && book.rating_count >= 1000) {
      categorizedBooks["Top-Rated ⭐️"].push(book);
    }

    let matchedCategory = findMatchingCategory(book.category);
    categorizedBooks[matchedCategory].push(book);
  });

  return categorizedBooks;
}

function findMatchingCategory(bookCategory) {
  const normalizedBookCategory = bookCategory
    .toLowerCase()
    .replace(/[^\w\s]/gi, "");

  return (
    categories.find((category) => {
      const normalizedCategory = category
        .toLowerCase()
        .replace(/[^\w\s]/gi, "");
      return (
        normalizedCategory.includes(normalizedBookCategory) ||
        normalizedBookCategory.includes(normalizedCategory)
      );
    }) ||
    (normalizedBookCategory.includes("non-fiction")
      ? "Non-Fiction 📚"
      : "Fiction 🛸")
  );
}

function renderBooks(booksToRender, container) {
  console.log(`Rendering books for container: ${container}`);
  const booksWrapper = document.querySelector(container);
  if (!booksWrapper) {
    console.error(`Container ${container} not found`);
    return;
  }

  booksWrapper.innerHTML = booksToRender
    .map((book, index) => createBookHTML(book, index))
    .join("");

  console.log(`Rendered ${booksToRender.length} books`);
}

function createBookHTML(book, index) {
  return `
    <div class="book animate-on-scroll" data-key="${
      book.isbn
    }" style="animation-delay: ${index * 0.1}s;">
      <figure class="book__img--wrapper">
        <img class="book__img" src="${
          book.cover_img || "/assets/no_img_book_cover.svg"
        }" alt="${
    book.title
  }" loading="lazy" onerror="this.onerror=null; this.src='/assets/no_img_book_cover.svg';">
      </figure>
      <div class="book__title">${book.title}</div>
      <div class="book__authors">${book.author}</div>
      <div class="book__rating">${
        book.star_rating
          ? `${book.star_rating.toFixed(1)} ${renderStarRating(
              book.star_rating
            )} <br> (${book.rating_count.toLocaleString()})`
          : "Not rated"
      }</div>
      <a href="/components/bookDetail/book-detail.html?isbn=${
        book.isbn
      }" target="_blank" class="btn">View Details</a>
    </div>
  `;
}

async function initializeBookDetailPage() {
  console.log("Initializing book detail page");
  const urlParams = new URLSearchParams(window.location.search);
  const isbn = urlParams.get("isbn");

  if (!isbn) {
    console.error("No ISBN provided in the URL");
    displayError("No book selected. Please go back and select a book.");
    return;
  }

  const books = await fetchBooks();
  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    console.error("Book not found");
    displayError(
      "Book not found. Please try again or select a different book."
    );
    return;
  }

  const detailContainer = document.getElementById("book-detail-container");
  if (!detailContainer) {
    console.error("Book detail container not found");
    return;
  }

  detailContainer.innerHTML = createBookDetailHTML(book);
  console.log("Book detail page rendered");
}

function createBookDetailHTML(book) {
  return `
    <div class="book-cover">
      <img src="${
        book.cover_img || "/assets/no_img_book_cover.svg"
      }" alt="${book.title}" class="book-img">
    </div>
    <div class="book-info">
      <h1 class="book-title">${book.title}</h1>
      <p class="book-author">by ${book.author}</p>
      <div class="book-rating">
        ${renderStarRating(book.star_rating)} ${book.star_rating.toFixed(1)} 
        (${book.rating_count.toLocaleString()} ratings)
      </div>
      <p class="book-publish-date"><strong>Published:</strong> ${
        book.publish_date
      }</p>
      <p class="book-isbn"><strong>ISBN:</strong> ${book.isbn}</p>
      <p class="book-category"><strong>Category:</strong> ${book.category}</p>
      <div class="book-bio">
        <h2>Book Description</h2>
        <p>${book.bio}</p>
      </div>
      <div class="book-reviews">
        <h2>Reviews</h2>
        <ul>
          ${book.reviews.map((review) => `<li>${review}</li>`).join("")}
        </ul>
      </div>
      <div class="book-other-info">
        <h2>Additional Information</h2>
        <p>${book.other_info}</p>
      </div>
      <a href="${createAmazonAffiliateLink(
        book
      )}" class="btn" target="_blank">View on Amazon</a>
    </div>
  `;
}

function displayError(message) {
  const detailContainer = document.getElementById("book-detail-container");
  if (detailContainer) {
    detailContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
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
  const searchTerm = book.isbn || `${book.title} ${book.author}`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(
    searchTerm
  )}&tag=eduhub0a-20`;
}

async function initializeHomePage() {
  console.log("Initializing home page");
  const bestSellersContainer = document.querySelector("#best-sellers");
  if (!bestSellersContainer) {
    console.error("Best sellers container not found");
    return;
    
  }
  
  const books = await fetchBooks();
  const topRatedBooks = books
    .filter((book) => book.star_rating >= 4.5 && book.rating_count >= 1000)
    .slice(0, 16);
  renderBooks(topRatedBooks, "#best-sellers");
  console.log("Home page initialized");
}

function initializeAboutPage() {
  console.log("Initializing about page");
  const aboutContent = document.querySelector(".about-us");
  if (aboutContent) {
    aboutContent.classList.add("animate");
  } else {
    console.error("About content not found");
  }
}

function initializeContactPage() {
  console.log("Initializing contact page");
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.classList.add("animate");
  } else {
    console.error("Contact form not found");
  }
}

function setupScrollAnimations() {
  console.log("Setting up scroll animations");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    }
  );

  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      element.classList.add("animate");
    } else {
      observer.observe(element);
    }
  });
}

document.addEventListener('DOMContentLoaded', setupScrollAnimations);

function addBookImageClickListeners() {
  console.log("Adding book image click listeners");
  const bookContainers = document.querySelectorAll(
    "#top-rated, .carousel-container, .carousel, #best-sellers"
  );
  bookContainers.forEach((container) => {
    container.addEventListener("click", handleBookImageClick);
  });
}

function handleBookImageClick(event) {
  const bookImg = event.target.closest(".book__img");
  if (bookImg) {
    const bookElement = bookImg.closest(".book");
    if (bookElement) {
      const isbn = bookElement.getAttribute("data-key");
      if (isbn) {
        event.preventDefault();
        console.log(`Navigating to book detail page for ISBN: ${isbn}`);
        window.location.href = `/components/bookDetail/book-detail.html?isbn=${isbn}`;
      }
    }
  }
}

function getCategoryId(category) {
  return category
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

function createCategorySection(category, categoryId) {
  const section = document.createElement("div");
  section.className = "carousel-section";
  section.id = `section-${categoryId}`;
  section.innerHTML = `
    <h2>${category}</h2>
    <div class="carousel animate-on-scroll">
      <button class="carousel-button prev" id="prev-${categoryId}">&#10094;</button>
      <div class="carousel-container" id="${categoryId}"></div>
      <button class="carousel-button next" id="next-${categoryId}">&#10095;</button>
    </div>
  `;
  return section;
}

console.log("Script initialization complete");
