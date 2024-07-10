function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

document.addEventListener("DOMContentLoaded", function () {
  // Activate current navigation link
  const currentLocation = location.href;
  const navLinks = document.querySelectorAll(".nav__link");
  navLinks.forEach(link => {
    if (link.href === currentLocation) {
      link.classList.add("active");
    }
  });

  // Set up contact form submission
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

  // Set up book details link handler
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

document.addEventListener('DOMContentLoaded', (event) => {
  if (!localStorage.getItem('cookiesAccepted')) {
      document.getElementById('cookieBanner').style.display = 'block';
  }

  document.getElementById('acceptCookies').addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      document.getElementById('cookieBanner').style.display = 'none';
  });

  document.getElementById('declineCookies').addEventListener('click', () => {
      document.getElementById('cookieBanner').style.display = 'none';
  });
});
