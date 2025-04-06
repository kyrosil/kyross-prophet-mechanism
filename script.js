// Kyros's Prophet Mechanism - Final Script (April 6, 2025 - Reviewed)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false; // Tracks if Level 1 specific pass condition was met
let lastSymbolClicked = null; // State for Level 1 logic
let level2Attempts = 5; // State for Level 2 logic

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_ATTEMPTS_STORAGE_KEY = 'kyrosMechanismL2Attempts';

// --- DOM References ---
let mechanismDiv; // Main container reference

// --- Core Functions ---

function saveGame(level) {
    try {
        localStorage.setItem(LEVEL_STORAGE_KEY, level);
        console.log(`Game saved at level: ${level}`);
    } catch (e) {
        console.error("Could not save game level!", e);
    }
}

function saveLevel2Attempts(attempts) {
     try {
        // Only save attempts if the game is currently set to level 2
        if (parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10) === 2) {
            localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts);
            console.log(`Level 2 attempts saved: ${attempts}`);
        }
     } catch (e) {
        console.error("Could not save L2 attempts", e);
     }
}

function loadGame() {
    console.log("loadGame started...");
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found, starting at Level 1.");

        // Determine initial states based on the loaded level
        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null; // Always reset this on load
        level2Attempts = (currentLevel === 2) ? loadLevel2Attempts() : 5; // Load attempts specifically for L2 start

        displayLevel(currentLevel); // Display the loaded level

    } catch (e) {
        console.error("Could not load game state!", e);
        currentLevel = 1; // Fallback to level 1 on error
        // Attempt to display level 1 even if loading failed
        try { displayLevel(currentLevel); } catch (e2) { console.error("Fallback displayLevel failed!", e2); }
    }
}

function loadLevel2Attempts() {
     console.log("loadLevel2Attempts called");
     try {
        // Only load attempts if the game state *should* be level 2
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) {
            console.log("Not loading L2 attempts, saved level is not 2.");
            return 5; // Default attempts if not starting on level 2
        }
        // If saved level IS 2, try loading attempts
        const savedAttempts = localStorage.getItem(L2_ATTEMPTS_STORAGE_KEY);
        if (savedAttempts === null) {
            console.log("No saved L2 attempts found, defaulting to 5.");
            return 5; // Default if attempts were never saved for L2
        }
        const attempts = parseInt(savedAttempts, 10);
        console.log(`Loaded L2 attempts: ${attempts}`);
        // Ensure loaded attempts are not negative or invalid
        return (isNaN(attempts) || attempts < 0) ? 0 : attempts;
     } catch (e) {
        console.error("Could not load L2 attempts", e);
        return 5; // Default on error
     }
}


