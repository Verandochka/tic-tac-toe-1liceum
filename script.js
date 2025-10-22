const cells = document.querySelectorAll('[data-cell]');
const winnerMessage = document.getElementById('winnerMessage');
const winnerText = document.getElementById('winner');
const restartButton = document.getElementById('restartButton');
const friendModeButton = document.getElementById('friendMode');
const computerModeButton = document.getElementById('computerMode');

let isCircleTurn = false;
let isComputerMode = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    isCircleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('circle');
        cell.classList.remove('taken');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    winnerMessage.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = isComputerMode ? 'x' : isCircleTurn ? 'circle' : 'x';
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        if (isComputerMode && currentClass === 'x') {
            computerMove();
        } else {
            swapTurns();
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.classList.add('taken');
}

function swapTurns() {
    isCircleTurn = !isCircleTurn;
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('circle');
    });
}

function endGame(draw) {
    if (draw) {
        winnerText.innerText = 'Draw!'; // Відображення нічиї
    } else {
        if (isComputerMode) {
            // Перевірка, хто переміг у режимі комп'ютера
            winnerText.innerText =`${isCircleTurn ? "O's" : "X's"} Win!`;
        } else {
            // Стандартне повідомлення для гри з другом
            winnerText.innerText = `${isCircleTurn ? "O's" : "X's"} Win!`;
        }
    }
    winnerMessage.classList.add('show');
}

function computerMove() {
    // Перевірка, чи можна заблокувати хід гравця
    const blockingCell = findBlockingCell('x');
    if (blockingCell) {
        placeMark(blockingCell, 'circle');
        if (checkWin('circle')) {
            endGame(false); // Виправлено: правильне повідомлення про перемогу комп'ютера
        } else if (isDraw()) {
            endGame(true);
        }
        return;
    }

    // Якщо блокування неможливе, робимо випадковий хід
    const availableCells = [...cells].filter(cell => !cell.classList.contains('taken'));
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, 'circle');
    if (checkWin('circle')) {
        endGame(false); // Виправлено: правильне повідомлення про перемогу комп'ютера
    } else if (isDraw()) {
        endGame(true);
    }
}

function findBlockingCell(playerClass) {
    for (const combination of winningCombinations) {
        const playerCells = combination.filter(index => cells[index].classList.contains(playerClass));
        const emptyCells = combination.filter(index => !cells[index].classList.contains('taken'));
        if (playerCells.length === 2 && emptyCells.length === 1) {
            return cells[emptyCells[0]]; // Повертаємо клітинку, яку потрібно заблокувати
        }
    }
    return null; // Якщо блокування неможливе
}

friendModeButton.addEventListener('click', () => {
    isComputerMode = false;
    startGame();
});

computerModeButton.addEventListener('click', () => {
    isComputerMode = true;
    startGame();
});

restartButton.addEventListener('click', startGame);

startGame();