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