function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = ''; // Clear previous content

        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;

        let resetButtonHTML = (levelNumber > 1) ? `<p style="margin-top: 30px;"><button onclick="resetToLevel1()">Reset Progress to Level 1</button></p>` : '';

        if (levelNumber === 1) {
            console.log("Setting up Level 1 HTML...");
            mechanismDiv.innerHTML = `
                <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle">△</button>
                    <button id="symbol-square" title="Square">□</button>
                    <button id="symbol-circle" title="Circle">○</button>
                </div>
                <div id="indicator"></div>
                <p>Level 1: Discover the primary functions.</p>
            `; // Reset button intentionally omitted from Level 1 view
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            console.log("Setting up Level 2 HTML...");
            level2Attempts = loadLevel2Attempts(); // Load fresh attempt count for display
            const targetWord = "REVROSYKCESI";
            const sourceWordInfo = "KYROSERVICES (12 letters)";
            const availableLettersDisplay = "C, E(2), I, K, O, R(2), S(2), V, Y"; // Reminder letters (counts implied)
            const initialFeedback = '_ '.repeat(targetWord.length).trim(); // 12 underscores

            mechanismDiv.innerHTML = `
                <h2>Level 2: Find the Target Word</h2>
                <p class="level2-instructions">Use the letters from ${sourceWordInfo} to form the target 12-letter word.</p>
                <div class="available-letters">Available letters: ${availableLettersDisplay}</div>
                <div id="level2-feedback">${initialFeedback}</div>
                <input type="text" id="level2-input" maxlength="12" placeholder="Enter your 12-letter guess..." autocomplete="off" autocapitalize="characters" style="text-transform:uppercase">
                <button id="level2-submit">Submit Guess</button>
                <p id="level2-message">
                    Attempts remaining: <span id="level2-attempts">${level2Attempts}</span>
                </p>
                ${resetButtonHTML}
            `;
            attachLevel2Listeners(targetWord); // Attach listeners *after* innerHTML

            // Check if failed state should be applied immediately
            if (level2Attempts <= 0) {
                const inputEl = document.getElementById('level2-input');
                const submitBtn = document.getElementById('level2-submit');
                const messageEl = document.getElementById('level2-message');
                const feedbackEl = document.getElementById('level2-feedback');

                if(inputEl) inputEl.disabled = true;
                if(submitBtn) submitBtn.disabled = true;
                // Append message only if messageEl exists
                if(messageEl) {
                     // Check if message already contains "No attempts" to avoid duplicates on reload
                     if (!messageEl.textContent.includes("No attempts remaining")) {
                          messageEl.textContent += " No attempts remaining.";
                     }
                }
                // Ensure feedback is reset if loaded in failed state
                if(feedbackEl) feedbackEl.textContent = '_ '.repeat(targetWord.length).trim();
            }

        } else {
             // Placeholder for Level 3 and beyond
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>${resetButtonHTML}`;
        }
        console.log(`displayLevel for Level ${levelNumber} finished.`);
    } catch(error) {
         console.error("Error during displayLevel:", error);
         // Try to display an error message within the mechanism div
         if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Try resetting. Error: ${error.message}</p>${resetButtonHTML}`;
         else console.error("Cannot display error message, mechanismDiv is missing."); // Log fallback
    }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const triangleBtn = document.getElementById('symbol-triangle');
            const squareBtn = document.getElementById('symbol-square');
            const circleBtn = document.getElementById('symbol-circle');
            if (!triangleBtn || !squareBtn || !circleBtn) { console.error("Could not find Level 1 buttons INSIDE setTimeout!"); return; }
            console.log("Attaching Level 1 listeners...");
            triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
            squareBtn.addEventListener('click', () => handleSymbolClick('square'));
            circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
        } catch (error) { console.error("Error attaching L1 listeners:", error); }
    }, 0);
}

function handleSymbolClick(symbol) {
    if (currentLevel !== 1) return;
    console.log(`${symbol} clicked in Level 1`);
    try {
        let colorToSet = '';
        if (symbol === 'triangle') {
            colorToSet = 'red';
            lastSymbolClicked = 'triangle';
        } else if (symbol === 'square') {
            if (lastSymbolClicked === 'triangle') {
                colorToSet = 'green';
                lastSymbolClicked = null;
            } else {
                colorToSet = 'blue';
                updateIndicator(colorToSet); // Update color FIRST
                if (!level1Passed) {
                    level1Passed = true;
                    console.log("Level 1 Pass Condition Met (BLUE)!");
                    setTimeout(() => goToLevel(2), 500); // Go to next level
                    return; // Return after triggering level change
                }
                lastSymbolClicked = null;
            }
        } else if (symbol === 'circle') {
            colorToSet = '';
            lastSymbolClicked = null;
        }
        updateIndicator(colorToSet);
    } catch (error) { console.error("Error in handleSymbolClick:", error); }
}

function updateIndicator(color) {
    try {
        const indicatorEl = document.getElementById('indicator');
        if (indicatorEl) {
            indicatorEl.style.backgroundColor = color || '#ddd';
            console.log(`Indicator color set to: ${color || 'default(#ddd)'}`);
        }
    } catch (error) { console.error("Error updating indicator:", error); }
}

