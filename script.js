// Kyros's Prophet Mechanism - Enhanced Version with Animations and Mobile Optimization

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2QuestionNumber = 1;

// --- DOM References ---
let mechanismDiv;
let mainTitle;
let startScreen;

// --- Discount Codes ---
const SWISS_CODE = "KYROSILSWISS20";
const THY_CODE = "KYROSILEUC25";

// --- Particle Effect ---
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const isMobile = window.innerWidth <= 600;
    const particleCount = isMobile ? 30 : 50; // Mobil cihazlarda daha az partikül

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (isMobile ? 2 : 3) + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.01;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
            if (p.size <= 0.2) {
                particles.splice(particles.indexOf(p), 1);
                particles.push(new Particle());
            }
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// --- Initial Setup on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Setting up initial screen.");
    try {
        startScreen = document.getElementById('start-screen');
        mainTitle = document.querySelector('h1#main-title');
        mechanismDiv = document.getElementById('mechanism');
        const startGameButton = document.getElementById('start-game-button');
        const themeToggle = document.getElementById('theme-toggle');

        if (!startScreen || !mainTitle || !mechanismDiv || !startGameButton) {
            console.error("Initial setup error: Essential elements not found!");
            if (document.body) document.body.innerHTML = "<h1 style='color:red;'>Page Load Error! Essential elements missing.</h1>";
            return;
        }

        startScreen.style.display = 'flex';
        mainTitle.style.display = 'none';
        mechanismDiv.style.display = 'none';

        startGameButton.addEventListener('click', startGame);
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
        });

        initParticles();
        console.log("Initial screen setup complete.");
    } catch (error) {
        console.error("Error during initial DOM setup:", error);
        if (document.body) document.body.innerHTML = `<h1 style='color:red;'>Page Load Error! ${error.message}</h1>`;
    }
});

// --- Function to Start the Game ---
function startGame() {
    console.log("Start button clicked. Starting game...");
    try {
        startScreen = document.getElementById('start-screen');
        mainTitle = document.querySelector('h1#main-title');
        mechanismDiv = document.getElementById('mechanism');

        startScreen.classList.add('level-transition');
        setTimeout(() => {
            startScreen.style.display = 'none';
            startScreen.classList.remove('level-transition');
            mainTitle.style.display = 'block';
            mechanismDiv.style.display = 'block';
            mechanismDiv.classList.add('level-transition');
            setTimeout(() => mechanismDiv.classList.remove('level-transition'), 400);

            currentLevel = 1;
            level1Passed = false;
            lastSymbolClicked = null;
            level2QuestionNumber = 1;
            displayLevel(1);
        }, 400);
    } catch (error) {
        console.error("Error in startGame function:", error);
        if (mechanismDiv) mechanismDiv.innerHTML = `<p style='color:red;'>Error starting game: ${error.message}</p>`;
    }
}

