// Top-level script execution starts here
console.log("Kyros's Prophet Mechanism script loaded!");

// --- Global Variables ---
let currentLevel = 1;
// Seviye 1'e özel değişkenler (displayLevel içinde sıfırlanabilir)
let level1Passed = false;
let lastSymbolClicked = null;
// Seviye 2'ye özel değişkenler
let level2Attempts = 5;

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_ATTEMPTS_STORAGE_KEY = 'kyrosMechanismL2Attempts';

// --- DOM References (will be updated by displayLevel) ---
let mechanismDiv; // Ana container hep lazım

// --- Core Functions ---

function saveGame(level) {
    try {
        localStorage.setItem(LEVEL_STORAGE_KEY, level);
        console.log(`Game saved at level: ${level}`);
        // Seviye 2'ye özel deneme hakkını da kaydedelim (eğer seviye 2 ise)
        if (level === 2) {
            saveLevel2Attempts(level2Attempts);
        }
    } catch (e) {
        console.error("Could not save game state!", e);
        alert("Warning: Could not save game progress.");
    }
}

function saveLevel2Attempts(attempts) {
     try {
        localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts);
        console.log(`Level 2 attempts saved: ${attempts}`);
     } catch (e) { console.error("Could not save L2 attempts", e); }
}


function loadGame() {
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        if (savedLevel) {
            currentLevel = parseInt(savedLevel, 10);
            console.log(`Game loaded at level: ${currentLevel}`);
        } else {
            currentLevel = 1;
            console.log("No saved game found, starting at Level 1.");
        }

        // Seviye 2'ye özel deneme hakkını yükle (eğer seviye 2 ise)
        if (currentLevel === 2) {
             level2Attempts = loadLevel2Attempts();
        } else {
            level2Attempts = 5; // Diğer seviyelerde varsayılan
        }

        // Reset level-specific states based on loaded level
        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;

        displayLevel(currentLevel);
    } catch (e) {
        console.error("Could not load game state!", e);
        alert("Warning: Could not load saved game state. Starting from Level 1.");
        currentLevel = 1;
        displayLevel(currentLevel);
    }
}