// --- Level 2 Specific Functions ---
function attachLevel2Listeners(target) {
    setTimeout(() => { // Apply setTimeout fix here too for safety
        try {
            const inputEl = document.getElementById('level2-input');
            const submitBtn = document.getElementById('level2-submit');
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error: Input or Submit button not found!"); return; }
            console.log("Attaching Level 2 listeners...");
            submitBtn.addEventListener('click', () => handleLevel2Submit(target));
            inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !submitBtn.disabled) { handleLevel2Submit(target); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2Submit(target) {
    console.log("handleLevel2Submit called");
    try {
        const inputEl = document.getElementById('level2-input');
        const feedbackEl = document.getElementById('level2-feedback');
        const messageEl = document.getElementById('level2-message');
        const attemptsEl = document.getElementById('level2-attempts');
        const submitBtn = document.getElementById('level2-submit');

        // Robust element check
        if (!inputEl || !feedbackEl || !messageEl || !attemptsEl || !submitBtn) {
             console.error("L2 Submit Error: One or more required elements missing!");
             if(messageEl) messageEl.textContent = "Interface error. Please Reset.";
             return;
        }
        // Check attempts before proceeding
        if (level2Attempts <= 0) { return; }

        let guess = inputEl.value.toUpperCase().trim();
        // Clear previous message if not the "no attempts" message
        if (!messageEl.textContent.includes("No attempts remaining")) {
            messageEl.textContent = '';
        }

        // Length check (12)
        if (guess.length !== target.length) {
            messageEl.textContent = `Guess must be ${target.length} letters long.`;
            return;
        }

        level2Attempts--;
        saveLevel2Attempts(level2Attempts);
        attemptsEl.textContent = level2Attempts; // Update display

        // Calculate and display feedback
        let feedback = '';
        let correct = true;
        for (let i = 0; i < target.length; i++) {
            if (guess[i] === target[i]) { feedback += target[i] + ' '; }
            else { feedback += '_ '; correct = false; }
        }
        feedbackEl.textContent = feedback.trim();

        // Check win condition
        if (correct) {
            console.log("Level 2 Correct!");
            messageEl.textContent = "Correct!";
            inputEl.disabled = true;
            submitBtn.disabled = true;
            setTimeout(() => goToLevel(3), 1000);
            return;
        }

        // Check fail condition
        if (level2Attempts <= 0) {
            console.log("Level 2 Failed - No attempts left.");
            messageEl.textContent = "Incorrect. No attempts remaining!";
            inputEl.disabled = true;
            submitBtn.disabled = true;
            feedbackEl.textContent = '_ '.repeat(target.length).trim(); // Reset feedback
            return;
        }

        // Incorrect but attempts remain
        console.log("Incorrect guess, attempts remaining.");
        messageEl.textContent = "Incorrect, try again.";
        inputEl.value = ''; // Clear input

    } catch(error) {
        console.error("Error during handleLevel2Submit:", error);
        try { // Try to show error message safely
             const messageEl = document.getElementById('level2-message');
             if (messageEl) messageEl.textContent = "Error processing guess: " + error.message;
        } catch (e) {}
    }
    console.log("handleLevel2Submit finished.");
}


// --- Navigation & Reset ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    // Restored alert
    alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    currentLevel = levelNumber;
    saveGame(currentLevel); // Save the *new* level number
    // Reset L2 attempts when moving *to* L2 (or maybe L3 needs reset too?)
    // Let's handle reset logic more cleanly within loadGame/displayLevel based on currentLevel
    displayLevel(currentLevel);
}

function resetToLevel1() {
    console.warn("Resetting progress to Level 1!");
    try {
        localStorage.removeItem(LEVEL_STORAGE_KEY);
        localStorage.removeItem(L2_ATTEMPTS_STORAGE_KEY);
        // No alert on success, just reload
        window.location.reload();
    } catch(e) {
        console.error("Error resetting progress:", e);
        alert("Error resetting progress: " + e.message);
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
