// ===== VARIABLES =====
let hintsUsed = 0;
let maxHints = 2;
let maxAttempts = 2;
let attemptsLeft = maxAttempts;
let currentWord = '';
let wordsData = {};
let gameOver = false;

let score = 0;
let highScore = 0;

// Store solved words for each level
let solvedWords = {};

// ===== DOM ELEMENTS =====
const wordDisplay = document.getElementById('wordDisplay');
const difficultySelect = document.getElementById('difficultySelect');
const questionsCountSpan = document.getElementById('questionsCount');
const questionsCategorySpan = document.getElementById('questionsCategory');
const messageDisplay = document.getElementById('messageDisplay');
const hintBtn = document.getElementById('hintBtn');
const hintsLeftSpan = document.getElementById('hintsLeft');
const letterInputContainer = document.getElementById('letterInput');
const checkBtn = document.getElementById('checkBtn');

// Add score display element
let scoreDisplay = document.createElement('p');
scoreDisplay.className = "text-white/80 mt-2 font-semibold";
scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
document.querySelector('aside').prepend(scoreDisplay);

// ===== FETCH JSON =====
fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    wordsData = data.levels;

    difficultySelect.innerHTML = '';
    for (let key in wordsData) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      difficultySelect.appendChild(option);
    }

    for (let key in wordsData) {
      solvedWords[key] = [];
    }

    difficultySelect.value = Object.keys(wordsData)[0];
    setLevel(difficultySelect.value);
  })
  .catch(err => console.error("Error loading JSON:", err));

// ===== FUNCTIONS =====
function setLevel(levelKey) {
  if (!wordsData[levelKey]) return;

  const wordArray = wordsData[levelKey].words;
  const remainingWords = wordArray.filter(w => !solvedWords[levelKey].includes(w.word.toLowerCase()));

  // Remove Next Level button if it exists
  const existingNextBtn = document.getElementById('nextLevelBtn');
  if (existingNextBtn) existingNextBtn.remove();

  if (remainingWords.length === 0) {
    messageDisplay.textContent = "You finished all words in this level";
    wordDisplay.textContent = "";

    const levelKeys = Object.keys(wordsData);
    const currentIndex = levelKeys.indexOf(levelKey);
    if (currentIndex < levelKeys.length - 1) {
      const nextBtn = document.createElement('button');
      nextBtn.id = "nextLevelBtn";
      nextBtn.textContent = "Next Level";
      nextBtn.className = "mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600";
      nextBtn.addEventListener('click', () => {
        const nextLevelKey = levelKeys[currentIndex + 1];
        difficultySelect.value = nextLevelKey;
        setLevel(nextLevelKey);
      });
      messageDisplay.insertAdjacentElement('afterend', nextBtn);
    }

    disableInputs();
    checkBtn.disabled = true;
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingWords.length);
  currentWord = remainingWords[randomIndex].word.toLowerCase();

  wordDisplay.textContent = "_ ".repeat(currentWord.length).trim();
  questionsCountSpan.textContent = wordArray.length;
  questionsCategorySpan.textContent = wordsData[levelKey].topic;

  hintsUsed = 0;
  attemptsLeft = maxAttempts;
  hintsLeftSpan.textContent = maxHints;
  messageDisplay.textContent = "";
  gameOver = false;

  createLetterInputs();
  enableAutoMove();

  checkBtn.textContent = "Check Word";
  checkBtn.disabled = false;
}

function createLetterInputs() {
  letterInputContainer.innerHTML = '';
  for (let i = 0; i < currentWord.length; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.disabled = gameOver;
    input.className =
      "w-12 h-12 text-center text-2xl sm:text-xl md:text-2xl font-bold rounded border border-white/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500";
    letterInputContainer.appendChild(input);
  }
}

