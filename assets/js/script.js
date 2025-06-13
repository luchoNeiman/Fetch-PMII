// =======================
// CONFIG & CONSTANTES
// =======================
const API_HOUSES_URL = 'https://hp-api.onrender.com/api/characters/house';
const HOUSE_INFO_URL = 'https://wizard-world-api.herokuapp.com/Houses';

// =======================
// CLASES
// =======================
class House {
    constructor({ id, name, animal, houseColours, traits }) {
        this.id = id;
        this.nombre = name;
        this.color = houseColours;
        this.animal = animal;
        this.valores = traits?.map(t => t.name) || [];
    }

    renderListItem(container, detailContainer) {
        const card = document.createElement('article');
        card.className = `house-card house-${this.nombre.toLowerCase()}`;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver detalles de la casa ${this.nombre}`);

        const content = document.createElement('div');
        content.className = 'house-card-content';

        const imgSrc = `assets/img/casa${this.nombre}.jpg`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${this.nombre} logo`;

        content.appendChild(img);
        card.appendChild(content);

        card.addEventListener('click', () => this.renderDetail(detailContainer));
        card.addEventListener('keypress', e => {
            if (e.key === 'Enter' || e.key === ' ') this.renderDetail(detailContainer);
        });

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

        container.classList.add('detail-container-info');
        container.append(title, color, animal, valores);

        this.fetchCharacters(container);
    }

    fetchCharacters(container) {
        const loading = document.createElement('p');
        loading.textContent = 'Cargando personajes...';
        loading.className = 'loading-message';
        container.appendChild(loading);

        fetch(`${API_HOUSES_URL}/${this.nombre.toLowerCase()}`)
            .then(res => res.json())
            .then(data => {
                loading.remove();
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
                        this.src = `assets/img/${char.house?.toLowerCase() || 'hogwarts'}.webp`;
                    };

                    const name = document.createElement('p');
                    name.textContent = char.name;
                    name.className = 'character-name';

                    card.append(img, name);
                    cardsContainer.appendChild(card);
                });

                container.appendChild(cardsContainer);
            })
            .catch(() => {
                loading.textContent = 'Error al cargar personajes.';
            });
    }
}

class Quiz {
    constructor(container) {
        this.container = container;
        this.current = 0;
        this.scores = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
        this.questions = getQuizQuestions();
        this.showQuestion(this.current);
    }

    showQuestion(idx) {
        this.container.innerHTML = '';
        if (idx >= this.questions.length) return this.showResult();

        const q = this.questions[idx];
        const qBox = document.createElement('div');
        qBox.className = 'quiz-question-box';
        qBox.innerHTML = `<h2>${q.question}</h2>`;

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
            this.scores = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
            this.showQuestion(this.current);
        };
    }
}

// =======================
// FUNCIONES AUXILIARES
// =======================
function getQuizQuestions() {
    return [
        {
            question: "¿Qué animal te representa mejor?",
            options: [
                { text: "León", house: "Gryffindor" },
                { text: "Serpiente", house: "Slytherin" },
                { text: "Águila", house: "Ravenclaw" },
                { text: "Tejón", house: "Hufflepuff" }
            ]
        },
        // ... agregar el resto de preguntas aquí como estaba antes
    ];
}

function fetchAndRenderHouses(listContainer, detailContainer) {
    const loading = document.createElement('p');
    loading.textContent = 'Cargando las casas de Hogwarts...';
    loading.className = 'loading-message';
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
        .catch(() => {
            loading.textContent = 'Error al cargar las casas.';
        });
}

// =======================
// INICIALIZACIÓN SEGÚN PÁGINA
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html') || path.endsWith('/')) {
        const btnQuiz = document.getElementById('start-quiz');
        const btnExplore = document.getElementById('explore-houses');

        btnQuiz?.addEventListener('click', () => window.location.href = 'quiz.html');
        btnExplore?.addEventListener('click', () => window.location.href = 'house.html');
    }

    if (path.includes('house.html')) {
        const list = document.getElementById('house-list');
        const detail = document.getElementById('house-detail');
        fetchAndRenderHouses(list, detail);
    }

    if (path.includes('quiz.html')) {
        const quizContainer = document.getElementById('quiz-content');
        new Quiz(quizContainer);
    }
});
