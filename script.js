// Kyros's Prophet Mechanism - Simplified Script (No localStorage, No Attempts)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false; // Still needed to trigger transition *once*
let lastSymbolClicked = null;
let level2QuestionNumber = 1; // Tracks current question within L2 (1, 2, or 3) - resets each time L2 starts

// --- DOM References ---
let mechanismDiv; // Main container reference

// --- Discount Codes ---
const SWISS_CODE = "KYROSILEU20";
const THY_CODE = "MERHABAKYROSILEU";

// --- Core Functions ---

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    currentLevel = levelNumber; // Update global state
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = ''; // Clear previous content

        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber > 2 ? 'Reward' : levelNumber}`; // Show "Reward" for level 3

        // Simplified reset: just go back to level 1 display
        let resetButtonHTML = (levelNumber > 1) ? `<p style="margin-top: 30px;"><button onclick="displayLevel(1)">Restart Level 1</button></p>` : '';

        if (levelNumber === 1) {
            // --- Display Level 1 ---
            console.log("Setting up Level 1 HTML...");
            lastSymbolClicked = null; // Reset L1 state on display
            level1Passed = false; // Reset L1 pass state on display
            level2QuestionNumber = 1; // Reset L2 state when L1 displays
            mechanismDiv.innerHTML = `
                <h2>Level 1: The Mechanism</h2>
                <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle">△</button>
                    <button id="symbol-square" title="Square">□</button>
                    <button id="symbol-circle" title="Circle">○</button>
                </div>
                <div id="indicator"></div>
                <p>Discover the primary functions.</p>
            `;
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            // --- Display Level 2 (3-Question Logic) ---
            console.log(`Setting up Level 2 HTML - Question ${level2QuestionNumber}`);

            let questionText = "";
            // Determine which question to display based on current state
            if (level2QuestionNumber === 1) { questionText = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionText = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & THY) belong to?"; }
            else { // Should not happen, but reset if state is invalid
                 console.error("Invalid L2 question number:", level2QuestionNumber, "Resetting to Q1.");
                 level2QuestionNumber = 1; questionText = "Q1: Who is the main sponsor of Kyrosil?";
            }

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                ${resetButtonHTML}
            `;
            attachLevel2AnswerListeners(); // Attach listeners for input/button

        } else { // Level 3 is Reward Screen
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
             attachRewardScreenListeners(); // Attach listener for the reward button
        }
    } catch(error) {
         console.error("Error during displayLevel:", error);
         if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Please try restarting Level 1.</p><p><button onclick="displayLevel(1)">Restart Level 1</button></p>`;
    }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const triangleBtn = document.getElementById('symbol-triangle');
            const squareBtn = document.getElementById('symbol-square');
            const circleBtn = document.getElementById('symbol-circle');
            if (!triangleBtn || !squareBtn || !circleBtn) { console.error("L1 Listener Error!"); return; }
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
                if (!level1Passed) { // Prevent multiple transitions if clicked fast
                    level1Passed = true; console.log("Level 1 Pass Condition Met (BLUE)!");
                    // Transition directly without saving state
                    setTimeout(() => displayLevel(2), 700); // Delay to show blue, then display L2
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
        if (indicatorEl) { indicatorEl.style.backgroundColor = color || '#ddd'; console.log(`Indicator color set to: ${color || 'default(#ddd)'}`); }
    } catch (error) { console.error("Error updating indicator:", error); }
}

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

        // Define answers for the current question
        if (currentQ === 1) { correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"]; }
        else if (currentQ === 2) { correctAnswers = ["SWISS AIR", "SWISSAIR"]; }
        else if (currentQ === 3) { correctAnswers = ["STAR ALLIANCE"]; }
        else { console.error("Invalid question number:", currentQ); return; }

        submitBtn.disabled = true; inputEl.disabled = true; // Disable during processing

        if (correctAnswers.includes(answer)) {
            // CORRECT ANSWER
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++; // Move state to next question index

            if (level2QuestionNumber > 3) { // Passed Level 2
                console.log("Level 2 Passed!");
                messageEl.textContent = "Correct! Level 2 completed!";
                setTimeout(() => displayLevel(3), 1500); // Go to reward screen (Level 3)
            } else { // Go to next question within Level 2
                console.log(`Moving to Q${level2QuestionNumber}`);
                messageEl.textContent = `Correct! Moving to question ${level2QuestionNumber}...`;
                setTimeout(() => displayLevel(2), 1500); // Reload L2 display for next Q
            }
        } else {
            // INCORRECT ANSWER - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1; // Reset state to Q1
            messageEl.textContent = "Incorrect! Returning to the first question...";
             // Reload Level 2 display to show Question 1 again after delay
            setTimeout(() => displayLevel(2), 2000);
        }
    } catch(error) {
        console.error("Error during handleLevel2AnswerSubmit:", error);
        if(messageEl) messageEl.textContent = "Error processing answer.";
        // Re-enable controls on error
         const submitBtn = document.getElementById('level2-answer-submit'); const inputEl = document.getElementById('level2-answer-input');
         if(submitBtn) submitBtn.disabled = false; if(inputEl) inputEl.disabled = false;
    }
}


// --- Reward Screen Functions ---
function attachRewardScreenListeners() { /* ... Önceki kod (detaylar eklenmiş hali) ... */ }
function handleGetCodeClick() { /* ... Önceki kod (detaylar eklenmiş hali) ... */ }

// --- Navigation & Reset ---
// goToLevel kaldırıldı, geçişler displayLevel ile yapılıyor.
// resetToLevel1 kaldırıldı, yerine basit reset butonu geldi.

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    displayLevel(1); // Always start at level 1
});

console.log("Simplified Script Loaded.");
