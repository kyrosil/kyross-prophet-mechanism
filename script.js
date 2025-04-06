// Kyros's Prophet Mechanism - Final Integrated Script (Level 1 + 3-Question Level 2) - April 6, 2025

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false; // Specific state for level 1 logic
let lastSymbolClicked = null; // State for level 1 logic
let level2QuestionNumber = 1; // Track current question within level 2 (1, 2, or 3)

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_QUESTION_STORAGE_KEY = 'kyrosMechanismL2Question'; // Key for saving current question number

// --- DOM References ---
let mechanismDiv; // Main container reference

// --- Core Functions ---

function saveGame(level) {
    try {
        localStorage.setItem(LEVEL_STORAGE_KEY, level);
        console.log(`Game saved at level: ${level}`);
        // Save L2 Question state ONLY if saving Level 2
        if (level === 2) {
            saveLevel2QuestionNumber(level2QuestionNumber);
        } else {
            // If saving Level 1 or other levels, clear potentially stale L2 question state
            localStorage.removeItem(L2_QUESTION_STORAGE_KEY);
        }
    } catch (e) {
        console.error("Could not save game level!", e);
    }
}

function saveLevel2QuestionNumber(qNum) {
     try {
        // Ensure we only save if the main level state is also Level 2
        const currentSavedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (currentSavedLevel === 2) {
            localStorage.setItem(L2_QUESTION_STORAGE_KEY, qNum);
            console.log(`Level 2 Question number saved: ${qNum}`);
        } else {
            console.warn("Attempted to save L2 question number while not on Level 2.");
        }
     } catch (e) {
        console.error("Could not save L2 question number", e);
     }
}

function loadGame() {
    console.log("loadGame started...");
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found, starting at Level 1.");

        // Load Level 2 question number ONLY if starting on level 2
        level2QuestionNumber = (currentLevel === 2) ? loadLevel2QuestionNumber() : 1;
        // Reset other states
        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;

        displayLevel(currentLevel); // Display the determined level

    } catch (e) {
        console.error("Could not load game state!", e);
        currentLevel = 1; // Fallback to level 1
        level2QuestionNumber = 1; // Reset L2 state on error too
        displayLevel(currentLevel);
    }
}

