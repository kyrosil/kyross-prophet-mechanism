// Kyros's Prophet Mechanism - Final Script (3-Question Level 2, Reset on Fail)

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
        // If saving level 2, also save the current question number within it
        if (level === 2) {
            saveLevel2QuestionNumber(level2QuestionNumber);
        }
    } catch (e) { console.error("Could not save game level!", e); }
}

function saveLevel2QuestionNumber(qNum) {
     try {
        // Only save if current level is indeed 2
        const currentSavedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (currentSavedLevel === 2) {
            localStorage.setItem(L2_QUESTION_STORAGE_KEY, qNum);
            console.log(`Level 2 Question number saved: ${qNum}`);
        }
     } catch (e) { console.error("Could not save L2 question number", e); }
}

function loadGame() {
    console.log("loadGame started...");
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found.");

        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;
        level2QuestionNumber = (currentLevel === 2) ? loadLevel2QuestionNumber() : 1; // Load Q# only if starting on L2

        displayLevel(currentLevel);
    } catch (e) { console.error("Could not load game state!", e); currentLevel = 1; displayLevel(currentLevel); }
}

function loadLevel2QuestionNumber() {
     console.log("loadLevel2QuestionNumber called");
     try {
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) { console.log("Not Level 2, returning Q1."); return 1; }

        const savedQNum = localStorage.getItem(L2_QUESTION_STORAGE_KEY);
        if (savedQNum === null) { console.log("No saved L2 question, returning Q1."); return 1; }

        const qNum = parseInt(savedQNum, 10);
        console.log(`Loaded L2 question number: ${qNum}`);
        return (isNaN(qNum) || qNum < 1 || qNum > 3) ? 1 : qNum; // Validate loaded number (1, 2, or 3)
     } catch (e) { console.error("Could not load L2 question number", e); return 1; }
}


function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = '';

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
            `;
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            console.log("Setting up Level 2 HTML...");
            // Load current question number *within* level 2
            level2QuestionNumber = loadLevel2QuestionNumber();

            let questionText = "";
            // Determine which question to display based on loaded state
            if (level2QuestionNumber === 1) {
                questionText = "Q1: Who is the main sponsor of Kyrosil?";
            } else if (level2QuestionNumber === 2) {
                questionText = "Q2: Who is the latest sponsor of Kyrosil?";
            } else if (level2QuestionNumber === 3) {
                questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & THY) belong to?";
            } else {
                // Should not happen, maybe level passed but not transitioned? Fallback.
                 console.error("Invalid L2 question number state:", level2QuestionNumber);
                 questionText = "Error loading question. Please Reset.";
            }

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                ${resetButtonHTML}
            `;
            // Attach listeners for the input/button
            attachLevel2AnswerListeners();

        } else {
             // Placeholder for Level 3 and beyond
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>${resetButtonHTML}`;
        }
    } catch(error) { console.error("Error during displayLevel:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red;">Error loading level! Try resetting.</p>${resetButtonHTML}`; }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() { /* ... Önceki çalışan kod ... */ }
function handleSymbolClick(symbol) { /* ... Önceki çalışan kod ... */ }
function updateIndicator(color) { /* ... Önceki çalışan kod ... */ }

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const inputEl = document.getElementById('level2-answer-input');
            const submitBtn = document.getElementById('level2-answer-submit');
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error: Input or Submit button not found!"); return; }
            console.log("Attaching L2 Answer listeners...");
            submitBtn.addEventListener('click', handleLevel2AnswerSubmit);
            inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') { handleLevel2AnswerSubmit(); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called");
    try {
        const inputEl = document.getElementById('level2-answer-input');
        const messageEl = document.getElementById('level2-message');
        const submitBtn = document.getElementById('level2-answer-submit'); // To disable briefly

        if (!inputEl || !messageEl || !submitBtn || submitBtn.disabled) { return; } // Element check & prevent double click

        let answer = inputEl.value.trim().toUpperCase(); // Get and normalize answer
        messageEl.textContent = ''; // Clear previous message

        if (!answer) { messageEl.textContent = "Please enter an answer."; return; }

        let correctAnswers = [];
        let currentQ = level2QuestionNumber; // Use current state loaded by displayLevel

        // Define correct answers for the current question
        if (currentQ === 1) { correctAnswers = ["SWISS AIR", "SWISSAIR"]; }
        else if (currentQ === 2) { correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"]; }
        else if (currentQ === 3) { correctAnswers = ["STAR ALLIANCE"]; }
        else { console.error("Invalid question number in submit handler:", currentQ); return; }

        // Disable button briefly to prevent multiple submissions
        submitBtn.disabled = true;
        inputEl.disabled = true;

        // Check answer
        if (correctAnswers.includes(answer)) {
            // CORRECT ANSWER
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++; // Move state to next question index
            saveLevel2QuestionNumber(level2QuestionNumber); // Save progress within L2

            if (level2QuestionNumber > 3) {
                // Passed Level 2
                console.log("Level 2 Passed!");
                messageEl.textContent = "Correct! Level 2 completed!";
                setTimeout(() => goToLevel(3), 1500); // Go to L3 after delay
            } else {
                // Go to next question within Level 2
                console.log(`Moving to Q${level2QuestionNumber}`);
                messageEl.textContent = `Correct! Moving to question ${level2QuestionNumber}...`;
                // Reload Level 2 display to show the next question after delay
                setTimeout(() => displayLevel(2), 1500);
            }
        } else {
            // INCORRECT ANSWER - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1; // Reset state to first question
            saveLevel2QuestionNumber(level2QuestionNumber); // Save reset state
            messageEl.textContent = "Incorrect! Returning to the first question...";
             // Future: Deduct daily attempt here
            // Reload Level 2 display to show Question 1 again after delay
            setTimeout(() => {
                 displayLevel(2);
                 // Ensure elements are re-enabled if displayLevel doesn't implicitly do it
                 const newInputEl = document.getElementById('level2-answer-input');
                 const newSubmitBtn = document.getElementById('level2-answer-submit');
                 if(newInputEl) newInputEl.disabled = false;
                 if(newSubmitBtn) newSubmitBtn.disabled = false;
            }, 2000); // Longer delay for incorrect message
        }

    } catch(error) {
        console.error("Error during handleLevel2AnswerSubmit:", error);
        if(messageEl) messageEl.textContent = "Error processing answer.";
        // Re-enable button if error occurred?
         const submitBtn = document.getElementById('level2-answer-submit');
         const inputEl = document.getElementById('level2-answer-input');
         if(submitBtn) submitBtn.disabled = false;
         if(inputEl) inputEl.disabled = false;
    }
}

// --- Navigation & Reset ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`); // Restored alert
    currentLevel = levelNumber;
    saveGame(currentLevel);
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
