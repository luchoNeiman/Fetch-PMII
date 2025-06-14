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
      <p>¡Felicitaciones! El Sombrero Seleccionador te ha asignado a <strong>${house}</strong>.</p>
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
        },
        {
            question: "¿Qué clase disfrutas más?",
            options: [
                { text: "Defensa Contra las Artes Oscuras", house: "Gryffindor" },
                { text: "Pociones", house: "Slytherin" },
                { text: "Encantamientos", house: "Ravenclaw" },
                { text: "Cuidado de Criaturas Mágicas", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Qué objeto mágico te gustaría tener?",
            options: [
                { text: "La espada de Godric Gryffindor", house: "Gryffindor" },
                { text: "El guardapelo de Slytherin", house: "Slytherin" },
                { text: "El diadema de Ravenclaw", house: "Ravenclaw" },
                { text: "La copa de Hufflepuff", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Cuál de estas cualidades te describe mejor?",
            options: [
                { text: "Coraje", house: "Gryffindor" },
                { text: "Ambición", house: "Slytherin" },
                { text: "Intelecto", house: "Ravenclaw" },
                { text: "Trabajo en equipo", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿A quién admiras más?",
            options: [
                { text: "Harry Potter", house: "Gryffindor" },
                { text: "Draco Malfoy", house: "Slytherin" },
                { text: "Luna Lovegood", house: "Ravenclaw" },
                { text: "Cedric Diggory", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Qué harías si ves a alguien haciendo trampa?",
            options: [
                { text: "Lo enfrento directamente", house: "Gryffindor" },
                { text: "Lo uso a mi favor", house: "Slytherin" },
                { text: "Analizo si vale la pena intervenir", house: "Ravenclaw" },
                { text: "Intento hablar con la persona en privado", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Cuál sería tu papel en una aventura?",
            options: [
                { text: "El líder valiente", house: "Gryffindor" },
                { text: "El estratega silencioso", house: "Slytherin" },
                { text: "El sabio consejero", house: "Ravenclaw" },
                { text: "El compañero leal", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Qué criatura mágica te atrae más?",
            options: [
                { text: "Hipogrifo", house: "Gryffindor" },
                { text: "Basilisco", house: "Slytherin" },
                { text: "Fénix", house: "Ravenclaw" },
                { text: "Niffler", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Cómo reaccionás ante un conflicto?",
            options: [
                { text: "Confrontando sin miedo", house: "Gryffindor" },
                { text: "Manipulando la situación a mi favor", house: "Slytherin" },
                { text: "Evaluando todas las opciones posibles", house: "Ravenclaw" },
                { text: "Mediando para buscar la armonía", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Qué tipo de amigos preferís?",
            options: [
                { text: "Leales y valientes", house: "Gryffindor" },
                { text: "Influyentes y decididos", house: "Slytherin" },
                { text: "Inteligentes y creativos", house: "Ravenclaw" },
                { text: "Solidarios y humildes", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Qué harías si ves a un amigo en peligro?",
            options: [
                { text: "Actuaría de inmediato para ayudar", house: "Gryffindor" },
                { text: "Buscaría una solución astuta", house: "Slytherin" },
                { text: "Analizaría el riesgo primero", house: "Ravenclaw" },
                { text: "Lo acompañaría sin dudar", house: "Hufflepuff" }
            ]
        },
        {
            question: "¿Cuál sería tu actividad favorita en Hogwarts?",
            options: [
                { text: "Participar en el Torneo de los Tres Magos", house: "Gryffindor" },
                { text: "Explorar secretos del castillo", house: "Slytherin" },
                { text: "Estudiar en la biblioteca", house: "Ravenclaw" },
                { text: "Ayudar a tus compañeros", house: "Hufflepuff" }
            ]
        }
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

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2000); // Espera 2 segundos antes de quitar el loader
});