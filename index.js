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

    // Инициализация
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

    // Генерация секретного числа
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

    // Проверка числа игрока
    function checkGuess(guess) {
        let bulls = 0;
        let cows = 0;
        let bullsDigits = [];
        let cowsDigits = [];

        for (let i = 0; i < 5; i++) {
            if (guess[i] === secretNumber[i]) {
                bulls++;
                bullsDigits.push(guess[i]);
            } else if (secretNumber.includes(guess[i])) {
                cows++;
                cowsDigits.push(guess[i]);
            }
        }

        return {
            bulls: bulls,
            cows: cows,
            bullsDigits: bullsDigits.join(', ') || 'нет',
            cowsDigits: cowsDigits.join(', ') || 'нет'
        };
    }

    // Добавление хода в таблицу
    function addMoveToTable(moveNumber, guess, result) {
        const row = document.createElement('tr');

        const moveCell = document.createElement('td');
        moveCell.textContent = moveNumber;

        const guessCell = document.createElement('td');
        guessCell.textContent = guess;

        const bullsCell = document.createElement('td');
        bullsCell.textContent = result.bullsDigits;

        const cowsCell = document.createElement('td');
        cowsCell.textContent = result.cowsDigits;

        row.appendChild(moveCell);
        row.appendChild(guessCell);
        row.appendChild(bullsCell);
        row.appendChild(cowsCell);

        movesTableBody.appendChild(row);
    }

    // Обработчик отправки числа
    submitButton.addEventListener('click', function () {
        if (gameOver) return;

        const guess = guessInput.value.trim();

        // Проверка ввода
        if (guess.length !== 5 || !/^\d+$/.test(guess)) {
            alert('Пожалуйста, введите ровно 5 цифр!');
            return;
        }

        // Проверка на повторяющиеся цифры
        const uniqueDigits = new Set(guess.split(''));
        if (uniqueDigits.size !== 5) {
            alert('Все цифры должны быть разными!');
            return;
        }

        // Проверка числа
        const result = checkGuess(guess);
        moves.push({ guess: guess, result: result });
        addMoveToTable(moves.length, guess, result);

        
        // Проверка на победу
        if (result.bulls === 5) {
            gameOver = true;
            messageDiv.innerHTML = '<div class="win-message">Поздравляем! Вы угадали число!</div>';
            secretNumberDiv.style.display = 'block';
            toggleNumberButton.textContent = 'Скрыть число';
        }
        // Проверка на проигрыш
        else if (moves.length >= 10) {
            gameOver = true;
            messageDiv.innerHTML = `<div class="lose-message">Игра окончена! Загаданное число: ${secretNumber}</div>`;
            secretNumberDiv.style.display = 'block';
            toggleNumberButton.textContent = 'Скрыть число';
        }

        // Очистка поля ввода
        guessInput.value = '';
    });

    // Кнопка показа/скрытия числа
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

    // Кнопка новой игры
    restartButton.addEventListener('click', initGame);

    // Кнопки цифр
    digitButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (guessInput.value.length < 5) {
                guessInput.value += button.getAttribute('data-digit');
            }
        });
    });

    // Кнопка очистки
    clearInputButton.addEventListener('click', function () {
        guessInput.value = '';
    });

    // Ограничение ввода только цифрами
    guessInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d]/g, '');
        if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
        }
    });

    // Обработка нажатия Enter
    guessInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });

    // Начальная инициализация игры
    initGame();
});