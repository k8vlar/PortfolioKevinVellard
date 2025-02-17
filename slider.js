document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const slides = slider.children;
    let slideIndex = 0;
    let intervalId;
    let isVideoPlaying = false;
  
    function showSlide(index) {
      Array.from(slides).forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        if (slide.classList.contains('video-container')) {
          const iframe = slide.querySelector('iframe');
          if (iframe) {
            if (i !== index) {
              iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          }
        }
      });
      // Arrêter le défilement automatique si la diapositive active est une vidéo
      if (slides[index].classList.contains('video-container')) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
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
      stopAutoSlide();
      if (!slides[slideIndex].classList.contains('video-container')) {
        intervalId = setInterval(nextSlide, 3000);
      }
    }
  
    function stopAutoSlide() {
      clearInterval(intervalId);
    }
  
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
  
    window.addEventListener('message', (event) => {
      if (event.origin !== "https://www.youtube.com") return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange") {
          if (data.info === 1) {
            // Video started playing
            isVideoPlaying = true;
            stopAutoSlide();
          } else if (data.info === 0 || data.info === 2) {
            // Video ended or paused
            isVideoPlaying = false;
            if (!slides[slideIndex].classList.contains('video-container')) {
              startAutoSlide();
            }
          }
        }
      } catch (e) {
        console.error("Erreur lors de l'analyse du message de YouTube :", e);
      }
    });
  
    // Initialisation
    showSlide(slideIndex);
    startAutoSlide();
  });
  