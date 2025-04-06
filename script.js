// Top-level script execution starts here
console.log("Kyros's Prophet Mechanism script loaded!");

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false; // Specific state for level 1 logic
let lastSymbolClicked = null; // State for level 1 logic

// --- DOM References (will be updated by displayLevel) ---
let triangleButton, squareButton, circleButton, indicator, mechanismDiv;

// --- Core Functions ---

function saveGame(level) {
    try {
        localStorage.setItem('kyrosMechanismLevel', level);
        console.log(`Game saved at level: ${level}`);
    } catch (e) {
        console.error("Could not save game state!", e);
        alert("Warning: Could not save game progress. Your progress may be lost if you close this window.");
    }
}

function loadGame() {
    try {
        const savedLevel = localStorage.getItem('kyrosMechanismLevel');
        if (savedLevel) {
            currentLevel = parseInt(savedLevel, 10); // Convert string from localStorage to number
            console.log(`Game loaded at level: ${currentLevel}`);
        } else {
            currentLevel = 1; // Default to level 1 if nothing saved
            console.log("No saved game found, starting at Level 1.");
        }
        // Reset level-specific states when loading
        level1Passed = (currentLevel > 1); // If already past level 1, mark as passed for logic purposes
        lastSymbolClicked = null;

        displayLevel(currentLevel);
    } catch (e) {
        console.error("Could not load game state!", e);
        alert("Warning: Could not load saved game state. Starting from Level 1.");
        currentLevel = 1; // Fallback to level 1
        displayLevel(currentLevel);
    }
}

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    mechanismDiv = document.getElementById('mechanism'); // Get main container
    if (!mechanismDiv) {
        console.error("Mechanism container div not found!");
        return;
    }

    // Clear previous level content
    mechanismDiv.innerHTML = '';

     // Update main title
     const mainTitle = document.querySelector('h1');
     if(mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;

    // Set up HTML and logic for the current level
    if (levelNumber === 1) {
        // Build Level 1 HTML inside mechanismDiv
        mechanismDiv.innerHTML = `
            <div id="mechanism-symbols">
                <button id="symbol-triangle">△</button>
                <button id="symbol-square">□</button>
                <button id="symbol-circle">○</button>
            </div>
            <div id="indicator"></div>
            <p>Level 1: Discover the primary functions.</p>
        `;
        // Get references to newly created elements
        triangleButton = document.getElementById('symbol-triangle');
        squareButton = document.getElementById('symbol-square');
        circleButton = document.getElementById('symbol-circle');
        indicator = document.getElementById('indicator');

        // Re-attach event listeners for Level 1
        attachLevel1Listeners();

        // Reset level 1 state visually if needed
        updateIndicator(''); // Set default indicator color

    } else {
        // Display placeholder for Level 2 and beyond
         mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>`;
         // Future: Add a button here to reset progress back to level 1?
    }
}

function attachLevel1Listeners() {
    // Ensure elements exist before adding listeners
    if (!triangleButton || !squareButton || !circleButton || !indicator) {
        console.error("Cannot attach Level 1 listeners, elements not found.");
        return;
    }

    triangleButton.addEventListener('click', () => {
        if (currentLevel !== 1) return;
        console.log("Triangle clicked");
        updateIndicator('red');
        lastSymbolClicked = 'triangle';
    });

    squareButton.addEventListener('click', () => {
        if (currentLevel !== 1) return;
        console.log("Square clicked");
        let colorToSet = '';
        if (lastSymbolClicked === 'triangle') {
            colorToSet = 'green';
            lastSymbolClicked = null;
        } else {
            // Normal square click - Level 1 Pass Condition
            colorToSet = 'blue';
             if (!level1Passed) { // Check if not already passed
                level1Passed = true; // Mark as passed
                console.log("Level 1 Pass Condition Met!");
                 // Use setTimeout to allow color change visual before alert/level change
                updateIndicator(colorToSet); // Update color immediately
                setTimeout(() => goToLevel(2), 500); // Go to next level after a short delay
                return; // Exit early to prevent resetting lastSymbolClicked unnecessarily
            }
            lastSymbolClicked = null;
        }
        updateIndicator(colorToSet);
    });

    circleButton.addEventListener('click', () => {
        if (currentLevel !== 1) return;
        console.log("Circle clicked");
        updateIndicator(''); // Reset color
        lastSymbolClicked = null;
    });
}

function updateIndicator(color) {
    // Ensure indicator exists (might be removed in higher levels)
     indicator = document.getElementById('indicator'); // Re-select to be safe
    if (indicator) {
        indicator.style.backgroundColor = color || '#ddd'; // Use default color if '' is passed
        console.log(`Indicator color set to: ${color || 'default(#ddd)'}`);
    }
}

function goToLevel(levelNumber) {
    alert(`Congratulations! Level 1 Passed!\nMoving to Level ${levelNumber}...`); // Simple feedback
    currentLevel = levelNumber; // Update global state
    saveGame(currentLevel); // Save progress
    displayLevel(currentLevel); // Display the new level
}

// --- Initial Load ---
// Use DOMContentLoaded to make sure HTML is ready before running the script
document.addEventListener('DOMContentLoaded', loadGame);
