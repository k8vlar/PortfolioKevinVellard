
////////////////////////////////////////////////////CONTAINER SECTION///////////////////////////////////////////////
// Animation de texte déroulant
/**
 * Scrambles the text of an HTML element to create an animation effect.
 * @param {HTMLElement} element - The HTML element whose text will be scrambled.
 * @param {string} finalText - The final text that will be displayed after the animation.
 * @param {number} [duration=2000] - The duration of the animation in milliseconds.
 * @param {Function} [callback] - A callback function that will be called after the animation completes.
 */
function scrambleText(element, finalText, duration = 2000, callback) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const finalLength = finalText.length;
    let startTime;

    function updateText(progress) {
        let newText = '';
        for (let i = 0; i < finalLength; i++) {
            if (i < finalText.length * progress) {
                newText += finalText[i];
            } else {
                newText += characters[Math.floor(Math.random() * characters.length)];
            }
        }
        element.innerText = newText;
    }

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
            updateText(progress);
            requestAnimationFrame(animate);
        } else {
            element.innerText = finalText;
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", function() {
    const loadingElement = document.getElementById('loading');
    const demoElement = document.querySelector('.demo');
    const nameElement = document.querySelector('.name');
    const welcomeElement = document.querySelector('.welcome');
    const radioContainer = document.querySelector('.radio-container');
    const containerElement = document.querySelector('.container');
    const secondSection = document.querySelector('.second-section');
    const thirdSection = document.querySelector('.third-section');
    const radioO = document.getElementById('option-o');
    const radioN = document.getElementById('option-n');
    const projects = document.querySelectorAll('.project');

    let secondSectionVisible = sessionStorage.getItem('secondSectionVisible') === 'true';
    let thirdSectionVisible = sessionStorage.getItem('thirdSectionVisible') === 'true';
    let currentIndex = -1;

    // Vérifier si l'animation des bandes a déjà été effectuée
    if (sessionStorage.getItem('bandesAnimationComplete') === 'true') {
        secondSection.classList.add('animate-complete');
    }

    // Initial loading animation   container section////////////////////////
    if (!sessionStorage.getItem('loadingCompleted')) {
        scrambleText(loadingElement, "Loading", 1000, function() {
            setTimeout(function() {
                demoElement.classList.add('hidden');
                nameElement.classList.add('visible');
                scrambleText(welcomeElement, "Bienvenue\nje suis KEVIN VELLARD\nDEVELOPPEUR FULLSTACK\nVEUX TU EN SAVOIR PLUS?", 1500, function() {
                    radioContainer.classList.add('visible');
                    sessionStorage.setItem('loadingCompleted', 'true');
                });
            }, 500);
        });
    } else {
        demoElement.style.opacity = '0';
        demoElement.style.pointerEvents = 'none';
        nameElement.classList.add('visible');
        welcomeElement.innerText = "Bienvenue\nje suis KEVIN VELLARD\nDEVELOPPEUR FULLSTACK\nVEUX TU EN SAVOIR PLUS?";
        radioContainer.classList.add('visible');
        if (secondSectionVisible) {
            secondSection.classList.add('visible');
        }
    }

    //////////////////////////// Radio button functionality section container/////////////////////////////////////////



    function triggerOptionO(event) {
        event.preventDefault();
        radioO.checked = true;
        handleOptionChange(event);
    }

    radioN.addEventListener('change', handleOptionChange);
    radioO.addEventListener('change', handleOptionChange);
    document.querySelector('label[for="option-o"]').addEventListener('click', triggerOptionO);
    
////////////////////////// SNAKE GAME SECTION/////////////////////////
function handleOptionChange(event) {
    event.preventDefault();
    if (radioN.checked) {
        nameElement.classList.add('hidden');
        initSnakeGame();
          
        // Vérifier si l'appareil est mobile ou iPad
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // Créer un champ de saisie temporaire
            let tempInput = document.createElement('input');
            tempInput.style.position = 'absolute';
            tempInput.style.opacity = '0';
            tempInput.style.height = '0';
            document.body.appendChild(tempInput);

            // Forcer le focus et afficher le clavier
            tempInput.focus();

            // Supprimer le champ après un court délai
            setTimeout(() => {
                document.body.removeChild(tempInput);
            }, 100);
        }
    } else if (radioO.checked) {
        showSecondSection();
    }
}
// Lazy loading des images
const images = document.querySelectorAll('img[data-src]');
const config = {
    rootMargin: '50px 0px',
    threshold: 0.01
};

let observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            preloadImage(entry.target);
            self.unobserve(entry.target);
        }
    });
}, config);

images.forEach(image => {
    observer.observe(image);
});

function preloadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) { return; }
    img.src = src;
}


function initSnakeGame() {
    nameElement.innerHTML = `
    <div class="game-container">
        <main>
            <div class="score-container">
                <div class="message">SnakeGame</div>
                <div class="score">Score: <span>0</span></div>
                <div class="best-score">Best Score: <span>${getBestScore()}</span></div>
            </div>
            <div class="screen-container">
                <div class="demo-snake hidden">Snake</div>
                <canvas width="480" height="460" id="screen"></canvas>
                <button id="closeGame">X</button>
            </div>
        </main>
        <div id="directionalPad" class="directional-pad">
            <button id="upBtn">↑</button>
            <button id="leftBtn">←</button>
            <button id="rightBtn">→</button>
            <button id="downBtn">↓</button>
        </div>
    </div>
`;

    const canvas = document.querySelector('#screen');
    const ctx = canvas.getContext('2d');
    const canvasWidth = 480;
    const canvasHeight = 460;
    const gridSize = 20;

    if (canvasWidth % gridSize !== 0 || canvasHeight % gridSize !== 0) {
        console.error("Le canvas n'est pas divisible par la taille de la grille !");
    }

    const rows = canvas.height / gridSize;
    const columns = canvas.width / gridSize;

    let snake;
    let fruit;
    let gameLoop;

    function debugPositions() {
        console.log("Snake Head:", snake.x, snake.y);
        console.log("Snake Tail:", snake.tail);
        console.log("Fruit:", fruit.x, fruit.y);
    }

    setInterval(debugPositions, 1000);

    class Snake {
        constructor() {
            this.x = 3 * gridSize;
            this.y = 0;
            this.xSpeed = gridSize;
            this.ySpeed = 0;
            this.total = 3;
            this.tail = [
                { x: this.x - 2 * gridSize, y: this.y },
                { x: this.x - gridSize, y: this.y },
                { x: this.x, y: this.y }
            ];
        }

        draw() {
            ctx.fillStyle = "black";
            for (let i = 0; i < this.tail.length; i++) {
                ctx.fillRect(this.tail[i].x, this.tail[i].y, gridSize, gridSize);
            }
            ctx.fillRect(this.x, this.y, gridSize, gridSize);
        }

        update() {
            for (let i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1];
            }

            this.tail[this.total - 1] = { x: this.x, y: this.y };

            this.x += this.xSpeed;
            this.y += this.ySpeed;

            this.x = (this.x + canvas.width) % canvas.width;
            this.y = (this.y + canvas.height) % canvas.height;
        }

        changeDirection(direction) {
            switch (direction) {
                case 'Up':
                    if (this.ySpeed !== gridSize) {
                        this.xSpeed = 0;
                        this.ySpeed = -gridSize;
                    }
                    break;
                case 'Down':
                    if (this.ySpeed !== -gridSize) {
                        this.xSpeed = 0;
                        this.ySpeed = gridSize;
                    }
                    break;
                case 'Left':
                    if (this.xSpeed !== gridSize) {
                        this.xSpeed = -gridSize;
                        this.ySpeed = 0;
                    }
                    break;
                case 'Right':
                    if (this.xSpeed !== -gridSize) {
                        this.xSpeed = gridSize;
                        this.ySpeed = 0;
                    }
                    break;
            }
        }

        eat(fruit) {
            if (this.x === fruit.x && this.y === fruit.y) {
                this.total++;
                return true;
            }
            return false;
        }

        checkCollision() {
            for (let i = 0; i < this.tail.length; i++) {
                if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                    return true;
                }
            }
            return false;
        }
    }

    class Fruit {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.pickLocation();
        }

        pickLocation() {
            do {
                this.x = Math.floor(Math.random() * columns) * gridSize;
                this.y = Math.floor(Math.random() * rows) * gridSize;
            } while (this.isOnSnake({ x: this.x, y: this.y }) || !this.isAlignedWithGrid());
        }

        isAlignedWithGrid() {
            return (
                this.x % gridSize === 0 && 
                this.y % gridSize === 0
            );
        }

        isOnSnake(position) {
            return (
                snake.tail.some(segment => segment.x === position.x && segment.y === position.y) ||
                (snake.x === position.x && snake.y === position.y)
            );
        }

        draw() {
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(this.x, this.y, gridSize, gridSize);
        }
    }

    function startSnakeGame() {
        snake = new Snake();
        fruit = new Fruit();

        gameLoop = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fruit.draw();
            snake.update();
            snake.draw();

            if (snake.eat(fruit)) {
                fruit.pickLocation();
            }

            if (snake.checkCollision()) {
                clearInterval(gameLoop);
                gameOver();
            }

            const currentScore = snake.total - 3;

            // Mettre à jour le score affiché
            document.querySelector('.score span').innerText = currentScore;

            // Vérifier et mettre à jour le meilleur score
            updateBestScore(currentScore);

        }, 100);
    }

    function gameOver() {
        showGameOver();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('keydown', evt => {
        if (evt.key === 'Escape') {
            gameOver();
        } else {
            const direction = evt.key.replace('Arrow', '');
            snake.changeDirection(direction);
        }
    });

    document.getElementById('closeGame').addEventListener('click', gameOver);
    const directionalPad = document.getElementById('directionalPad');
    if (window.innerWidth <= 1280) {
        directionalPad.style.display = 'grid';
        document.getElementById('upBtn').addEventListener('click', () => snake.changeDirection('Up'));
        document.getElementById('leftBtn').addEventListener('click', () => snake.changeDirection('Left'));
        document.getElementById('rightBtn').addEventListener('click', () => snake.changeDirection('Right'));
        document.getElementById('downBtn').addEventListener('click', () => snake.changeDirection('Down'));
    } else {
        directionalPad.style.display = 'none';
    }
    nameElement.classList.remove('hidden');
    startSnakeGame();
}

