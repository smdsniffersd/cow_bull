document.addEventListener('DOMContentLoaded', function () {
    const guessInput = document.getElementById('guessInput');
    const submitButton = document.getElementById('submitGuess');
    const toggleNumberButton = document.getElementById('toggleNumber');
    const restartButton = document.getElementById('restartGame');
    const secretNumberDiv = document.getElementById('secretNumber');
    const movesTableBody = document.getElementById('movesTableBody');
    const messageDiv = document.getElementById('message');
    const digitButtons = document.querySelectorAll('.digit-button');
    const clearInputButton = document.getElementById('clearInput');

    let secretNumber;
    let moves;
    let gameOver;

    function initGame() {
        secretNumber = generateSecretNumber();
        moves = [];
        gameOver = false;
        movesTableBody.innerHTML = '';
        messageDiv.innerHTML = '';
        secretNumberDiv.style.display = 'none';
        toggleNumberButton.textContent = 'Показать число';
        guessInput.value = '';
        guessInput.focus();
    }

    function generateSecretNumber() {
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let result = '';

        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            result += digits[randomIndex];
            digits.splice(randomIndex, 1);
        }

        return result;
    }

    function checkGuess(guess) {
        let bulls = 0;
        let cows = 0;

        for (let i = 0; i < 5; i++) {
            if (guess[i] === secretNumber[i]) {
                bulls++;
            } else if (secretNumber.includes(guess[i])) {
                cows++;
            }
        }

        return {
            bulls: bulls,
            cows: cows
        };
    }

    function addMoveToTable(moveNumber, guess, result) {
        const row = document.createElement('tr');

        const moveCell = document.createElement('td');
        moveCell.textContent = moveNumber;

        const guessCell = document.createElement('td');
        guessCell.textContent = guess;

        const bullsCell = document.createElement('td');
        bullsCell.textContent = result.bulls;

        const cowsCell = document.createElement('td');
        cowsCell.textContent = result.cows;

        row.appendChild(moveCell);
        row.appendChild(guessCell);
        row.appendChild(bullsCell);
        row.appendChild(cowsCell);

        movesTableBody.appendChild(row);
    }

    submitButton.addEventListener('click', function () {
        if (gameOver) return;

        const guess = guessInput.value.trim();

        // Проверка ввода
        if (guess.length !== 5 || !/^\d+$/.test(guess)) {
            alert('Пожалуйста, введите ровно 5 цифр!');
            return;
        }

        const uniqueDigits = new Set(guess.split(''));
        if (uniqueDigits.size !== 5) {
            alert('Все цифры должны быть разными!');
            return;
        }

        const result = checkGuess(guess);
        moves.push({ guess: guess, result: result });
        addMoveToTable(moves.length, guess, result);

        if (result.bulls === 5) {
            gameOver = true;
            messageDiv.innerHTML = '<div class="win-message">Поздравляем! Вы угадали число!</div>';
            secretNumberDiv.style.display = 'block';
            toggleNumberButton.textContent = 'Скрыть число';
        }
        else if (moves.length >= 10) {
            gameOver = true;
            messageDiv.innerHTML = `<div class="lose-message">Игра окончена! Загаданное число: ${secretNumber}</div>`;
            secretNumberDiv.style.display = 'block';
            toggleNumberButton.textContent = 'Скрыть число';
        }

        guessInput.value = '';
    });

    toggleNumberButton.addEventListener('click', function () {
        if (secretNumberDiv.style.display === 'none' || secretNumberDiv.style.display === '') {
            secretNumberDiv.textContent = `Загаданное число: ${secretNumber}`;
            secretNumberDiv.style.display = 'block';
            toggleNumberButton.textContent = 'Скрыть число';
        } else {
            secretNumberDiv.style.display = 'none';
            toggleNumberButton.textContent = 'Показать число';
        }
    });

    restartButton.addEventListener('click', initGame);

    digitButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (guessInput.value.length < 5) {
                guessInput.value += button.getAttribute('data-digit');
            }
        });
    });

    clearInputButton.addEventListener('click', function () {
        guessInput.value = '';
    });

    guessInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d]/g, '');
        if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
        }
    });

    guessInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });


    initGame();
});