function revealHint() {
  if (!currentWord || hintsUsed >= maxHints || gameOver) return;

  const levelKey = difficultySelect.value;
  const wordObj = wordsData[levelKey].words.find(w => w.word.toLowerCase() === currentWord);

  if (!wordObj || !wordObj.hints) return;

  messageDisplay.textContent = wordObj.hints[hintsUsed] || "No more hints available";

  hintsUsed++;
  hintsLeftSpan.textContent = maxHints - hintsUsed;
}

function checkWord() {
  if (gameOver) {
    setLevel(difficultySelect.value);
    return;
  }

  const inputs = document.querySelectorAll("#letterInput input");
  const guessedWord = Array.from(inputs).map(i => i.value.toLowerCase()).join("");
  inputBackgroundColor();

  if (!guessedWord) return;

  const levelKey = difficultySelect.value;

  if (guessedWord === currentWord) {
    messageDisplay.textContent = "Correct!";
    updateWordDisplay();

    score++;
    if(score > highScore) highScore = score;
    updateScoreDisplay();

    if (!solvedWords[levelKey].includes(currentWord)) {
      solvedWords[levelKey].push(currentWord);
    }

    setTimeout(() => setLevel(levelKey), 300);
  } else {
    attemptsLeft--;
    if (attemptsLeft > 0) {
      messageDisplay.textContent = `Wrong! Attempts left: ${attemptsLeft}`;
    } else {
      messageDisplay.textContent = `Game Over! The word was "${currentWord}"`;
      revealFullWord();
      gameOver = true;

      if(score > highScore) highScore = score;
      updateScoreDisplay();

      disableInputs();
      checkBtn.textContent = "New Word";
    }
  }
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function updateWordDisplay() {
  const inputs = document.querySelectorAll("#letterInput input");
  const letters = Array.from(inputs).map(i => i.value || "_");
  wordDisplay.textContent = letters.join(" ");
}

function revealFullWord() {
  const inputs = document.querySelectorAll("#letterInput input");
  inputs.forEach((input, i) => {
    input.value = currentWord[i];
  });
  updateWordDisplay();
  inputBackgroundColor();
}

function disableInputs() {
  const inputs = document.querySelectorAll("#letterInput input");
  inputs.forEach(input => input.disabled = true);
}

function enableAutoMove() {
  const inputs = document.querySelectorAll("#letterInput input");

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key === "Backspace") {
        let i = index - 1;
        while (i >= 0 && inputs[i].disabled) i--;
        if (i >= 0) inputs[i].focus();
        return;
      }

      if (key === "ArrowLeft") {
        let i = index - 1;
        while (i >= 0 && inputs[i].disabled) i--;
        if (i >= 0) inputs[i].focus();
        e.preventDefault();
      }

      if (key === "ArrowRight") {
        let i = index + 1;
        while (i < inputs.length && inputs[i].disabled) i++;
        if (i < inputs.length) inputs[i].focus();
        e.preventDefault();
      }

      if (key === "Enter") {
        e.preventDefault();
        checkBtn.click(); // Enter key triggers the same action as Check Word button
      }
    });

    input.addEventListener("input", () => {
      if (gameOver) return;

      let i = index + 1;
      while (i < inputs.length && inputs[i].disabled) i++;
      if (i < inputs.length && input.value.length === 1) {
        inputs[i].focus();
      }

      updateWordDisplay();
      inputBackgroundColor();
    });
  });
}

function inputBackgroundColor() {
  const inputs = document.querySelectorAll("#letterInput input");
  inputs.forEach((input, i) => {
    if (input.value.toLowerCase() === currentWord[i]) {
      input.style.backgroundColor = "#8b5cf6";
      input.disabled = true;
    } else if (input.value && currentWord.includes(input.value.toLowerCase())) {
      input.style.backgroundColor = "#06b6d4";
      input.disabled = false;
    } else {
      input.style.backgroundColor = "#1e293b";
      input.disabled = false;
    }
  });
}

// ===== EVENT LISTENERS =====
difficultySelect.addEventListener("change", () => {
  setLevel(difficultySelect.value);
});

hintBtn.addEventListener("click", revealHint);
checkBtn.addEventListener("click", checkWord);
