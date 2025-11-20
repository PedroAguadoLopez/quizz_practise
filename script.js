document.addEventListener("click", () => {
    const music = document.getElementById("music");
    music.muted = false;
});

let questions = [];

async function loadQuestions() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar las preguntas. Verifica que el archivo questions.json esté disponible.');
    }
}

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const resultTextEl = document.getElementById('result-text');
const nextBtn = document.getElementById('next-btn');
const finalScoreEl = document.getElementById('final-score');
const scoreTextEl = document.getElementById('score-text');
const restartBtn = document.getElementById('restart-btn');

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;
    optionsEl.innerHTML = '';
    resultEl.classList.add('hidden');
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsEl.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = optionsEl.querySelectorAll('button');
    
    buttons.forEach((button, index) => {
        if (index === currentQuestion.answer) {
            button.classList.add('correct');
        } else if (index === selectedIndex) {
            button.classList.add('incorrect');
        }
        button.disabled = true;
    });
    
    if (selectedIndex === currentQuestion.answer) {
        score++;
        resultTextEl.textContent = '¡Correcto!';
    } else {
        resultTextEl.textContent = 'Incorrecto. La respuesta correcta es: ' + currentQuestion.options[currentQuestion.answer];
    }
    
    resultEl.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showFinalScore();
    }
});

function showFinalScore() {
    document.getElementById('question-container').classList.add('hidden');
    resultEl.classList.add('hidden');
    scoreTextEl.textContent = `${score}/${questions.length} preguntas acertadas.`;
    finalScoreEl.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
    finalScoreEl.classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    startQuiz();
});

const audio = document.getElementById('music');
audio.volume = 0.1;

loadQuestions();