function loadLevel2Attempts() {
     try {
        // Sadece gerçekten seviye 2 kaydedilmişse deneme hakkını yükle
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) {
             return 5; // Başka seviyedeysek veya kayıt yoksa, L2 denemesi 5'tir.
        }
        // Seviye 2 kayıtlıysa, deneme hakkını oku
        const savedAttempts = localStorage.getItem(L2_ATTEMPTS_STORAGE_KEY);
        if (savedAttempts === null) { // Daha önce hiç kaydedilmemişse
            return 5;
        }
        return parseInt(savedAttempts, 10); // Kayıtlı değeri döndür
     } catch (e) {
        console.error("Could not load L2 attempts", e);
        return 5; // Hata durumunda varsayılan
     }
}

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    mechanismDiv = document.getElementById('mechanism');
    if (!mechanismDiv) {
        console.error("Mechanism container div not found!");
        return;
    }
    mechanismDiv.innerHTML = ''; // Clear previous level content

    const mainTitle = document.querySelector('h1');
    if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;

    if (levelNumber === 1) {
        mechanismDiv.innerHTML = `
            <div id="mechanism-symbols">
                <button id="symbol-triangle">△</button>
                <button id="symbol-square">□</button>
                <button id="symbol-circle">○</button>
            </div>
            <div id="indicator"></div>
            <p>Level 1: Discover the primary functions.</p>
        `;
        attachLevel1Listeners();
        updateIndicator(''); // Reset L1 indicator

    } else if (levelNumber === 2) {
        level2Attempts = loadLevel2Attempts(); // Ensure we have the latest attempt count for display
        const targetWord = "REVROSYKCESI";
        const initialFeedback = (level2Attempts <= 0) ? '_ '.repeat(targetWord.length).trim() : calculateInitialFeedback(targetWord); // Load saved feedback? No, simpler to reset.

        mechanismDiv.innerHTML = `
            <h2>Level 2: Unscramble the Letters</h2>
            <p class="level2-instructions">Use the letters from KYROSERVICES (K, Y, R(2), O, S(2), E(2), V, I, C) to form the target 11-letter word.</p>
            <div class="available-letters">Available letters: C E E I K O R R S S V Y</div>
            <div id="level2-feedback">${initialFeedback}</div>
            <input type="text" id="level2-input" maxlength="11" placeholder="Enter your 11-letter guess...">
            <button id="level2-submit">Submit Guess</button>
            <p id="level2-message">
                Attempts remaining: <span id="level2-attempts">${level2Attempts}</span>
            </p>
        `;
        attachLevel2Listeners(targetWord); // Pass target word
        // Disable input if already failed
        if (level2Attempts <= 0) {
            document.getElementById('level2-input').disabled = true;
            document.getElementById('level2-submit').disabled = true;
            document.getElementById('level2-message').textContent += " No attempts remaining.";
             document.getElementById('level2-feedback').textContent = '_ '.repeat(targetWord.length).trim(); // Ensure feedback is reset if failed
        }

    } else {
        // Placeholder for Level 3 and beyond
         mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>`;
    }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    const triangleBtn = document.getElementById('symbol-triangle');
    const squareBtn = document.getElementById('symbol-square');
    const circleBtn = document.getElementById('symbol-circle');
    if (!triangleBtn || !squareBtn || !circleBtn) return;

    triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
    squareBtn.addEventListener('click', () => handleSymbolClick('square'));
    circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
}

function handleSymbolClick(symbol) {
     if (currentLevel !== 1) return; // Ensure correct level
     console.log(`${symbol} clicked`);

     let colorToSet = '';
     if (symbol === 'triangle') {
        colorToSet = 'red';
        lastSymbolClicked = 'triangle';
     } else if (symbol === 'square') {
         if (lastSymbolClicked === 'triangle') {
             colorToSet = 'green';
             lastSymbolClicked = null;
         } else {
             // Normal square click - Level 1 Pass Condition
             colorToSet = 'blue';
             if (!level1Passed) {
                 level1Passed = true;
                 console.log("Level 1 Pass Condition Met!");
                 updateIndicator(colorToSet); // Update color first
                 setTimeout(() => goToLevel(2), 500);
                 return; // Exit early
             }
             lastSymbolClicked = null;
         }
     } else if (symbol === 'circle') {
         colorToSet = ''; // Reset
         lastSymbolClicked = null;
     }
     updateIndicator(colorToSet);
}

function updateIndicator(color) {
    const indicatorEl = document.getElementById('indicator');
    if (indicatorEl) {
        indicatorEl.style.backgroundColor = color || '#ddd';
        console.log(`Indicator color set to: ${color || 'default(#ddd)'}`);
    }
}

// --- Level 2 Specific Functions ---
function attachLevel2Listeners(target) {
    const inputEl = document.getElementById('level2-input');
    const submitBtn = document.getElementById('level2-submit');
    if (!inputEl || !submitBtn) return;

    submitBtn.addEventListener('click', () => handleLevel2Submit(target));
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLevel2Submit(target);
        }
    });
}

function handleLevel2Submit(target) {
    const inputEl = document.getElementById('level2-input');
    const feedbackEl = document.getElementById('level2-feedback');
    const messageEl = document.getElementById('level2-message');
    const attemptsEl = document.getElementById('level2-attempts');
    const submitBtn = document.getElementById('level2-submit');

    if (!inputEl || level2Attempts <= 0) return; // Guard clause

    let guess = inputEl.value.toUpperCase().trim();
    messageEl.textContent = ''; // Clear previous messages

    if (guess.length !== target.length) {
        messageEl.textContent = `Guess must be ${target.length} letters long.`;
        return; // No attempt used for wrong length
    }

    // --- Optional: Anagram Validation (Check if guess uses correct letters) ---
    // This adds complexity, skipping for now based on user feedback simplicity
    // const sourceLetters = "KYROSERVICES".split('').sort().join('');
    // const guessLetters = guess.split('').sort().join('');
    // if (guessLetters !== sourceLetters) {
    //     messageEl.textContent = "Your guess uses incorrect letters or counts.";
    //     // Decide if this uses an attempt - let's say yes for now
    // }
    // --- End Optional Validation ---

    level2Attempts--;
    saveLevel2Attempts(level2Attempts); // Save remaining attempts
    attemptsEl.textContent = level2Attempts; // Update display

    let feedback = '';
    let correct = true;
    for (let i = 0; i < target.length; i++) {
        if (guess[i] === target[i]) {
            feedback += target[i] + ' ';
        } else {
            feedback += '_ ';
            correct = false;
        }
    }
    feedbackEl.textContent = feedback.trim();

    if (correct) {
        messageEl.textContent = "Correct!";
        inputEl.disabled = true;
        submitBtn.disabled = true;
        setTimeout(() => goToLevel(3), 1000); // Win!
        return;
    }

    if (level2Attempts <= 0) {
        messageEl.textContent = "Incorrect. No attempts remaining!";
        inputEl.disabled = true;
        submitBtn.disabled = true;
        // Reset feedback to underscores on final fail, as requested
        feedbackEl.textContent = '_ '.repeat(target.length).trim();
        return;
    }

    messageEl.textContent = "Incorrect, try again.";
    inputEl.value = ''; // Clear input
    inputEl.focus();
}

// --- Navigation ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    currentLevel = levelNumber;
    saveGame(currentLevel); // Saves level number and potentially L2 attempts
    displayLevel(currentLevel);
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
