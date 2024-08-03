let menuItems = [];
fetch('menu_items.json')
    .then(response => response.json())
    .then(data => {
        console.log("Data loaded from JSON:", data);
        menuItems = data;
    })
    .catch(error => console.error('Error loading menu items:', error));

const sectionSelect = document.getElementById('section-select');
const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const selectionContainer = document.getElementById('selection-container');
const foodImage = document.getElementById('food-image');
const foodInput = document.getElementById('food-input');
const submitBtn = document.getElementById('submit-btn');
const result = document.getElementById('result');

let currentItems = [];
let currentIndex = 0;
let awaitingNext = false;

startBtn.addEventListener('click', () => {
    filterItems();
    if (currentItems.length > 0) {
        selectionContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        displayNextItem();
    } else {
        result.textContent = 'No items in this section.';
    }
});

function filterItems() {
    const selectedSection = sectionSelect.value;
    console.log("Selected section:", selectedSection);
    currentItems = selectedSection === 'all' ? menuItems : menuItems.filter(item => item.section === selectedSection);
    console.log("Filtered items:", currentItems);
}

function normalizeString(str) {
    return str.replace(/&/g, 'and').toLowerCase().trim();
}

function displayNextItem() {
    if (currentItems.length === 0) {
        result.textContent = 'You have answered all items correctly! Returning to main menu...';
        setTimeout(() => {
            quizContainer.style.display = 'none';
            selectionContainer.style.display = 'block';
            result.textContent = '';
        }, 2000);
        return;
    }
    currentIndex = Math.floor(Math.random() * currentItems.length);
    const currentItem = currentItems[currentIndex];
    console.log("Displaying item:", currentItem);
    foodImage.src = currentItem.imageUrl;
    console.log("Image URL:", currentItem.imageUrl);
    foodInput.value = '';
    result.textContent = '';
    awaitingNext = false;
    submitBtn.textContent = 'Submit';
    foodInput.style.color = 'black';
}

submitBtn.addEventListener('click', handleSubmission);
foodInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSubmission();
    }
});

function handleSubmission() {
    if (awaitingNext) {
        displayNextItem();
        return;
    }
    const userGuess = normalizeString(foodInput.value);
    const correctAnswer = normalizeString(currentItems[currentIndex].name);
    console.log("User guess:", `"${userGuess}"`);
    console.log("Correct answer:", `"${correctAnswer}"`);
    if (userGuess === correctAnswer) {
        result.textContent = 'Correct!';
        result.style.color = 'green';
        currentItems.splice(currentIndex, 1); //Remove the correctly answered item
        if (currentItems.length === 0) {
            result.textContent = 'You have answered all items correctly! Returning to main menu...';
            setTimeout(() => {
                quizContainer.style.display = 'none';
                selectionContainer.style.display = 'block';
                result.textContent = '';
            }, 2000);
            return;
        }
        setTimeout(displayNextItem, 2000);
    } else {
        result.textContent = `Try Again! The correct answer was: ${currentItems[currentIndex].name}`;
        result.style.color = 'red';
        submitBtn.textContent = 'Next';
        foodInput.style.color = 'black';
        awaitingNext = true;
    }
}
