console.log("Kyros's Prophet Mechanism script loaded!"); // Bu satır kalsın, zararı yok.

// HTML elemanlarını seçelim
const testButton = document.getElementById('testButton');
const mechanismText = document.getElementById('mechanism-text');

// Düğmeye tıklanma olayını dinleyelim
if (testButton && mechanismText) { // Elemanların bulunduğundan emin olalım
    testButton.addEventListener('click', function() {
        // Düğmeye tıklanınca metni değiştirelim
        mechanismText.textContent = 'Button clicked! Script is working!';
        console.log("Test button clicked!"); // Konsola da yazalım (siz göremeseniz de)
    });
} else {
    console.error("Could not find button or text element!");
}
