document.addEventListener('DOMContentLoaded', function() {
    const languageRadios = document.querySelectorAll('input[name="language"]');
    
    // Vérifie quel élément existe dans le DOM
    const descriptionElement = document.getElementById('description');
    const descriptionElement2 = document.getElementById('description2');
    const descriptionElement3 = document.getElementById('description3');

    const translations = {
        en: { 
            description: "TerroTerro aims to foster a strong connection between consumers and local producers while supporting sustainable agricultural practices. Using technologies such as JavaScript, Node.js, Next.js, and React Native, the project seeks to simplify direct sales between producers and buyers, thus contributing to the well-being of crops, consumers, and producers. Farmers and consumers can easily access important information about their products, such as origin, quantity, price, as well as a profile detailing their presentation and location, directly from their smartphones. Moreover, the project is developed with a mobile-first approach, allowing farmers to access the system from any device. It was developed as part of my training as an Application Developer and Designer and was presented as the final project during the certification exam.",
            description2: "This personal portfolio showcases my professional journey as a fullstack developer in an interactive and playful manner. The main feature is a small integrated surprise that offers a unique and engaging user experience. It includes a dynamic loading animation, welcome text with a scramble effect, and interactive radio buttons. An Easter Egg is also included for added fun. The portfolio allows for quick start and features intuitive controls using the arrow keys. It incorporates a score and highscore system, along with a customized game over screen. The background is translucent, allowing visibility of the underlying content. Users can choose between discovering more information or exploring a playful option (curiosity killed the cat). The game can be paused, and there is a button to close it. The highscore is saved in localStorage.",
            description3:"This project is a versioned API developed using Node.js, Express, Sequelize, and SQLite, deployed on Render.com. The API, designed following the MVC architecture, enables CRUD operations for jokes in a database, including POST requests via Postman, GET requests for all jokes, retrieving a specific joke by ID, and fetching a random joke. The frontend is deployed on GitHub Pages, leveraging static site hosting capabilities. The API is documented using Swagger, with the GitHub repository README containing links to both the API repository and Swagger documentation. The project is structured as two separate GitHub repositories: one for the frontend and another for the backend, adhering to microservices principles. / Key features include:RESTful API endpoints for joke management / ORM implementation with Sequelize for database interactions / SQLite database for persistent storage / Express.js framework for routing and middleware / Swagger integration for API documentation / Continuous deployment setup with Render.com for backend / Static site hosting on GitHub Pages for frontend / Separation of concerns with distinct frontend and backend repositories / This architecture allows for scalable development, easy maintenance, and clear separation between client-side and server-side logic, while leveraging modern web development practices and tools"
        },
        fr: {
            description: "TerroTerro vise à favoriser une connexion solide entre les consommateurs et les producteurs locaux tout en soutenant des pratiques agricoles durables. En utilisant des technologies telles que JavaScript, Node.js, Next.js et React Native, le projet cherche à simplifier les ventes directes entre producteurs et acheteurs, contribuant ainsi au bien-être des cultures, des consommateurs et des producteurs. Les agriculteurs et les consommateurs peuvent facilement accéder à des informations importantes sur leurs produits, telles que l'origine, la quantité, le prix, ainsi qu'un profil détaillant leur présentation et leur localisation, directement depuis leurs smartphones. De plus, le projet est réalisé en application mobile-first, permettant aux agriculteurs d'accéder au système depuis n'importe quel appareil. Il a été développé dans le cadre de ma formation de Concepteur Développeur d'Applications et a été présenté comme projet final lors de l'examen de certification.",
            description2: "Ce portfolio personnel présente mon parcours professionnel de développeur fullstack de manière interactive et ludique. L'élément principal est une petite surprise intégrée qui offre une expérience utilisateur unique et engageante.Fonctionnalités : Page d'accueil avec animation de chargement dynamique ; Texte de bienvenue avec effet de scramble ; Boutons radio interactifs ; Easter Egg ; Démarrage rapide ; Contrôles intuitifs avec les touches fléchées ; Système de score et de highscore ; Écran de game over personnalisé ; Fond translucide permettant de voir l'arrière-plan ; Sauvegarde du highscore dans localStorage.",
            description3:"Ce projet est une API versionnée développée avec Node, Express, Sequelize et SQLite, déployée sur Render.com. L'API, conçue selon l'approche MVC, permet d'ajouter des blagues à une base de données via Postman, de consulter toutes les blagues, de consulter une blague spécifique via son ID, et de consulter une blague aléatoire. La partie frontale est déployée sur GitHub Pages. L'API est documentée à l'aide de Swagger et le README du repo GitHub inclut les liens vers le repo API et la documentation Swagger. Le projet est divisé en deux dépôts GitHub distincts : un pour le front et un pour le back.Les fonctionnalités clés incluent : des endpoints RESTful pour la gestion des blagues / Implémentation ORM avec Sequelize pour les interactions avec la base de données / Base de données SQLite pour le stockage persistant / Framework Express.js pour le routage et les middlewares / Intégration Swagger pour la documentation de l'API / Configuration de déploiement continu avec Render.com pour le backend / Hébergement statique sur GitHub Pages pour le frontend / Séparation des préoccupations avec des dépôts distincts pour le frontend et le backend / Cette architecture permet un développement évolutif, une maintenance simplifiée et une séparation claire entre les logiques côté client et côté serveur, tout en s'appuyant sur des pratiques et outils modernes du développement web."
        }
    };

    languageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedLanguage = this.value;

            // Mise à jour du texte pour l'élément avec id="description" s'il existe
            if (descriptionElement) {
                descriptionElement.textContent = translations[selectedLanguage].description;
            }

            // Mise à jour du texte pour l'élément avec id="description2" s'il existe
            if (descriptionElement2) {
                descriptionElement2.textContent = translations[selectedLanguage].description2;
            }

            if (descriptionElement3) {
                descriptionElement3.textContent = translations[selectedLanguage].description3;
                }
        });
    });

    // Définir la langue par défaut sur Français
    if (descriptionElement) {
        descriptionElement.textContent = translations.fr.description;
    }
    if (descriptionElement2) {
        descriptionElement2.textContent = translations.fr.description2;
    }
    if (descriptionElement3) {
        descriptionElement3.textContent = translations.fr.description3;
    }
});
