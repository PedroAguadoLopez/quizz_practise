function enableAudio() {
    const music = document.getElementById("music");
    if (music.paused) { 
        music.muted = false;
        music.volume = 0.3; 
        music.play().catch(error => {
            console.log("Audio play failed:", error);
        });
    }
    document.removeEventListener("click", enableAudio);
}

document.addEventListener("click", enableAudio); 

let allQuestions = [];
let questions = []; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadQuestions() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        allQuestions = await response.json();
        startQuiz();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar las preguntas. Verifica que el archivo data.json esté disponible.');
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
    shuffleArray(allQuestions);
    
    questions = allQuestions.slice(0, 10); 
    
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

loadQuestions();