// Kyros's Prophet Mechanism - Final Script (Added Discount Code Details)

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

// --- Discount Codes ---
const SWISS_CODE = "KYROSILEU20";
const THY_CODE = "MERHABAKYROSILEU";

// --- Core Functions ---

function saveGame(level) {
    try { localStorage.setItem(LEVEL_STORAGE_KEY, level); console.log(`Game saved at level: ${level}`);
        if (level === 2) { saveLevel2QuestionNumber(level2QuestionNumber); }
        else { localStorage.removeItem(L2_QUESTION_STORAGE_KEY); }
    } catch (e) { console.error("Could not save game level!", e); }
}

function saveLevel2QuestionNumber(qNum) {
     try { const currentSavedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
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
            // --- Display Level 1 ---
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
            attachLevel1Listeners(); updateIndicator('');
        } else if (levelNumber === 2) {
            // --- Display Level 2 ---
            console.log("Setting up Level 2 HTML...");
            level2QuestionNumber = loadLevel2QuestionNumber();
            let questionText = "";
            if (level2QuestionNumber === 1) { questionText = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionText = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & THY) belong to?"; }
            else { questionText = "Error loading question. Please Reset."; level2QuestionNumber = 1; saveLevel2QuestionNumber(1); }

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                ${resetButtonHTML}
            `;
            attachLevel2AnswerListeners();
        } else { // Level 3 or higher is Reward Screen
             // --- Display Reward Screen ---
            console.log(`Displaying Reward Screen (Level ${levelNumber}).`);
             if(mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Reward`;

             mechanismDiv.innerHTML = `
                <h2>Congratulations! Levels Completed!</h2>
                <p class="reward-instructions" style="color:red; font-weight:bold;">
                    KESİNLİKLE havayolu şirketine kayıtlı E-POSTA ADRESİNİZİ ilgili alana girin. <br>
                    İndirim kodunuz bu e-posta ile eşleştirilecektir! (En az birini doldurmanız zorunludur.)
                </p>
                <div style="margin-top: 15px;">
                    <label for="swiss-email" style="display: block; margin-bottom: 2px;">Swiss Air'e kayıtlı mail:</label>
                    <input type="email" id="swiss-email" placeholder="swiss_email@example.com" style="margin-bottom: 10px; width: 80%; max-width: 300px; padding: 5px;"><br>

                    <label for="thy-email" style="display: block; margin-bottom: 2px;">Turkish Airlines/Miles&Smiles kayıtlı mail:</label>
                    <input type="email" id="thy-email" placeholder="thy_email@example.com" style="width: 80%; max-width: 300px; padding: 5px;">
                </div>
                <button id="get-code-button" style="margin-top: 20px; padding: 10px 20px; font-size: 1.1em;">Get My Discount Code(s)</button>
                <div id="discount-code-area" style="margin-top: 20px; font-weight: bold; font-size: 1.1em; display: none; border: 1px solid green; padding: 15px; background-color: #e9f5e9; line-height: 1.6;">
                    </div>
                ${resetButtonHTML}
             `;
             attachRewardScreenListeners();
        }
    } catch(error) { console.error("Error during displayLevel:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red;">Error loading content! Try resetting.</p>${resetButtonHTML || ''}`; }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() { /* ... Önceki kod ... */ }
function handleSymbolClick(symbol) { /* ... Önceki kod ... */ }
function updateIndicator(color) { /* ... Önceki kod ... */ }

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() { /* ... Önceki kod ... */ }
function handleLevel2AnswerSubmit() { /* ... Önceki kod ... */ }

// --- Reward Screen Functions ---
function attachRewardScreenListeners() {
    setTimeout(() => {
        try {
            const getCodeBtn = document.getElementById('get-code-button');
            if (!getCodeBtn) { console.error("Reward Listener Error!"); return; }
            console.log("Attaching Reward Screen listeners...");
            getCodeBtn.addEventListener('click', handleGetCodeClick);
        } catch(error) { console.error("Error attaching reward listeners", error); }
    }, 0);
}

function handleGetCodeClick() {
    console.log("handleGetCodeClick called");
    try {
        const swissInput = document.getElementById('swiss-email');
        const thyInput = document.getElementById('thy-email');
        const codeArea = document.getElementById('discount-code-area');
        const messageEl = document.getElementById('level2-message') || {}; // Use dummy object if messageEl not on this screen
        const getCodeBtn = document.getElementById('get-code-button');

        if (!swissInput || !thyInput || !codeArea || !getCodeBtn) { console.error("Reward Error: Missing elements."); return; }

        const swissEmail = swissInput.value.trim();
        const thyEmail = thyInput.value.trim();

        // Validation: At least one must be filled
        if (swissEmail === '' && thyEmail === '') {
            // Use codeArea to display error here instead of messageEl? Or add a specific message area? Let's use codeArea.
            codeArea.innerHTML = `<p style="color:red;">Please enter your email in at least one field to get the code.</p>`;
            codeArea.style.display = 'block'; // Make sure error is visible
            return;
        }

        // Prepare codes and details to display
        let codeOutput = '<h3>Your Discount Code(s):</h3>';
        let addedCode = false;

        if (swissEmail !== '') {
            codeOutput += `<p>Swiss Air Discount (%20): <strong style="color:blue; font-size: 1.2em;">${SWISS_CODE}</strong></p>`;
            addedCode = true;
        }
        if (thyEmail !== '') {
            if (addedCode) codeOutput += '<br>'; // Add space if both shown
            codeOutput += `<p>Turkish Airlines Discount (%25): <strong style="color:red; font-size: 1.2em;">${THY_CODE}</strong></p>`;
            addedCode = true;
        }

        // ***** ADD FINE PRINT DETAILS *****
        if(addedCode){
            codeOutput += `<hr style="margin: 15px 0; border-top: 1px dashed #ccc;">`;
            codeOutput += `<p style="font-size: 0.9em; color: #555;">`;
            codeOutput += `<strong>Details & Conditions:</strong><br>`;
            codeOutput += `- Business Class included.<br>`;
            codeOutput += `- Discount applies to base fare (excludes taxes and fees).<br>`;
            codeOutput += `- Valid until: <strong>April 30, 2025</strong>.`;
            codeOutput += `</p>`;
        } else {
             // Should not be reachable due to validation, but fallback
             codeOutput = "<p>No code to display based on input.</p>";
        }
        // ***** DETAILS ADDED *****

        // Display the code(s) and details
        codeArea.innerHTML = codeOutput;
        codeArea.style.display = 'block';

        // Disable inputs and button after revealing code
        swissInput.disabled = true;
        thyInput.disabled = true;
        getCodeBtn.disabled = true;
        getCodeBtn.textContent = "Code(s) Revealed!";

        console.log("Discount code(s) and details displayed.");

    } catch (error) {
        console.error("Error in handleGetCodeClick:", error);
        if(codeArea) { // Try showing error in code area
             codeArea.innerHTML = `<p style="color:red;">Error retrieving code: ${error.message}</p>`;
             codeArea.style.display = 'block';
        }
    }
}


// --- Navigation & Reset ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    if (levelNumber < 3) { // Only alert for passing L1
        alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    } else { // Transitioning to reward screen (L3)
         console.log(`Congratulations! Level ${passedLevel} Passed! Moving to Reward Screen (Level ${levelNumber})...`);
    }
    currentLevel = levelNumber;
    saveGame(currentLevel);
    displayLevel(currentLevel);
}

function resetToLevel1() {
    console.warn("Resetting progress to Level 1!");
    try {
        localStorage.removeItem(LEVEL_STORAGE_KEY);
        localStorage.removeItem(L2_QUESTION_STORAGE_KEY);
        window.location.reload();
    } catch(e) { console.error("Error resetting progress:", e); alert("Error resetting progress: " + e.message); }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