function showGameOver() {
    nameElement.innerHTML = `
    <div class="game-over">
        <img src='./assets/images/gameover.png' 
             alt='Game Over' 
             style='width: 80%; height: auto; cursor: pointer;'>
             <p>Scores: <span>${document.querySelector('.score span').innerText}</span></p>
             <p>Best Score: <span>${getBestScore()}</span></p>
    </div>
    `;
    
    nameElement.classList.remove('hidden');
    document.querySelector('.name img').addEventListener('click', function() {
        location.reload();
    });
}

// Fonction pour récupérer le meilleur score depuis localStorage
function getBestScore() {
    return localStorage.getItem('bestScore') || 0; // Retourne "0" si aucun score n'est enregistré
}

// Fonction pour mettre à jour le meilleur score dans localStorage
function updateBestScore(currentScore) {
    const bestScore = getBestScore();
    
    if (currentScore > bestScore) {
        localStorage.setItem('bestScore', currentScore);
        
        // Mettre à jour l'affichage du meilleur score
        document.querySelector('.best-score span').innerText = currentScore;
    }
}


    //////////////////////////// feature secondsection ///////////////////////////
    function showSecondSection() {
        const container = document.querySelector('.container');
        let pixelCount = 0;
        const totalPixels = window.innerHeight;

        function animateTransition() {
            pixelCount += 20; // Ajustez ce nombre pour contrôler la vitesse de l'animation
            const progress = pixelCount / totalPixels;
            container.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`;
            secondSection.style.clipPath = `inset(${100 - progress * 100}% 0 0 0)`;

            if (pixelCount < totalPixels) {
                requestAnimationFrame(animateTransition);
            } else {
                container.style.display = 'none';
                secondSection.style.clipPath = 'none';
                secondSection.classList.add('visible');
                secondSectionVisible = true;
                sessionStorage.setItem('secondSectionVisible', 'true');
            }
        }

        secondSection.style.display = 'block';
        requestAnimationFrame(animateTransition);

        // Vérifier si l'animation a déjà été effectuée////////////////////////
        if (sessionStorage.getItem('bandesAnimationComplete') !== 'true') {
            // Utilisation de IntersectionObserver pour détecter quand la section est visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // Attendre 0.5 seconde après que la section soit complètement visible
                    setTimeout(() => {
                        secondSection.classList.add('animate');
                        // Retirer l'animation et cacher définitivement les bandes après 2.5 secondes
                        setTimeout(() => {
                            secondSection.classList.remove('animate');
                            secondSection.classList.add('animate-complete');
                            sessionStorage.setItem('bandesAnimationComplete', 'true');
                        }, 2500);
                    }, 500);
                    observer.disconnect(); // Arrêter l'observation après le déclenchement
                }
            }, { threshold: 1.0 });

            observer.observe(secondSection);
        } else {
            // Si l'animation a déjà été effectuée, appliquer directement la classe finale
            secondSection.classList.add('animate-complete');
        }
    }

    
   

    function showFirstSection() {
        console.log("showFirstSection called"); // Log pour déboguer/////////////////////////////////
        const container = document.querySelector('.container');
        const secondSection = document.querySelector('.second-section');
        let pixelCount = 0;
        const totalPixels = window.innerHeight;
    
        function animateTransition() {
            pixelCount += 15;
            const progress = pixelCount / totalPixels;
            container.style.clipPath = `inset(${100 - progress * 100}% 0 0 0)`;
            secondSection.style.clipPath = `inset(0 0 ${progress * 100}% 0)`;
    
            if (pixelCount < totalPixels) {
                requestAnimationFrame(animateTransition);
            } else {
                secondSection.style.display = 'none';
                container.style.clipPath = 'none';
                container.style.display = 'block';
                secondSectionVisible = false;
                sessionStorage.setItem('secondSectionVisible', 'false');
            }
        }
    
        container.style.display = 'block';
        requestAnimationFrame(animateTransition);
    }
    

    ////////////////////////// Création et ajout du bouton Back /////////////////////////////////
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.classList.add('back-button');
    backButton.addEventListener('click', showFirstSection);
    document.querySelector('.second-section').appendChild(backButton);

    document.addEventListener('DOMContentLoaded', () => {
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.classList.add('back-button');
        backButton.addEventListener('click', showFirstSection);
        document.querySelector('.second-section').appendChild(backButton);
    });
    backButton.innerHTML = '&#8592; Back'; // Flèche gauche



    //////////////////////////// Project selection functionality///////////////////////////
    ////////////////////////////UPDATE PROJECT IMAGE///////////////////////////
    function updateProjectImage(project, isHovered) {
        const img = project.querySelector('img');
        const isLastProject = project === projects[projects.length - 2];
        const isVeryLastProject = project === projects[projects.length - 1];

        
        if (isHovered) {
            img.src = isLastProject 
                ? './assets/images/icons/saveicon/double/icons8-tout-sauvegarder-80.webp'
                : './assets/images/icons/computer/open/icons8-dossier-ouvert-80.png';
        } else {
            img.src = isLastProject
                ? './assets/images/icons/saveicon/icons8-sauvegarder-80.webp'
                : './assets/images/icons/computer/icons8-dossier-80.webp';
        }

        if (isVeryLastProject) {
            img.src = isHovered
                ? './assets/images/icons/icons8-décrocher-le-téléphone-100.webp'
                : './assets/images/icons/icons8-téléphone-raccroché-100.webp';
        }
        
    }

//////////FEATURE RADIO BUTTONS SECONDSECTION//////////////////////////
    projects.forEach((project, index) => {
        project.addEventListener('mouseenter', () => updateProjectImage(project, true));
        project.addEventListener('mouseleave', () => updateProjectImage(project, false));
        project.addEventListener('focus', () => {
            currentIndex = index;
            projects.forEach((p, i) => {
                updateProjectImage(p, i === index);
            });
        });
        project.addEventListener('click', (event) => {
            if (index === projects.length - 2 || index === projects.length - 1) {
                event.preventDefault();
                showThirdSection();
            }
        });
    });

    
    //////////////////////////// KEYBOARD FEATURES RADIOBUTTON///////////////////////////

    function handleKeyNavigation(event) {
        if (!secondSectionVisible) return;
        
        switch(event.key) {
            case 'ArrowRight':
                currentIndex = (currentIndex + 1) % projects.length;
                break;
            case 'ArrowLeft':
                currentIndex = (currentIndex - 1 + projects.length) % projects.length;
                break;
            case 'Enter':
                if (currentIndex !== -1) {
                    if (currentIndex === projects.length - 2) {
                        showThirdSection();
                    } else {
                        projects[currentIndex].querySelector('a').click();
                    }
                }
                return;
            default:
                return;
        }
        projects.forEach((p, i) => updateProjectImage(p, i === currentIndex));
        projects[currentIndex].focus();
        event.preventDefault();
    }

    
    
    //////////////SHOW THIRD SECTION//////////////////////////
    function showThirdSection() {
        const container = document.querySelector('.second-section');
        let pixelCount = 0;
        const totalPixels = window.innerHeight;

        function animateTransition() {
            pixelCount += 15; // Ajustez ce nombre pour contrôler la vitesse de l'animation////////////////////////
            const progress = pixelCount / totalPixels;
            container.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`;
            thirdSection.style.clipPath = `inset(${100 - progress * 100}% 0 0 0)`;

            if (pixelCount < totalPixels) {
                requestAnimationFrame(animateTransition);
            } else {
                container.style.display = 'none';
                thirdSection.style.clipPath = 'none';
                thirdSection.classList.add('visible');
                thirdSectionVisible = true;
                sessionStorage.setItem('thirdSectionVisible', 'true');
            }
        }

        thirdSection.style.display = 'block';
        requestAnimationFrame(animateTransition);
    }

