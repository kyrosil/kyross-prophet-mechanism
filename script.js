// Kyros's Prophet Mechanism - Final Script (Swapped Q1/Q2 Answers)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2QuestionNumber = 1;

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_QUESTION_STORAGE_KEY = 'kyrosMechanismL2Question';

// --- DOM References ---
let mechanismDiv;

// --- Core Functions ---

function saveGame(level) {
    try { localStorage.setItem(LEVEL_STORAGE_KEY, level); console.log(`Game saved at level: ${level}`);
        if (level === 2) { saveLevel2QuestionNumber(level2QuestionNumber); }
        else { localStorage.removeItem(L2_QUESTION_STORAGE_KEY); } // Clear L2 Q state if not on L2
    } catch (e) { console.error("Could not save game level!", e); }
}

function saveLevel2QuestionNumber(qNum) {
     try {
        const currentSavedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (currentSavedLevel === 2) { localStorage.setItem(L2_QUESTION_STORAGE_KEY, qNum); console.log(`Level 2 Question number saved: ${qNum}`); }
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
        level2QuestionNumber = (currentLevel === 2) ? loadLevel2QuestionNumber() : 1;
        displayLevel(currentLevel);
    } catch (e) { console.error("Could not load game state!", e); currentLevel = 1; level2QuestionNumber = 1; displayLevel(currentLevel); }
}

function loadLevel2QuestionNumber() {
     console.log("loadLevel2QuestionNumber called");
     try {
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) return 1;
        const savedQNum = localStorage.getItem(L2_QUESTION_STORAGE_KEY);
        if (savedQNum === null) return 1;
        const qNum = parseInt(savedQNum, 10); console.log(`Loaded L2 question number: ${qNum}`);
        return (isNaN(qNum) || qNum < 1 || qNum > 3) ? 1 : qNum;
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
            mechanismDiv.innerHTML = `...`; // Seviye 1 HTML (değişmedi)
            attachLevel1Listeners(); updateIndicator('');
        } else if (levelNumber === 2) {
            console.log("Setting up Level 2 HTML...");
            level2QuestionNumber = loadLevel2QuestionNumber();
            let questionText = "";
            if (level2QuestionNumber === 1) { questionText = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionText = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & THY) belong to?"; }
            else { questionText = "Error: Invalid question state."; level2QuestionNumber = 1; saveLevel2QuestionNumber(1); } // Reset state if invalid

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                ${resetButtonHTML}
            `; // Input maxlength kaldırıldı, JS kontrol edecek
            attachLevel2AnswerListeners();

        } else {
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>${resetButtonHTML}`;
        }
    } catch(error) { console.error("Error during displayLevel:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red;">Error loading level! Try resetting.</p>${resetButtonHTML || ''}`; }
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
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error!"); return; }
            console.log("Attaching L2 Answer listeners...");
            submitBtn.addEventListener('click', handleLevel2AnswerSubmit);
            inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !submitBtn.disabled) { handleLevel2AnswerSubmit(); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called");
    try {
        const inputEl = document.getElementById('level2-answer-input');
        const messageEl = document.getElementById('level2-message');
        const submitBtn = document.getElementById('level2-answer-submit');

        if (!inputEl || !messageEl || !submitBtn || submitBtn.disabled) { return; }

        let answer = inputEl.value.trim().toUpperCase();
        messageEl.textContent = '';
        if (!answer) { messageEl.textContent = "Please enter an answer."; return; }

        let correctAnswers = [];
        let currentQ = level2QuestionNumber;

        // ***** CEVAP LİSTELERİ YER DEĞİŞTİ *****
        if (currentQ === 1) { // Ana Sponsor -> THY vb.
            correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"];
        } else if (currentQ === 2) { // Son Sponsor -> Swiss vb.
            correctAnswers = ["SWISS AIR", "SWISSAIR"];
        } else if (currentQ === 3) { // İttifak -> Star Alliance
            correctAnswers = ["STAR ALLIANCE"];
        } else { console.error("Invalid question number:", currentQ); return; }
        // ***** DEĞİŞİKLİK SONU *****

        submitBtn.disabled = true; inputEl.disabled = true; // Disable during processing

        if (correctAnswers.includes(answer)) {
            // CORRECT
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++; saveLevel2QuestionNumber(level2QuestionNumber);
            if (level2QuestionNumber > 3) { // Passed Level 2
                messageEl.textContent = "Correct! Level 2 completed!"; setTimeout(() => goToLevel(3), 1500);
            } else { // Go to next question
                messageEl.textContent = `Correct! Moving to question ${level2QuestionNumber}...`; setTimeout(() => displayLevel(2), 1500);
            }
        } else {
            // INCORRECT - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1; saveLevel2QuestionNumber(level2QuestionNumber);
            messageEl.textContent = "Incorrect! Returning to the first question...";
            setTimeout(() => displayLevel(2), 2000); // Reload L2 display (will show Q1)
        }

    } catch(error) {
        console.error("Error during handleLevel2AnswerSubmit:", error);
        if(messageEl) messageEl.textContent = "Error processing answer.";
        // Re-enable on error?
         const submitBtn = document.getElementById('level2-answer-submit'); const inputEl = document.getElementById('level2-answer-input');
         if(submitBtn) submitBtn.disabled = false; if(inputEl) inputEl.disabled = false;
    }
}

// --- Navigation & Reset ---
function goToLevel(levelNumber) { /* ... Önceki kod (Alert'li) ... */ }
function resetToLevel1() { /* ... Önceki kod ... */ }

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
