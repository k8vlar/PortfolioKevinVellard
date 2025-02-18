// Description: This script is used to translate the project description into French and English.
document.addEventListener('DOMContentLoaded', function() {
    const languageRadios = document.querySelectorAll('input[name="language"]');
    const descriptionElement = document.getElementById('description');

    const translations = {
        en: "TerroTerro aims to foster a strong connection between consumers and local producers while supporting sustainable agricultural practices. Using technologies such as JavaScript, Node.js, Next.js, and React Native, the project seeks to simplify direct sales between producers and buyers, thus contributing to the well-being of crops, consumers, and producers. Farmers and consumers can easily access important information about their products, such as origin, quantity, price, as well as a profile detailing their presentation and location, directly from their smartphones. Moreover, the project is developed with a mobile-first approach, allowing farmers to access the system from any device. It was developed as part of my training as an Application Developer and Designer and was presented as the final project during the certification exam.",
        fr: "TerroTerro vise à favoriser une connexion solide entre les consommateurs et les producteurs locaux tout en soutenant des pratiques agricoles durables. En utilisant des technologies telles que JavaScript, Node.js, Next.js et React Native, le projet cherche à simplifier les ventes directes entre producteurs et acheteurs, contribuant ainsi au bien-être des cultures, des consommateurs et des producteurs. Les agriculteurs et les consommateurs peuvent facilement accéder à des informations importantes sur leurs produits, telles que l'origine, la quantité, le prix, ainsi qu'un profil détaillant leur présentation et leur localisation, directement depuis leurs smartphones. De plus, le projet est réalisé en application mobile-first, permettant aux agriculteurs d'accéder au système depuis n'importe quel appareil. Il a été développé dans le cadre de ma formation de Concepteur Développeur d'Applications et a été présenté comme projet final lors de l'examen de certification."
    };

    languageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedLanguage = this.value;
            descriptionElement.textContent = translations[selectedLanguage];
        });
    });

    // Set default language to French
    descriptionElement.textContent = translations.fr;
});
