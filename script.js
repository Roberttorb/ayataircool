
"use strict";

const BUSINESS_PHONE = "919870988353";

const header = document.getElementById("header");
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const serviceSelect = document.getElementById("serviceSelect");
const contactForm = document.getElementById("contactForm");

// Current copyright year
document.getElementById("year").textContent =
  new Date().getFullYear();

// Sticky header styling
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});
updateHeader();

// Mobile navigation
function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", event => {
  if (
    navigation.classList.contains("open") &&
    !navigation.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

// Highlight active navigation section
function updateActiveSection() {
  let currentSection = "home";
  const offset = header.offsetHeight + 100;

  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= offset) {
      currentSection = section.id;
    }
  });

  // The process section belongs to the service journey.
  if (currentSection === "process") {
    currentSection = "about";
  }

  navLinks.forEach(link => {
    const active =
      link.getAttribute("href") === "#" + currentSection;

    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveSection, {
  passive: true
});
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

// Scroll reveal animations
const revealElements = document.querySelectorAll(".reveal");

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -25px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}

// Automatically select a service when enquiry links are clicked
document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    const selectedService = link.dataset.service;

    if (serviceSelect) {
      serviceSelect.value = selectedService;
    }
  });
});

// Contact form: prepare a WhatsApp message
contactForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const service = serviceSelect.value;
  const area = document.getElementById("customerArea").value.trim();
  const description =
    document.getElementById("customerMessage").value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  const message = [
    "Hello Ayat Air Cool Services,",
    "",
    "I would like to enquire about an AC service.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Area: ${area}`,
    `Requirement: ${description || "Please contact me for details."}`,
    "",
    "Please share availability and applicable charges."
  ].join("\n");

  const whatsappURL =
    `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;

  // Navigate to WhatsApp, where the customer sends the message.
  window.location.assign(whatsappURL);
});
