document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider-mobile');
    const prevBtn = document.querySelector('.prev-mobile');
    const nextBtn = document.querySelector('.next-mobile');
    const slides = slider.children;
    let slideIndex = 0;
    let intervalId;

    function showSlide(index) {
        const slideWidth = slides[0].offsetWidth; // Obtenir la largeur de la première diapositive
        slider.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        showSlide(slideIndex);
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
    });

    // Diapositive initiale
    showSlide(slideIndex);
});
