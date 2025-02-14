document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const slides = slider.children;
    let slideIndex = 0;
    let intervalId;
  
    function showSlide(index) {
      Array.from(slides).forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }
  
    function nextSlide() {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    }
  
    function prevSlide() {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlide(slideIndex);
    }
  
    function startAutoSlide() {
      intervalId = setInterval(nextSlide, 2000);
    }
  
    function stopAutoSlide() {
      clearInterval(intervalId);
    }
  
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    });
  
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    });
  
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
  
    // Initialisation
    showSlide(slideIndex);
    startAutoSlide();
  });
  