// Kyros's Prophet Mechanism - Main Script (Corrected for 12 Letters - Final Attempt)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2Attempts = 5;

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_ATTEMPTS_STORAGE_KEY = 'kyrosMechanismL2Attempts';

// --- DOM References ---
let mechanismDiv;

// --- Core Functions ---

function saveGame(level) {
    try {
        localStorage.setItem(LEVEL_STORAGE_KEY, level);
        console.log(`Game saved at level: ${level}`);
    } catch (e) { console.error("Could not save game level!", e); }
}

function saveLevel2Attempts(attempts) {
     try {
        if (currentLevel === 2) {
            localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts);
            console.log(`Level 2 attempts saved: ${attempts}`);
        }
     } catch (e) { console.error("Could not save L2 attempts", e); }
}

function loadGame() {
    console.log("loadGame started...");
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found, starting at Level 1.");

        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;
        level2Attempts = (currentLevel === 2) ? loadLevel2Attempts() : 5;

        displayLevel(currentLevel);
    } catch (e) {
        console.error("Could not load game state!", e);
        currentLevel = 1;
        displayLevel(currentLevel); // Fallback
    }
}

function loadLevel2Attempts() {
     try {
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) return 5;
        const savedAttempts = localStorage.getItem(L2_ATTEMPTS_STORAGE_KEY);
        if (savedAttempts === null) return 5;
        const attempts = parseInt(savedAttempts, 10);
        console.log(`Loaded L2 attempts: ${attempts}`);
        return attempts;
     } catch (e) {
        console.error("Could not load L2 attempts", e);
        return 5;
     }
}

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = ''; // Clear

        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;

        let resetButtonHTML = (levelNumber > 1) ? `<p style="margin-top: 30px;"><button onclick="resetToLevel1()">Reset Progress to Level 1</button></p>` : '';

        if (levelNumber === 1) {
            console.log("Setting up Level 1 HTML and listeners...");
            mechanismDiv.innerHTML = `
                <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle">△</button>
                    <button id="symbol-square" title="Square">□</button>
                    <button id="symbol-circle" title="Circle">○</button>
                </div>
                <div id="indicator"></div>
                <p>Level 1: Discover the primary functions.</p>
            `; // Reset butonu Seviye 1'de yok
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            console.log("Setting up Level 2 HTML and listeners...");
            level2Attempts = loadLevel2Attempts(); // Load attempts again here to be safe
            const targetWord = "REVROSYKCESI"; // Correct 12-letter target
            const sourceWordInfo = "KYROSERVICES (12 letters: K,Y,R(2),O,S(2),E(2),V,I,C)"; // Updated info
            const availableLettersDisplay = "C, E(2), I, K, O, R(2), S(2), V, Y"; // Reminder letters

            const initialFeedback = '_ '.repeat(targetWord.length).trim(); // Uses 12 correctly

            mechanismDiv.innerHTML = `
                <h2>Level 2: Find the Target Word</h2>
                <p class="level2-instructions">Use the letters from ${sourceWordInfo} to form the target 12-letter word.</p>
                <div class="available-letters">Available letters: ${availableLettersDisplay}</div>
                <div id="level2-feedback">${initialFeedback}</div>
                <input type="text" id="level2-input" maxlength="12" placeholder="Enter your 12-letter guess..." autocomplete="off" autocapitalize="characters" style="text-transform:uppercase"> <button id="level2-submit">Submit Guess</button>
                <p id="level2-message">
                    Attempts remaining: <span id="level2-attempts">${level2Attempts}</span>
                </p>
                ${resetButtonHTML} `;
            attachLevel2Listeners(targetWord); // Pass 12-letter target

            // Disable inputs if already failed on load
            if (level2Attempts <= 0) {
                const inputEl = document.getElementById('level2-input');
                const submitBtn = document.getElementById('level2-submit');
                const messageEl = document.getElementById('level2-message');
                const feedbackEl = document.getElementById('level2-feedback');

                if(inputEl) inputEl.disabled = true;
                if(submitBtn) submitBtn.disabled = true;
                if(messageEl) messageEl.textContent += " No attempts remaining.";
                if(feedbackEl) feedbackEl.textContent = '_ '.repeat(targetWord.length).trim(); // Uses 12 correctly
            }

        } else {
             // Placeholder for Level 3 and beyond
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>${resetButtonHTML}`;
        }
    } catch(error) {
         console.error("Error during displayLevel:", error);
         mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Please try resetting.</p>${resetButtonHTML}`;
    }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    // Use setTimeout to ensure DOM is updated after innerHTML
    setTimeout(() => {
        const triangleBtn = document.getElementById('symbol-triangle');
        const squareBtn = document.getElementById('symbol-square');
        const circleBtn = document.getElementById('symbol-circle');
        if (!triangleBtn || !squareBtn || !circleBtn) { console.error("Could not find Level 1 buttons INSIDE setTimeout!"); return; }
        console.log("Attaching Level 1 listeners inside setTimeout...");
        triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
        squareBtn.addEventListener('click', () => handleSymbolClick('square'));
        circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
    }, 0);
}

