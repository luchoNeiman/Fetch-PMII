// assets/js/script.js

class House {
    constructor({ id, name, animal, houseColours, traits }) {
        this.id = id;
        this.nombre = name;
        this.color = houseColours;
        this.animal = animal;
        // traits es un array de objetos { name: "Valor" }
        this.valores = traits ? traits.map(t => t.name) : [];
    }

    renderListItem(container, detailContainer) {
        // Crea la card semántica
        const card = document.createElement('article');
        card.className = `house-card house-${this.nombre.toLowerCase()}`;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver detalles de la casa ${this.nombre}`);

        // Contenido de la card
        const content = document.createElement('div');
        content.className = 'house-card-content';
        content.innerHTML = `<h2>${this.nombre}</h2>`;

        card.appendChild(content);

        card.addEventListener('click', () => {
            this.renderDetail(detailContainer);
        });
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') this.renderDetail(detailContainer);
        });

        // Contenedor flex para las cards
        container.classList.add('house-cards-container');
        container.appendChild(card);
    }

    renderDetail(container) {
        container.innerHTML = '';

        const title = document.createElement('h3');
        title.textContent = this.nombre;

        const color = document.createElement('p');
        color.textContent = `Colores: ${this.color}`;

        const animal = document.createElement('p');
        animal.textContent = `Animal: ${this.animal}`;

        const valores = document.createElement('p');
        valores.textContent = `Valores: ${this.valores.join(', ')}`;

        container.appendChild(title);
        container.appendChild(color);
        container.appendChild(animal);
        container.appendChild(valores);

        this.fetchCharacters(container);
    }

    fetchCharacters(container) {
        const p = document.createElement('p');
        p.textContent = 'Cargando personajes...';
        container.appendChild(p);

        fetch(`https://hp-api.onrender.com/api/characters/house/${this.nombre.toLowerCase()}`)
            .then(res => res.json())
            .then(data => {
                p.remove();
                console.log(data);
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'characters-cards-container';

                data.forEach(char => {
                    const card = document.createElement('div');
                    card.className = 'character-card';

                    const img = document.createElement('img');
                    img.src = char.image || console.log("No se cargó correctamente la imagen del personaje");
                    img.alt = char.name;
                    img.className = 'character-img';
                    img.onerror = function () {
                        this.onerror = null;
                        this.src = `assets/img/${char.house ? char.house.toLowerCase() : 'hogwarts'}.webp`;
                    };

                    const name = document.createElement('p');
                    name.textContent = char.name;
                    name.className = 'character-name';

                    card.appendChild(img);
                    card.appendChild(name);
                    cardsContainer.appendChild(card);
                });

                container.appendChild(cardsContainer);
            })
            .catch(err => {
                p.textContent = 'Error al cargar personajes.';
            });
    }

}

const API_HOUSES_URL = 'https://hp-api.onrender.com/api/characters/house';
const HOUSE_INFO_URL = 'https://wizard-world-api.herokuapp.com/Houses';

function fetchAndRenderHouses(listContainer, detailContainer) {
    const loading = document.createElement('p');
    loading.textContent = 'Cargando casas...';
    listContainer.appendChild(loading);

    fetch(HOUSE_INFO_URL)
        .then(res => res.json())
        .then(data => {
            loading.remove();
            data.forEach(h => {
                const house = new House(h);
                house.renderListItem(listContainer, detailContainer);
            });
        })
        .catch(err => {
            loading.textContent = 'Error al cargar las casas.';
        });
}

// DOM Ready

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html') || path.endsWith('/')) {
        const btnQuiz = document.getElementById('start-quiz');
        const btnExplore = document.getElementById('explore-houses');

        btnQuiz?.addEventListener('click', () => window.location.href = 'quiz.html');
        btnExplore?.addEventListener('click', () => window.location.href = 'house.html');
    }

    if (path.includes('house.html')) {
        const listContainer = document.getElementById('house-list');
        const detailContainer = document.getElementById('house-detail');
        fetchAndRenderHouses(listContainer, detailContainer);
    }

    if (path.includes('quiz.html')) {
        const quizContainer = document.getElementById('quiz-content');
        const h3 = document.createElement('h3');
        h3.textContent = 'Pronto aparecerán las preguntas aquí.';
        quizContainer.appendChild(h3);
    }
});
