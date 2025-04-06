// Top-level script execution starts here
console.log("Kyros's Prophet Mechanism script loaded!");

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2Attempts = 5; // Varsayılan değer kalsın

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
        // Seviye 2 deneme hakkı artık burada kaydedilmeyecek, sadece seviye no
    } catch (e) { console.error("Could not save game level!", e); alert("Warning: Could not save game progress."); }
}

function saveLevel2Attempts(attempts) {
     try {
        // Sadece mevcut seviye 2 ise kaydetmek mantıklı olabilir
        if (currentLevel === 2) {
            localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts);
            console.log(`Level 2 attempts saved: ${attempts}`);
        }
     } catch (e) { console.error("Could not save L2 attempts", e); }
}


function loadGame() {
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found, starting at Level 1.");

        // Reset level-specific states based on loaded level
        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;
        level2Attempts = (currentLevel === 2) ? loadLevel2Attempts() : 5; // L2 denemesini sadece L2 yüklenirken oku

        displayLevel(currentLevel);
    } catch (e) {
        console.error("Could not load game state!", e);
        alert("Warning: Could not load saved game state. Starting from Level 1.");
        currentLevel = 1;
        displayLevel(currentLevel); // Fallback
    }
}

function loadLevel2Attempts() {
     // Bu fonksiyon sadece Seviye 2 yüklenirken çağrıldığı için,
     // seviye kontrolünü tekrar yapmaya gerek yok.
     try {
        const savedAttempts = localStorage.getItem(L2_ATTEMPTS_STORAGE_KEY);
        if (savedAttempts === null) {
            console.log("No saved L2 attempts found, defaulting to 5.");
            return 5; // Kayıt yoksa 5 hak
        }
        console.log(`Loaded L2 attempts: ${savedAttempts}`);
        return parseInt(savedAttempts, 10);
     } catch (e) {
        console.error("Could not load L2 attempts", e);
        return 5; // Hata durumunda 5 hak
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
        // ***** SEVİYE 1'İ TAMAMEN GERİ YÜKLÜYORUZ *****
        console.log("Setting up Level 1 HTML and listeners...");
        mechanismDiv.innerHTML = `
            <div id="mechanism-symbols">
                <button id="symbol-triangle">△</button>
                <button id="symbol-square">□</button>
                <button id="symbol-circle">○</button>
            </div>
            <div id="indicator"></div>
            <p>Level 1: Discover the primary functions.</p>
        `;
        // Olay dinleyicilerini tekrar bağla
        attachLevel1Listeners();
        // Göstergeyi sıfırla
        updateIndicator('');

    } else if (levelNumber === 2) {
        // ***** SEVİYE 2 ŞİMDİLİK BASİT KALIYOR *****
        console.log("Displaying placeholder for Level 2.");
        mechanismDiv.innerHTML = '<h2>Level 2 (Structure Test Successful - Content Pending)</h2>';

    } else {
        // Placeholder for Level 3 and beyond
         console.log(`Displaying placeholder for Level ${levelNumber}.`);
         mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>`;
    }
}

// --- Level 1 Specific Functions --- (Tamamen geri yüklendi)
function attachLevel1Listeners() {
    const triangleBtn = document.getElementById('symbol-triangle');
    const squareBtn = document.getElementById('symbol-square');
    const circleBtn = document.getElementById('symbol-circle');
    // Ensure elements exist before adding listeners
    if (!triangleBtn || !squareBtn || !circleBtn) {
        console.error("Cannot attach Level 1 listeners, elements not found in displayed HTML.");
        return;
    }
    console.log("Attaching Level 1 listeners...");
    triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
    squareBtn.addEventListener('click', () => handleSymbolClick('square'));
    circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
}

function handleSymbolClick(symbol) {
     if (currentLevel !== 1) return; // Sadece Seviye 1'de çalışsın
     console.log(`${symbol} clicked in Level 1`);

     let colorToSet = '';
     if (symbol === 'triangle') {
        colorToSet = 'red';
        lastSymbolClicked = 'triangle';
     } else if (symbol === 'square') {
         if (lastSymbolClicked === 'triangle') {
             colorToSet = 'green';
             lastSymbolClicked = null;
         } else {
             // Normal kare tıklaması - Seviye 1 Geçme Koşulu (Mavi)
             colorToSet = 'blue';
             if (!level1Passed) {
                 level1Passed = true; // Geçti olarak işaretle
                 console.log("Level 1 Pass Condition Met!");
                 updateIndicator(colorToSet); // Rengi göster
                 setTimeout(() => goToLevel(2), 500); // Seviye atla
                 return; // Erken çık
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
    } else {
        // console.log("Indicator element not found (maybe not Level 1?).");
    }
}

// --- Level 2 Specific Functions --- (Fonksiyonlar burada ama çağrılmıyorlar)
function attachLevel2Listeners(target) { /* ... kod ... */ }
function handleLevel2Submit(target) { /* ... kod ... */ }

// --- Navigation --- (Tamamen geri yüklendi)
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    currentLevel = levelNumber;
    saveGame(currentLevel); // Yeni seviyeyi kaydet
    level1Passed = (currentLevel > 1); // level1Passed durumunu güncelle
    if(levelNumber === 2) level2Attempts = 5; // Seviye 2'ye geçerken deneme hakkını sıfırla (localStorage'dan yüklenmeden önce) - veya loadGame'de hallet? loadGame'de hallediliyor.
    displayLevel(currentLevel); // Yeni seviyeyi göster
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame); // Sayfa yüklenince oyunu başlat