function loadLevel2QuestionNumber() {
     console.log("loadLevel2QuestionNumber called");
     try {
        // This function is only called if currentLevel is 2, so no need to check again
        const savedQNum = localStorage.getItem(L2_QUESTION_STORAGE_KEY);
        if (savedQNum === null) {
            console.log("No saved L2 question, returning Q1.");
            return 1; // Default to Q1 if not found
        }
        const qNum = parseInt(savedQNum, 10);
        console.log(`Loaded L2 question number: ${qNum}`);
        // Validate loaded number (must be 1, 2, or 3)
        return (isNaN(qNum) || qNum < 1 || qNum > 3) ? 1 : qNum;
     } catch (e) {
        console.error("Could not load L2 question number", e);
        return 1; // Default on error
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

        // Add reset button only for Level 2 and beyond
        let resetButtonHTML = (levelNumber > 1) ? `<p style="margin-top: 30px;"><button onclick="resetToLevel1()">Reset Progress to Level 1</button></p>` : '';

        if (levelNumber === 1) {
            // --- Display Level 1 (Known Stable Code) ---
            console.log("Setting up Level 1 HTML...");
            mechanismDiv.innerHTML = `
                <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle">△</button>
                    <button id="symbol-square" title="Square">□</button>
                    <button id="symbol-circle" title="Circle">○</button>
                </div>
                <div id="indicator"></div>
                <p>Level 1: Discover the primary functions.</p>
                ${resetButtonHTML} `;
            attachLevel1Listeners(); // Attach L1 listeners
            updateIndicator(''); // Set initial L1 state

        } else if (levelNumber === 2) {
            // --- Display Level 2 (3-Question Logic) ---
            console.log("Setting up Level 2 HTML...");
            level2QuestionNumber = loadLevel2QuestionNumber(); // Ensure we display the correct question

            let questionText = "";
            // Determine which question to display
            if (level2QuestionNumber === 1) {
                questionText = "Q1: Who is the main sponsor of Kyrosil?";
            } else if (level2QuestionNumber === 2) {
                questionText = "Q2: Who is the latest sponsor of Kyrosil?";
            } else if (level2QuestionNumber === 3) {
                questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & THY) belong to?";
            } else {
                 // Should ideally not happen if load/save logic is correct
                 console.error("Invalid L2 question number state:", level2QuestionNumber, "Resetting to Q1.");
                 level2QuestionNumber = 1; // Reset state
                 saveLevel2QuestionNumber(1); // Save reset state
                 questionText = "Q1: Who is the main sponsor of Kyrosil?"; // Show Q1
            }

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                ${resetButtonHTML} `;
            // Attach listeners for Level 2 input/button
            attachLevel2AnswerListeners();

        } else {
             // --- Placeholder for Level 3 and beyond ---
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>${resetButtonHTML}`;
        }
        console.log(`displayLevel for Level ${levelNumber} finished.`);
    } catch(error) {
         console.error("Error during displayLevel:", error);
         if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Try resetting.</p>${resetButtonHTML || ''}`;
    }
}

// --- Level 1 Specific Functions (Stable Version) ---
function attachLevel1Listeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const triangleBtn = document.getElementById('symbol-triangle');
            const squareBtn = document.getElementById('symbol-square');
            const circleBtn = document.getElementById('symbol-circle');
            if (!triangleBtn || !squareBtn || !circleBtn) { console.error("Could not find L1 buttons!"); return; }
            console.log("Attaching L1 listeners...");
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
            colorToSet = 'red'; lastSymbolClicked = 'triangle'; updateIndicator(colorToSet);
        } else if (symbol === 'square') {
            if (lastSymbolClicked === 'triangle') { // Green path
                colorToSet = 'green'; lastSymbolClicked = null; updateIndicator(colorToSet);
            } else { // Blue path (Level Pass)
                colorToSet = 'blue'; updateIndicator(colorToSet); // Update color FIRST
                if (!level1Passed) {
                    level1Passed = true; console.log("Level 1 Pass Condition Met (BLUE)!");
                    setTimeout(() => goToLevel(2), 500); // Trigger level change
                }
                lastSymbolClicked = null; // Reset sequence state regardless
            }
        } else if (symbol === 'circle') {
            colorToSet = ''; lastSymbolClicked = null; updateIndicator(colorToSet);
        }
    } catch (error) { console.error("Error in handleSymbolClick:", error); }
}

function updateIndicator(color) {
    try {
        const indicatorEl = document.getElementById('indicator');
        if (indicatorEl) { indicatorEl.style.backgroundColor = color || '#ddd'; console.log(`Indicator color set to: ${color || 'default(#ddd)'}`); }
    } catch (error) { console.error("Error updating indicator:", error); }
}

// --- Level 2 Specific Functions (3-Question Logic, Reset on Fail) ---
function attachLevel2AnswerListeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const inputEl = document.getElementById('level2-answer-input');
            const submitBtn = document.getElementById('level2-answer-submit');
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error: Input or Submit button not found!"); return; }
            console.log("Attaching L2 Answer listeners...");
            // Prevent duplicate listeners if displayLevel was called multiple times quickly
            submitBtn.replaceWith(submitBtn.cloneNode(true)); // Simple way to remove old listeners
            inputEl.replaceWith(inputEl.cloneNode(true));
            // Re-select after cloning
            const newSubmitBtn = document.getElementById('level2-answer-submit');
            const newInputEl = document.getElementById('level2-answer-input');
            if (!newInputEl || !newSubmitBtn) { console.error("L2 Listener Error: Cloned elements not found!"); return; }

            newSubmitBtn.addEventListener('click', handleLevel2AnswerSubmit);
            newInputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !newSubmitBtn.disabled) { handleLevel2AnswerSubmit(); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called");
    try {
        const inputEl = document.getElementById('level2-answer-input');
        const messageEl = document.getElementById('level2-message');
        const submitBtn = document.getElementById('level2-answer-submit');

        if (!inputEl || !messageEl || !submitBtn || submitBtn.disabled) { return; } // Basic checks

        let answer = inputEl.value.trim().toUpperCase();
        messageEl.textContent = '';

        if (!answer) { messageEl.textContent = "Please enter an answer."; return; }

        let correctAnswers = [];
        let currentQ = level2QuestionNumber;

        // Define answers
        if (currentQ === 1) { correctAnswers = ["SWISS AIR", "SWISSAIR"]; }
        else if (currentQ === 2) { correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"]; }
        else if (currentQ === 3) { correctAnswers = ["STAR ALLIANCE"]; }
        else { console.error("Invalid question number:", currentQ); return; }

        // Disable button briefly to prevent multiple submissions
        submitBtn.disabled = true;
        inputEl.disabled = true;

        if (correctAnswers.includes(answer)) {
            // CORRECT
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++;
            saveLevel2QuestionNumber(level2QuestionNumber);

            if (level2QuestionNumber > 3) { // Passed Level 2
                console.log("Level 2 Passed!");
                messageEl.textContent = "Correct! Level 2 completed!";
                setTimeout(() => goToLevel(3), 1500);
            } else { // Go to next question
                console.log(`Moving to Q${level2QuestionNumber}`);
                messageEl.textContent = `Correct! Moving to question ${level2QuestionNumber}...`;
                setTimeout(() => displayLevel(2), 1500); // Reload L2 display for next Q
            }
        } else {
            // INCORRECT - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1; // Reset state to Q1
            saveLevel2QuestionNumber(level2QuestionNumber); // Save reset state
            messageEl.textContent = "Incorrect! Returning to the first question...";
            // Reload L2 display to show Q1 again after delay
            setTimeout(() => displayLevel(2), 2000);
             // Future: Deduct daily attempt logic would go here
        }

    } catch(error) {
        console.error("Error during handleLevel2AnswerSubmit:", error);
        if(messageEl) messageEl.textContent = "Error processing answer.";
        // Re-enable button/input on error? Maybe not if state is uncertain. Reset might be safer.
         const submitBtn = document.getElementById('level2-answer-submit');
         const inputEl = document.getElementById('level2-answer-input');
         if(submitBtn) submitBtn.disabled = false; // Try to re-enable on error
         if(inputEl) inputEl.disabled = false;
    }
}


// --- Navigation & Reset ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`); // Restored alert
    currentLevel = levelNumber;
    // Reset L2 question number when explicitly moving *to* a level higher than 1
    if (levelNumber > 1) {
        level2QuestionNumber = 1; // Start L2 (or higher potentially) from Q1
        saveLevel2QuestionNumber(1); // Save this reset state if going to L2
    }
    saveGame(currentLevel); // Save the main level number
    displayLevel(currentLevel);
}

function resetToLevel1() {
    console.warn("Resetting progress to Level 1!");
    try {
        localStorage.removeItem(LEVEL_STORAGE_KEY);
        localStorage.removeItem(L2_QUESTION_STORAGE_KEY); // Remove L2 question state too
        window.location.reload();
    } catch(e) { console.error("Error resetting progress:", e); alert("Error resetting progress: " + e.message); }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
