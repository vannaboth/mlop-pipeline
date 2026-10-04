// Get elements

const menuButton = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

const themeButton = document.getElementById("themeBtn");

const helloButton = document.getElementById("helloBtn");

const year = document.getElementById("year");


// Mobile menu

menuButton.addEventListener("click", function () {

  navLinks.classList.toggle("show");

});


// Close mobile menu after clicking a link

document.querySelectorAll(".nav-links a").forEach(function (link) {

  link.addEventListener("click", function () {

    navLinks.classList.remove("show");

  });

});


// Dark mode

themeButton.addEventListener("click", function () {

  document.body.classList.toggle("dark");


  if (document.body.classList.contains("dark")) {

    themeButton.textContent = "Light Theme";

  } else {

    themeButton.textContent = "Dark Theme";

  }

});


// JavaScript test button

helloButton.addEventListener("click", function () {

  alert("Hello! JavaScript is working 🚀");

});


// Automatically show current year

year.textContent = new Date().getFullYear();
