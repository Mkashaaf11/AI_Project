let currentIndex = 0;
const slider = document.querySelector(".slider");
const cards = document.querySelectorAll(".card");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

function showSlide(index) {
  slider.style.transform = `translateY(-${index * 33.333}%)`;
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    showSlide(currentIndex);
    checkButtons();
  }
}

function nextSlide() {
  if (currentIndex < Math.ceil(cards.length / 3) - 1) {
    currentIndex++;
    showSlide(currentIndex);
    checkButtons();
  }
}

// Disable next button if no more slides
function checkButtons() {
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex >= Math.ceil(cards.length / 3) - 1;
}

checkButtons();
