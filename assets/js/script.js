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

        switch (this.nombre) {
            case 'Gryffindor':
                content.innerHTML += `<img src="assets/img/gryffindor.webp" alt="${this.nombre} logo">`;
                break;
            case 'Hufflepuff':
                content.innerHTML += `<img src="assets/img/hufflepuff.webp" alt="${this.nombre} logo">`;
                break;
            case 'Ravenclaw':
                content.innerHTML += `<img src="assets/img/ravenclaw.webp" alt="${this.nombre} logo">`;
                break;
            case 'Slytherin':
                content.innerHTML += `<img src="assets/img/slytherin.webp" alt="${this.nombre} logo">`;
                break;
            default:
                break;
        }

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
        color.textContent = `Colors: ${this.color}`;

        const animal = document.createElement('p');
        animal.textContent = `Animal: ${this.animal}`;

        const valores = document.createElement('p');
        valores.textContent = `Values: ${this.valores.join(', ')}`;

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
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'characters-cards-container';

                data.forEach(char => {
                    const card = document.createElement('div');
                    card.className = 'character-card';

                    const img = document.createElement('img');
                    img.src = char.image || '';
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

// Clase Quiz para el cuestionario del sombrero seleccionador
class Quiz {
    constructor(container) {
        this.container = container;
        this.questions = [
            {
                question: "¿Qué animal te representa mejor?",
                options: [
                    { text: "León", house: "Gryffindor" },
                    { text: "Serpiente", house: "Slytherin" },
                    { text: "Águila", house: "Ravenclaw" },
                    { text: "Tejón", house: "Hufflepuff" }
                ]
            },
            {
                question: "¿Qué valoras más?",
                options: [
                    { text: "Valentía", house: "Gryffindor" },
                    { text: "Astucia", house: "Slytherin" },
                    { text: "Sabiduría", house: "Ravenclaw" },
                    { text: "Lealtad", house: "Hufflepuff" }
                ]
            },
            {
                question: "¿Qué lugar prefieres en Hogwarts?",
                options: [
                    { text: "La sala común junto al fuego", house: "Gryffindor" },
                    { text: "Las mazmorras", house: "Slytherin" },
                    { text: "La torre más alta", house: "Ravenclaw" },
                    { text: "El jardín", house: "Hufflepuff" }
                ]
            }
            // Puedes agregar más preguntas aquí
        ];
        this.current = 0;
        this.scores = {
            Gryffindor: 0,
            Slytherin: 0,
            Ravenclaw: 0,
            Hufflepuff: 0
        };
        this.showQuestion(this.current);
    }

    showQuestion(idx) {
        this.container.innerHTML = '';
        if (idx >= this.questions.length) {
            this.showResult();
            return;
        }
        const q = this.questions[idx];
        const qBox = document.createElement('div');
        qBox.className = 'quiz-question-box';

        const qTitle = document.createElement('h2');
        qTitle.textContent = q.question;
        qBox.appendChild(qTitle);

        const opts = document.createElement('div');
        opts.className = 'quiz-options';

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = `quiz-option-btn house-${opt.house.toLowerCase()}`;
            btn.textContent = opt.text;
            btn.onclick = () => {
                this.scores[opt.house]++;
                this.showQuestion(idx + 1);
            };
            opts.appendChild(btn);
        });

        qBox.appendChild(opts);
        this.container.appendChild(qBox);
    }

    showResult() {
        this.container.innerHTML = '';
        const max = Math.max(...Object.values(this.scores));
        const winners = Object.keys(this.scores).filter(h => this.scores[h] === max);
        // Si hay empate, elige aleatorio entre los ganadores
        const house = winners[Math.floor(Math.random() * winners.length)];

        const resultBox = document.createElement('div');
        resultBox.className = `quiz-result house-${house.toLowerCase()}`;

        resultBox.innerHTML = `
            <h2>¡Tu casa es <span>${house}</span>!</h2>
            <img src="assets/img/${house.toLowerCase()}.webp" alt="Escudo de ${house}" class="quiz-result-img">
            <p>¡Felicitaciones! El Sombrero Seleccionador te ha asignado a <b>${house}</b>.</p>
            <button class="quiz-restart-btn">Volver a intentar</button>
        `;
        this.container.appendChild(resultBox);

        this.container.querySelector('.quiz-restart-btn').onclick = () => {
            this.current = 0;
            this.scores = {
                Gryffindor: 0,
                Slytherin: 0,
                Ravenclaw: 0,
                Hufflepuff: 0
            };
            this.showQuestion(this.current);
        };
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
        new Quiz(quizContainer);
    }
});