// --- Core Display Function ---
function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container not found!"); return; }

        mechanismDiv.classList.add('level-transition');
        setTimeout(() => {
            mechanismDiv.innerHTML = '';
            mechanismDiv.classList.remove('level-transition');

            mainTitle = document.querySelector('h1#main-title');
            if (mainTitle) {
                mainTitle.style.display = 'block';
                mainTitle.textContent = levelNumber <= 2 ? `Kyros's Prophet Mechanism - Level ${levelNumber}` : `Kyros's Prophet Mechanism - Reward / Ödül`;
            }

            let resetButtonHTML = levelNumber > 1 ? `<p style="margin-top: 30px;"><button onclick="resetGame()">Reset to Start</button></p>` : '';

            if (levelNumber === 1) {
                console.log("Setting up Level 1 HTML...");
                mechanismDiv.innerHTML = `
                    <h2>Level 1 / Seviye 1</h2>
                    <div id="mechanism-symbols">
                        <button id="symbol-triangle" title="Triangle / Üçgen">△</button>
                        <button id="symbol-square" title="Square / Kare">□</button>
                        <button id="symbol-circle" title="Circle / Daire">○</button>
                    </div>
                    <div id="indicator"></div>
                    <p>Discover the primary functions. / Temel fonksiyonları keşfedin.</p>
                    ${resetButtonHTML}`;
                attachLevel1Listeners();
                updateIndicator('');
            } else if (levelNumber === 2) {
                console.log(`Setting up Level 2 HTML for Q${level2QuestionNumber}...`);
                let questionTextTR = "";
                let questionTextEN = "";
                if (level2QuestionNumber === 1) {
                    questionTextTR = "Soru 1: Kyrosil'in ana sponsoru kimdir?";
                    questionTextEN = "Q1: Who is the main sponsor of Kyrosil?";
                } else if (level2QuestionNumber === 2) {
                    questionTextTR = "Soru 2: Kyrosil'in son sponsoru kimdir?";
                    questionTextEN = "Q2: Who is the latest sponsor of Kyrosil?";
                } else if (level2QuestionNumber === 3) {
                    questionTextTR = "Soru 3: Bu iki sponsorun (Swiss Air & Turkish Airlines) ortak bağlı olduğu havayolu ittifakı hangisidir?";
                    questionTextEN = "Q3: What airline alliance do these two sponsors (Swiss Air & Turkish Airlines) belong to?";
                } else {
                    questionTextTR = "Hata: Geçersiz soru durumu. Başa dönülüyor.";
                    questionTextEN = "Error: Invalid question state. Resetting.";
                    level2QuestionNumber = 1;
                }

                mechanismDiv.innerHTML = `
                    <h2>Level 2 / Seviye 2: Bilgi Kontrolü / Knowledge Check (${level2QuestionNumber}/3)</h2>
                    <p class="level2-instructions">${questionTextTR}<br><em>(${questionTextEN})</em></p>
                    <input type="text" id="level2-answer-input" placeholder="Cevabınızı girin / Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                    <button id="level2-answer-submit">Cevabı Gönder / Submit Answer</button>
                    <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                    ${resetButtonHTML}`;
                attachLevel2AnswerListeners();
            } else {
                console.log(`Displaying Reward Screen (Level ${levelNumber}).`);
                mechanismDiv.innerHTML = `
                    <h2>Tebrikler! Seviyeler Tamamlandı! / Congratulations! Levels Completed!</h2>
                    <p class="reward-instructions">
                        KESİNLİKLE havayolu şirketine kayıtlı E-POSTA ADRESİNİZİ ilgili alana girin. İndirim kodunuz bu e-posta ile eşleştirilecektir! (En az birini doldurmanız zorunludur.)<br>
                        <span>(Please enter the E-MAIL ADDRESS registered with the airline company in the relevant field. Your discount code will be matched with this e-mail! Filling in at least one is mandatory.)</span>
                    </p>
                    <div style="margin-top: 15px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                        <label for="swiss-email">Swiss Air'e kayıtlı mail / Email registered with Swiss Air:</label>
                        <input type="email" id="swiss-email" placeholder="swiss_email@example.com"><br>
                        <label for="thy-email">Turkish Airlines/Miles&Smiles kayıtlı mail / Email registered with Turkish Airlines/Miles&Smiles:</label>
                        <input type="email" id="thy-email" placeholder="thy_email@example.com">
                    </div>
                    <button id="get-code-button">İndirim Kod(lar)ımı Göster / Get My Discount Code(s)</button>
                    <p id="reward-message"></p>
                    <div id="discount-code-area"></div>
                    ${resetButtonHTML}`;
                attachRewardScreenListeners();
            }
            console.log(`displayLevel for Level ${levelNumber} finished setup.`);
        }, 400);
    } catch (error) {
        console.error("Error during displayLevel execution:", error);
        if (mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Please try refreshing. Error: ${error.message}</p>`;
    }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    setTimeout(() => {
        try {
            const triangleBtn = document.getElementById('symbol-triangle');
            const squareBtn = document.getElementById('symbol-square');
            const circleBtn = document.getElementById('symbol-circle');
            if (!triangleBtn || !squareBtn || !circleBtn) {
                console.error("Could not find L1 buttons!");
                return;
            }
            console.log("Attaching L1 listeners...");
            triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
            squareBtn.addEventListener('click', () => handleSymbolClick('square'));
            circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
        } catch (error) {
            console.error("Error attaching L1 listeners:", error);
        }
    }, 0);
}

function handleSymbolClick(symbol) {
    if (currentLevel !== 1) return;
    console.log(`handleSymbolClick: ${symbol}`);
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
                lastSymbolClicked = null;
                if (!level1Passed) {
                    level1Passed = true;
                    console.log("Level 1 Pass Condition Met (BLUE)!");
                    updateIndicator(colorToSet);
                    setTimeout(() => goToLevel(2), 500);
                    return;
                }
            }
        } else if (symbol === 'circle') {
            colorToSet = '';
            lastSymbolClicked = null;
        }
        updateIndicator(colorToSet);
    } catch (error) {
        console.error("Error in handleSymbolClick:", error);
    }
}

function updateIndicator(color) {
    try {
        const indicatorEl = document.getElementById('indicator');
        if (indicatorEl) {
            indicatorEl.style.backgroundColor = color || '#ddd';
        }
    } catch (error) {
        console.error("Error updating indicator:", error);
    }
}

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() {
    setTimeout(() => {
        try {
            const inputEl = document.getElementById('level2-answer-input');
            const submitBtn = document.getElementById('level2-answer-submit');
            if (!inputEl || !submitBtn) {
                console.error("L2 Listener Error: Elements not found!");
                return;
            }
            console.log("Attaching L2 Answer listeners...");
            const newSubmitBtn = submitBtn.cloneNode(true);
            inputEl.parentNode.replaceChild(newSubmitBtn, submitBtn);
            const newInputEl = inputEl.cloneNode(true);
            inputEl.parentNode.replaceChild(newInputEl, inputEl);

            newSubmitBtn.addEventListener('click', handleLevel2AnswerSubmit);
            newInputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !newSubmitBtn.disabled) {
                    handleLevel2AnswerSubmit();
                }
            });
        } catch (error) {
            console.error("Error attaching L2 listeners", error);
        }
    }, 0);
}

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called for Q" + level2QuestionNumber);
    try {
        const inputEl = document.getElementById('level2-answer-input');
        const messageEl = document.getElementById('level2-message');
        const submitBtn = document.getElementById('level2-answer-submit');
        if (!inputEl || !messageEl || !submitBtn || submitBtn.disabled) {
            console.log("L2 Submit stopped: elements missing or button disabled.");
            return;
        }

        let answer = inputEl.value.trim().toUpperCase();
        messageEl.textContent = '';
        if (!answer) {
            messageEl.textContent = "Lütfen bir cevap girin. / Please enter an answer.";
            return;
        }

        let correctAnswers = [];
        let currentQ = level2QuestionNumber;
        if (currentQ === 1) {
            correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"];
        } else if (currentQ === 2) {
            correctAnswers = ["SWISS AIR", "SWISSAIR"];
        } else if (currentQ === 3) {
            correctAnswers = ["STAR ALLIANCE"];
        } else {
            console.error("Invalid question number:", currentQ);
            messageEl.textContent = "Question Error.";
            return;
        }

        submitBtn.disabled = true;
        inputEl.disabled = true;

        if (correctAnswers.includes(answer)) {
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++;
            if (level2QuestionNumber > 3) {
                messageEl.textContent = "Doğru! Seviye 2 tamamlandı! / Correct! Level 2 completed!";
                setTimeout(() => goToLevel(3), 1500);
            } else {
                messageEl.textContent = `Doğru! Sonraki soruya geçiliyor (${level2QuestionNumber}/3)... / Correct! Moving to the next question (${level2QuestionNumber}/3)...`;
                setTimeout(() => displayLevel(2), 1500);
            }
        } else {
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1;
            messageEl.textContent = "Yanlış cevap! İlk soruya geri dönülüyor... / Incorrect! Returning to the first question...";
            setTimeout(() => displayLevel(2), 2000);
        }
    } catch (error) {
        console.error("Error during handleLevel2AnswerSubmit:", error);
        if (messageEl) messageEl.textContent = "Cevap işlenirken hata oluştu. / Error processing answer.";
        const submitBtn = document.getElementById('level2-answer-submit');
        const inputEl = document.getElementById('level2-answer-input');
        if (submitBtn) submitBtn.disabled = false;
        if (inputEl) inputEl.disabled = false;
    }
}

// --- Reward Screen Functions ---
function attachRewardScreenListeners() {
    setTimeout(() => {
        try {
            const getCodeBtn = document.getElementById('get-code-button');
            if (!getCodeBtn) {
                console.error("Reward Listener Error!");
                return;
            }
            console.log("Attaching Reward Screen listeners...");
            const newGetCodeBtn = getCodeBtn.cloneNode(true);
            getCodeBtn.parentNode.replaceChild(newGetCodeBtn, getCodeBtn);
            newGetCodeBtn.addEventListener('click', handleGetCodeClick);
        } catch (error) {
            console.error("Error attaching reward listeners", error);
        }
    }, 0);
}

function handleGetCodeClick() {
    console.log("handleGetCodeClick called");
    try {
        const swissInput = document.getElementById('swiss-email');
        const thyInput = document.getElementById('thy-email');
        const codeArea = document.getElementById('discount-code-area');
        const messageEl = document.getElementById('reward-message');
        const getCodeBtn = document.getElementById('get-code-button');
        if (!swissInput || !thyInput || !codeArea || !messageEl || !getCodeBtn) {
            console.error("Reward Error: Missing elements.");
            if (messageEl) messageEl.textContent = "Interface Error.";
            return;
        }

        const swissEmail = swissInput.value.trim();
        const thyEmail = thyInput.value.trim();
        messageEl.textContent = '';

        if (swissEmail === '' && thyEmail === '') {
            messageEl.textContent = "Lütfen en az bir alana e-postanızı girin. / Please enter your email in at least one field.";
            return;
        }

        let codeOutput = '<h3>İndirim Kod(lar)ınız / Your Discount Code(s):</h3>';
        let addedCode = false;
        if (swissEmail !== '') {
            codeOutput += `<p>Swiss Air Discount (%20): <strong style="color:blue;" class="code">${SWISS_CODE}</strong></p>`;
            addedCode = true;
        }
        if (thyEmail !== '') {
            if (addedCode && swissEmail !== '') codeOutput += '<br>';
            codeOutput += `<p>Turkish Airlines Discount (%25): <strong style="color:red;" class="code">${THY_CODE}</strong></p>`;
            addedCode = true;
        }

        if (addedCode) {
            codeOutput += `<hr>`;
            codeOutput += `<p style="font-size: 0.9em; color: #555;"><strong>Detaylar & Koşullar / Details & Conditions:</strong><br>- Business Class dahildir / Business Class included.<br>- İndirim vergi ve harçlar hariç ana ücrete uygulanır / Discount applies to base fare (excludes taxes and fees).<br>- Son Geçerlilik Tarihi / Valid until: <strong>May 31, 2025</strong>.</p>`;
        } else {
            codeOutput = "<p>No code to display.</p>";
        }

        codeArea.innerHTML = codeOutput;
        codeArea.style.display = 'block';
        swissInput.disabled = true;
        thyInput.disabled = true;
        getCodeBtn.disabled = true;
        getCodeBtn.textContent = "Kod(lar) Gösterildi / Code(s) Revealed!";
        console.log("Discount code(s) and details displayed.");
    } catch (error) {
        console.error("Error in handleGetCodeClick:", error);
        if (messageEl) messageEl.textContent = "Error retrieving code: " + error.message;
    }
}

// --- Navigation ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    if (passedLevel > 0 && levelNumber <= 2) {
        alert(`Tebrikler! Seviye ${passedLevel} Geçildi!\nSeviye ${levelNumber}'e ilerleniyor... / Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    } else {
        console.log(`Moving to Level ${levelNumber}...`);
    }
    currentLevel = levelNumber;
    level1Passed = (currentLevel > 1);
    level2QuestionNumber = 1;
    displayLevel(currentLevel);
}

// --- Reset Functionality ---
function resetGame() {
    console.warn("Resetting game by reloading page!");
    try {
        if (confirm("Tüm ilerlemeyi sıfırlayıp başlangıç ekranına dönmek istediğinizden emin misiniz? / Are you sure you want to reset all progress and return to the start screen?")) {
            window.location.reload();
        }
    } catch (e) {
        console.error("Error resetting progress:", e);
        alert("Error resetting progress: " + e.message);
    }
}