//////////STARTZOOMTRANSITION//////
console.log("Script chargé");
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé");
    const zoomLink = document.querySelector('.zoom-link');
    if (zoomLink) {
        zoomLink.addEventListener('click', function(e) {
            e.preventDefault();
            startZoomTransition();
        });
    } else {
        console.log("Lien zoom non trouvé");
    }
});

function startZoomTransition() {
    const overlay = document.getElementById('transition-overlay');
    overlay.style.opacity = '1';
    document.body.classList.add('zooming');
    
    setTimeout(() => {
        window.location.href = './project-pdf.html';
    }, 2000);
}

// Pour la page project-pdf.html
if (document.querySelector('.zoom-container')) {
    document.querySelector('.zoom-container').classList.add('zooming-out');
    setTimeout(() => {
        document.querySelector('.zoom-container').classList.remove('zooming-out');
    }, 2000);
}





/////////////////////////////////////////////THIRD SECTION///////////////////////////////////////////////////
    ///////////////ANIMATION GO BACK TO SECOND SECTION//////////////////////////
    function returnToSecondSection() {
        const secondSection = document.querySelector('.second-section');
        const thirdSection = document.querySelector('.third-section');
        let pixelCount = 0;
        const totalPixels = window.innerHeight;
    
        function animateTransition() {
            pixelCount += 15;
            const progress = pixelCount / totalPixels;
            thirdSection.style.clipPath = `inset(0 0 ${progress * 100}% 0)`;
            secondSection.style.clipPath = `inset(${100 - progress * 100}% 0 0 0)`;
    
            if (pixelCount < totalPixels) {
                requestAnimationFrame(animateTransition);
            } else {
                thirdSection.style.display = 'none';
                secondSection.style.clipPath = 'none';
                secondSection.style.display = 'block';
                sessionStorage.setItem('secondSectionVisible', 'true');
                sessionStorage.setItem('thirdSectionVisible', 'false');
            }
        }
    
        secondSection.style.display = 'block';
        requestAnimationFrame(animateTransition);
    }

    ///////////////// Création et ajout du bouton Back TO SECONDSECTION//////////////////////////
    const thirdBackButton = document.createElement('button');
    thirdBackButton.textContent = 'Back';
    thirdBackButton.classList.add('third-back-button');
    thirdBackButton.addEventListener('click', returnToSecondSection);
    document.querySelector('.third-section').appendChild(thirdBackButton);

    document.addEventListener('DOMContentLoaded', () => {
        const thirdBackButton = document.createElement('button');
        thirdBackButton.textContent = 'Back';
        thirdBackButton.classList.add('third-back-button');
        thirdBackButton.addEventListener('click', returnToSecondSection);
        document.querySelector('.third-section').appendChild(thirdBackButton);
    });
    thirdBackButton.innerHTML = '&#8592; Back'; // Flèche gauche////////////////////////
    
    
    ///////////////// Keyboard navigation for back button (echap)+ TOGGLE BUTTON////////////////////////////

    document.addEventListener('DOMContentLoaded', () => {
        const skillsLink = document.getElementById('skillsLink');
        const contactLink = document.getElementById('contactLink');
    
        if (skillsLink) skillsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showThirdSection();
        });
    
        if (contactLink) contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            showThirdSection();
        });
    
        ///////////////// Initialisation des états si nécessaire////////////////////////
        if (!sessionStorage.getItem('secondSectionVisible')) {
            sessionStorage.setItem('secondSectionVisible', 'true');
        }
        if (!sessionStorage.getItem('thirdSectionVisible')) {
            sessionStorage.setItem('thirdSectionVisible', 'false');
        }

        ////////diaporama thirdcontactwmax420////////////////////////
        const skillsContact = document.querySelector('.skills-contact');
        const perspectiveSkills = document.querySelector('.perspective-skills');
        const thirdSection = document.querySelector('.third-section');
        let isAnimating = true;
        let currentSlide = 0;
      
        function switchSlide() {
            if (currentSlide === 0) {
              skillsContact.classList.add('slide-out');
              perspectiveSkills.classList.add('slide-in');
              perspectiveSkills.style.display = 'block';
              currentSlide = 1;
            } else {
              skillsContact.classList.remove('slide-out');
              perspectiveSkills.classList.remove('slide-in');
              setTimeout(() => {
                perspectiveSkills.style.display = 'none';
              }, 500); // Attendre la fin de la transition
              currentSlide = 0;
            }
          }
      
        function startSlideshow() {
          if (isAnimating && window.innerWidth <= 420) {
            switchSlide();
          }
        }
      
        let slideshowInterval = setInterval(startSlideshow, 3000);
      
        thirdSection.addEventListener('touchstart', () => {
          isAnimating = !isAnimating;
          if (!isAnimating) {
            clearInterval(slideshowInterval);
          } else {
            slideshowInterval = setInterval(startSlideshow, 3000);
          }
        });
      
        window.addEventListener('resize', () => {
          if (window.innerWidth > 420) {
            clearInterval(slideshowInterval);
            skillsContact.classList.remove('slide-out');
            perspectiveSkills.classList.remove('slide-in');
          } else if (isAnimating) {
            slideshowInterval = setInterval(startSlideshow, 3000);
          }
        });
    });
    
   ///////////////////////// Keyboard navigation for back button (echap)////////////////////////////
   function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        const secondSection = document.querySelector('.second-section');
        const thirdSection = document.querySelector('.third-section');

        if (thirdSection && getComputedStyle(thirdSection).display !== 'none') {
            // Si la troisième section est visible, retournez à la deuxième section
            returnToSecondSection();
        } else if (secondSection && getComputedStyle(secondSection).display !== 'none') {
            // Si la deuxième section est visible, retournez à la première section
            showFirstSection();
        }
    }
}