function handleSymbolClick(symbol) {
    if (currentLevel !== 1) return;
    console.log(`${symbol} clicked in Level 1`);

    let colorToSet = '';
    if (symbol === 'triangle') {
        colorToSet = 'red';
        lastSymbolClicked = 'triangle';
        updateIndicator(colorToSet);
    } else if (symbol === 'square') {
        if (lastSymbolClicked === 'triangle') {
            colorToSet = 'green';
            lastSymbolClicked = null;
            updateIndicator(colorToSet);
        } else {
            colorToSet = 'blue';
            updateIndicator(colorToSet); // Update color FIRST
            if (!level1Passed) {
                level1Passed = true;
                console.log("Level 1 Pass Condition Met (BLUE)!");
                setTimeout(() => goToLevel(2), 500); // Go to next level
            }
            lastSymbolClicked = null;
        }
    } else if (symbol === 'circle') {
        colorToSet = '';
        lastSymbolClicked = null;
        updateIndicator(colorToSet);
    }
}

function updateIndicator(color) {
    const indicatorEl = document.getElementById('indicator');
    if (indicatorEl) {
        indicatorEl.style.backgroundColor = color || '#ddd';
        console.log(`Indicator color set to: ${color || 'default(#ddd)'}`);
    }
}

// --- Level 2 Specific Functions ---
function attachLevel2Listeners(target) { // Target is 12 letters
    try {
        const inputEl = document.getElementById('level2-input');
        const submitBtn = document.getElementById('level2-submit');
        if (!inputEl || !submitBtn) { console.error("Could not find L2 elements for listeners."); return; }
        console.log("Attaching Level 2 listeners...");
        submitBtn.addEventListener('click', () => handleLevel2Submit(target));
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !submitBtn.disabled) { handleLevel2Submit(target); }
        });
    } catch(error) { console.error("Error attaching L2 listeners", error); }
}

function handleLevel2Submit(target) { // Target is 12 letters
    try {
        const inputEl = document.getElementById('level2-input');
        const feedbackEl = document.getElementById('level2-feedback');
        const messageEl = document.getElementById('level2-message');
        const attemptsEl = document.getElementById('level2-attempts');
        const submitBtn = document.getElementById('level2-submit');

        if (!inputEl || !feedbackEl || !messageEl || !attemptsEl || !submitBtn || level2Attempts <= 0) { return; }

        let guess = inputEl.value.toUpperCase().trim();
        // Clear message only if it's not the 'no attempts' message
        if (level2Attempts > 0) messageEl.textContent = '';


        // ***** UZUNLUK KONTROLÜ (12 HARF) *****
        if (guess.length !== target.length) { // target.length is now 12
            messageEl.textContent = `Guess must be ${target.length} letters long.`; // Correctly says 12
            inputEl.focus();
            return; // No attempt used
        }

        // Use an attempt
        level2Attempts--;
        saveLevel2Attempts(level2Attempts); // Save remaining attempts
        if(attemptsEl) attemptsEl.textContent = level2Attempts;

        let feedback = '';
        let correct = true;
        for (let i = 0; i < target.length; i++) { // Iterates 12 times
            if (guess[i] === target[i]) {
                feedback += target[i] + ' ';
            } else {
                feedback += '_ ';
                correct = false;
            }
        }
        if(feedbackEl) feedbackEl.textContent = feedback.trim();

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
            if(feedbackEl) feedbackEl.textContent = '_ '.repeat(target.length).trim(); // Reset feedback on final fail
            return;
        }

        messageEl.textContent = "Incorrect, try again.";
        inputEl.value = '';
        inputEl.focus();

    } catch(error) {
        console.error("Error during handleLevel2Submit:", error);
        if(messageEl) messageEl.textContent = "Error processing guess.";
    }
}

// --- Navigation & Reset ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    // Using console.log instead of alert for smoother transition
    console.log(`Congratulations! Level ${passedLevel} Passed! Moving to Level ${levelNumber}...`);
    // alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    currentLevel = levelNumber;
    saveGame(currentLevel);
    displayLevel(currentLevel);
}

function resetToLevel1() {
    console.warn("Resetting progress to Level 1!");
    try {
        // Bypassing confirm for simplicity now
        localStorage.removeItem(LEVEL_STORAGE_KEY);
        localStorage.removeItem(L2_ATTEMPTS_STORAGE_KEY);
        // alert("Progress reset. Reloading page...");
        window.location.reload();
    } catch(e) {
        console.error("Error resetting progress:", e);
        alert("Error resetting progress: " + e.message); // Keep alert for reset error
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
