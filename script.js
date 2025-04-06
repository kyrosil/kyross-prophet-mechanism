// Kyros's Prophet Mechanism - Final Cleaned Script (Stateless, L1+L2+Reward, Text Updates)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2QuestionNumber = 1;

// --- DOM References ---
let mechanismDiv;

// --- Discount Codes ---
const SWISS_CODE = "KYROSILEU20";
const THY_CODE = "MERHABAKYROSILEU";

// --- Core Functions ---

// No save/load functions needed (Stateless)

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = '';

        const mainTitle = document.querySelector('h1');
        if (levelNumber <= 2) {
            if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;
        } else {
            if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Reward`;
        }

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
            console.log(`Setting up Level 2 HTML for Q${level2QuestionNumber}...`);
            let questionText = "";
            // Corrected Q3 Text
            if (level2QuestionNumber === 1) { questionText = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionText = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & Turkish Airlines) belong to?"; }
            else { questionText = "Error loading question."; level2QuestionNumber = 1; }

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                `;
            attachLevel2AnswerListeners();

        } else { // Level 3 or higher IS the Reward Screen
            console.log(`Displaying Reward Screen (Level ${levelNumber}).`);
            mechanismDiv.innerHTML = `
                <h2>Congratulations! Levels Completed!</h2>
                <p class="reward-instructions" style="color:red; font-weight:bold;">
                    KESİNLİKLE havayolu şirketine kayıtlı E-POSTA ADRESİNİZİ ilgili alana girin. İndirim kodunuz bu e-posta ile eşleştirilecektir! (En az birini doldurmanız zorunludur.)<br>
                    <span style="font-size:0.9em; opacity:0.8;">(Please enter the E-MAIL ADDRESS registered with the airline company in the relevant field. Your discount code will be matched with this e-mail! Filling in at least one is mandatory.)</span>
                </p>
                <div style="margin-top: 15px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <label for="swiss-email" style="display: block; margin-bottom: 2px;">Swiss Air'e kayıtlı mail / Email registered with Swiss Air:</label>
                    <input type="email" id="swiss-email" placeholder="swiss_email@example.com" style="margin-bottom: 10px; width: 100%; padding: 5px; box-sizing: border-box;"><br>

                    <label for="thy-email" style="display: block; margin-bottom: 2px;">Turkish Airlines/Miles&Smiles kayıtlı mail / Email registered with Turkish Airlines/Miles&Smiles:</label>
                    <input type="email" id="thy-email" placeholder="thy_email@example.com" style="width: 100%; padding: 5px; box-sizing: border-box;">
                </div>
                <button id="get-code-button" style="margin-top: 20px; padding: 10px 20px; font-size: 1.1em;">İndirim Kod(lar)ımı Göster / Get My Discount Code(s)</button>
                <p id="reward-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p> <div id="discount-code-area" style="margin-top: 20px; text-align: left; font-weight: bold; font-size: 1.1em; display: none; border: 1px solid green; padding: 15px; background-color: #e9f5e9; line-height: 1.6;">
                    </div>
                `;
             attachRewardScreenListeners();
        }
    } catch(error) { console.error("Error during displayLevel:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red;">Error loading level content!</p>`; }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    setTimeout(() => {
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
            if (lastSymbolClicked === 'triangle') {
                colorToSet = 'green'; lastSymbolClicked = null; updateIndicator(colorToSet);
            } else {
                colorToSet = 'blue'; updateIndicator(colorToSet); // Update color FIRST
                if (!level1Passed) {
                    level1Passed = true; console.log("Level 1 Pass Condition Met (BLUE)!");
                    setTimeout(() => goToLevel(2), 500); // Go to next level
                    return; // Return after triggering
                }
                lastSymbolClicked = null;
            }
        } else if (symbol === 'circle') {
            colorToSet = ''; lastSymbolClicked = null; updateIndicator(colorToSet);
        }
    } catch (error) { console.error("Error in handleSymbolClick:", error); }
}

function updateIndicator(color) {
    try {
        const indicatorEl = document.getElementById('indicator');
        if (indicatorEl) { indicatorEl.style.backgroundColor = color || '#ddd'; }
    } catch (error) { console.error("Error updating indicator:", error); }
}

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const inputEl = document.getElementById('level2-answer-input');
            const submitBtn = document.getElementById('level2-answer-submit');
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error: Elements not found!"); return; }
            console.log("Attaching L2 Answer listeners...");
            submitBtn.addEventListener('click', handleLevel2AnswerSubmit);
            inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !submitBtn.disabled) { handleLevel2AnswerSubmit(); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called for Q" + level2QuestionNumber);
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

        // Define answers (Corrected order)
        if (currentQ === 1) { correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"]; }
        else if (currentQ === 2) { correctAnswers = ["SWISS AIR", "SWISSAIR"]; }
        else if (currentQ === 3) { correctAnswers = ["STAR ALLIANCE"]; }
        else { console.error("Invalid question number:", currentQ); return; }

        submitBtn.disabled = true; inputEl.disabled = true; // Disable during processing

        if (correctAnswers.includes(answer)) { // CORRECT
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++;
            if (level2QuestionNumber > 3) { // Passed Level 2
                messageEl.textContent = "Correct! Level 2 completed!"; setTimeout(() => goToLevel(3), 1500);
            } else { // Go to next question
                messageEl.textContent = `Correct! Moving to question ${level2QuestionNumber}...`; setTimeout(() => displayLevel(2), 1500);
            }
        } else { // INCORRECT - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1; // Reset state to Q1
            messageEl.textContent = "Incorrect! Returning to the first question...";
            setTimeout(() => displayLevel(2), 2000); // Reload L2 display (shows Q1)
        }
    } catch(error) { console.error("Error during handleLevel2AnswerSubmit:", error); if(messageEl) messageEl.textContent = "Error processing answer."; /* Re-enable on error? */ const submitBtn = document.getElementById('level2-answer-submit'); const inputEl = document.getElementById('level2-answer-input'); if(submitBtn) submitBtn.disabled = false; if(inputEl) inputEl.disabled = false; }
}


// --- Reward Screen Functions ---
function attachRewardScreenListeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const getCodeBtn = document.getElementById('get-code-button');
            if (!getCodeBtn) { console.error("Reward Listener Error: Get Code button not found!"); return; }
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
        const messageEl = document.getElementById('reward-message'); // Use reward message area
        const getCodeBtn = document.getElementById('get-code-button');

        if (!swissInput || !thyInput || !codeArea || !messageEl || !getCodeBtn) { console.error("Reward Error: Missing elements."); if (messageEl) messageEl.textContent="Interface Error."; return; }

        const swissEmail = swissInput.value.trim();
        const thyEmail = thyInput.value.trim();
        messageEl.textContent = ''; // Clear message area

        if (swissEmail === '' && thyEmail === '') {
            messageEl.textContent = "Please enter your email in at least one field / Lütfen en az bir alana e-postanızı girin.";
            return;
        }

        let codeOutput = '<h3>İndirim Kod(lar)ınız / Your Discount Code(s):</h3>';
        let addedCode = false;

        if (swissEmail !== '') {
            codeOutput += `<p>Swiss Air Discount (%20): <strong style="color:blue; font-size: 1.2em;">${SWISS_CODE}</strong></p>`;
            addedCode = true;
        }
        if (thyEmail !== '') {
            if (addedCode && swissEmail !== '') codeOutput += '<br>';
            codeOutput += `<p>Turkish Airlines Discount (%25): <strong style="color:red; font-size: 1.2em;">${THY_CODE}</strong></p>`;
            addedCode = true;
        }

        if(addedCode){
            codeOutput += `<hr style="margin: 15px 0; border-top: 1px dashed #ccc;">`;
            codeOutput += `<p style="font-size: 0.9em; color: #555;">`;
            codeOutput += `<strong>Detaylar & Koşullar / Details & Conditions:</strong><br>`;
            codeOutput += `- Business Class dahildir / Business Class included.<br>`;
            codeOutput += `- İndirim vergi ve harçlar hariç ana ücrete uygulanır / Discount applies to base fare (excludes taxes and fees).<br>`;
            codeOutput += `- Son Geçerlilik Tarihi / Valid until: <strong>April 30, 2025</strong>.`;
            codeOutput += `</p>`;
        } else { codeOutput = "<p>No code to display.</p>"; } // Fallback


        codeArea.innerHTML = codeOutput;
        codeArea.style.display = 'block';

        // Disable inputs and button
        swissInput.disabled = true;
        thyInput.disabled = true;
        getCodeBtn.disabled = true;
        getCodeBtn.textContent = "Kod(lar) Gösterildi / Code(s) Revealed!";

        console.log("Discount code(s) and details displayed.");

    } catch (error) {
        console.error("Error in handleGetCodeClick:", error);
        if(messageEl) messageEl.textContent = "Error retrieving code: " + error.message;
    }
}


// --- Navigation ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    if (passedLevel > 0 && levelNumber < 3) { // Alert only after L1 or L2 pass, not for reward screen
        alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    } else {
         console.log(`Moving to Level ${levelNumber}...`);
    }
    currentLevel = levelNumber;
    level2QuestionNumber = 1; // Always reset L2 progress when moving to a new level (L2 or L3/Reward)
    // No saving needed
    displayLevel(currentLevel);
}

// --- Reset Functionality (No localStorage needed) ---
// We actually don't need a reset button if there's no saving. Reloading always resets.
// Keeping the function stub in case needed later.
// function resetToLevel1() { window.location.reload(); } // Simple reload resets stateless game

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
     console.log("DOM Ready, starting game at Level 1.");
     currentLevel = 1;
     level1Passed = false;
     lastSymbolClicked = null;
     level2QuestionNumber = 1;
     displayLevel(1); // Always start at level 1
});