// Ajoutez cet écouteur d'événements au document
document.addEventListener('keydown', handleEscapeKey);

    document.addEventListener('keydown', handleKeyNavigation);

    //////////// function showSecondSection//////////////////////////
    function showSecondSection() {
        const container = document.querySelector('.container');
        let pixelCount = 0;
        const totalPixels = window.innerHeight;

        function animateTransition() {
            pixelCount += 5; // Ajustez ce nombre pour contrôler la vitesse de l'animation
            const progress = pixelCount / totalPixels;
            container.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`;
            secondSection.style.clipPath = `inset(${100 - progress * 100}% 0 0 0)`;

            if (pixelCount < totalPixels) {
                requestAnimationFrame(animateTransition);
            } else {
                container.style.display = 'none';
                secondSection.style.clipPath = 'none';
                secondSection.classList.add('visible');
                secondSectionVisible = true;
                sessionStorage.setItem('secondSectionVisible', 'true');
            }
        }

        secondSection.style.display = 'block';
        requestAnimationFrame(animateTransition);

        // Vérifier si l'animation a déjà été effectuée
        if (sessionStorage.getItem('bandesAnimationComplete') !== 'true') {
            // Utilisation de IntersectionObserver pour détecter quand la section est visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // Attendre 0.5 seconde après que la section soit complètement visible
                    setTimeout(() => {
                        secondSection.classList.add('animate');
                        // Retirer l'animation et cacher définitivement les bandes après 2.5 secondes
                        setTimeout(() => {
                            secondSection.classList.remove('animate');
                            secondSection.classList.add('animate-complete');
                            sessionStorage.setItem('bandesAnimationComplete', 'true');
                        }, 2500);
                    }, 500);
                    observer.disconnect(); // Arrêter l'observation après le déclenchement
                }
            }, { threshold: 1.0 });

            observer.observe(secondSection);
        } else {
            // Si l'animation a déjà été effectuée, appliquer directement la classe finale
            secondSection.classList.add('animate-complete');
        }
    }



    ///////////////// Keyboard navigation for radio buttons//////////////////////////
    document.addEventListener('keydown', function(event) {
        if (!secondSectionVisible) {
            if (event.key.toLowerCase() === 'o' || (event.key === 'Enter' && radioO.checked)) {
                event.preventDefault();
                radioO.checked = true;
                handleOptionChange(event);
            } else if (event.key.toLowerCase() === 'n' || (event.key === 'Enter' && radioN.checked)) {
                event.preventDefault();
                radioN.checked = true;
                handleOptionChange(event);
            } else if (event.key === 'ArrowLeft') {
                radioO.checked = true;
            } else if (event.key === 'ArrowRight') {
                radioN.checked = true;
            }
        }
    });
});


///////////////////////////////////// CARDS ////////////////////////////////
// function map(val, minA, maxA, minB, maxB) {
//     return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
//   }
  
//   function Card3D(card, ev) {
//     let cardContent = card.querySelector('.card-content');
//     let cardRect = card.getBoundingClientRect();
//     let width = cardRect.width;
//     let height = cardRect.height;
//     let mouseX = ev.offsetX;
//     let mouseY = ev.offsetY;
//     // Augmenter la plage de rotation pour un effet plus prononcé
//     let rotateY = map(mouseX, 0, width, -35, 35);
//     let rotateX = map(mouseY, 0, height, 35, -35);
//     // Augmenter la plage de luminosité pour un effet plus contrasté
//     let brightness = map(mouseY, 0, height, 1.7, 0.3);
    
//     cardContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//     cardContent.style.filter = `brightness(${brightness})`;
// }
// var cards = document.querySelectorAll('.card3d');

// cards.forEach((card) => {
//     card.addEventListener('mousemove', (ev) => {
//         Card3D(card, ev);
//     });
    
//     card.addEventListener('mouseleave', (ev) => {
//         let cardContent = card.querySelector('.card-content');
        
//         cardContent.style.transform = 'rotateX(0deg) rotateY(0deg)';
//         cardContent.style.filter = 'brightness(1)';
//     });
// });

function map(val, minA, maxA, minB, maxB) {
    return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
}

function Card3D(card, ev) {
    let cardContent = card.querySelector('.card-content');
    let cardRect = card.getBoundingClientRect();
    let width = cardRect.width;
    let height = cardRect.height;
    let mouseX = ev.offsetX;
    let mouseY = ev.offsetY;
    let rotateY = map(mouseX, 0, width, -35, 35);
    let rotateX = map(mouseY, 0, height, 35, -35);
    let brightness = map(mouseY, 0, height, 1.7, 0.3);
    
    cardContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardContent.style.filter = `brightness(${brightness})`;
}

function resetCard(cardContent) {
    cardContent.style.transform = 'rotateX(0deg) rotateY(0deg)';
    cardContent.style.filter = 'brightness(1)';
}

function animateCardOnTouch(card) {
    let cardContent = card.querySelector('.card-content');
    cardContent.style.transition = 'transform 2s, filter 2s';
    cardContent.style.transform = 'rotateX(-360deg) rotateY(-360deg)';
    cardContent.style.filter = 'brightness(1.5)';
    
    setTimeout(() => {
        resetCard(cardContent);
    }, 1000);
}

var cards = document.querySelectorAll('.card3d');
var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
var isSmallScreen = window.matchMedia("(max-width: 951px), (max-width: 1280px) and (orientation: landscape)").matches;

cards.forEach((card) => {
    if (!isTouchDevice && !isSmallScreen) {
        // Comportement pour desktop
        card.addEventListener('mousemove', (ev) => {
            Card3D(card, ev);
        });
        
        card.addEventListener('mouseleave', (ev) => {
            resetCard(card.querySelector('.card-content'));
        });
    } else {
        // Comportement pour appareils tactiles ou petits écrans
        card.addEventListener('click', () => {
            animateCardOnTouch(card);
        });
    }
});




///////PARALLAX EFFECT////////