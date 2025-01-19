let currentPlayer = 'player1'; // 'player1' ve 'player2' olacak
let gameBoard = [];
let roomCode = '';

function createRoom() {
    roomCode = generateRoomCode();
    alert('Oda Kodu: ' + roomCode);
    document.getElementById('roomCode').value = roomCode;
    initializeBoard();
    document.getElementById('createRoomBtn').disabled = true;
    document.getElementById('joinRoomBtn').disabled = true;
}

function joinRoom() {
    const enteredRoomCode = document.getElementById('roomCode').value;
    if (enteredRoomCode === roomCode) {
        alert('Odaya katıldınız: ' + enteredRoomCode);
        initializeBoard();
    } else {
        alert('Geçersiz oda kodu!');
    }
}

function generateRoomCode() {
    const code = Math.floor(Math.random() * 90000) + 10000;
    return code;
}

function initializeBoard() {
    gameBoard = [];
    const boardElement = document.getElementById('gameBoard');
    const table = document.createElement('table');

    for (let row = 0; row < 5; row++) {
        const tr = document.createElement('tr');
        gameBoard[row] = [];
        for (let col = 0; col < 5; col++) {
            const td = document.createElement('td');
            td.setAttribute('data-row', row);
            td.setAttribute('data-col', col);
            td.onclick = () => makeMove(row, col);
            td.innerText = '';
            tr.appendChild(td);
            gameBoard[row][col] = td;
        }
        table.appendChild(tr);
    }

    boardElement.innerHTML = '';
    boardElement.appendChild(table);
}

function makeMove(row, col) {
    const cell = gameBoard[row][col];

    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        alert('Bu hücre zaten seçildi!');
        return;
    }

    if (currentPlayer === 'player1') {
        cell.classList.add('hit');
        currentPlayer = 'player2';
    } else {
        cell.classList.add('miss');
        currentPlayer = 'player1';
    }

    updateMessage(`Sıra ${currentPlayer} oyuncusunda.`);
}

function updateMessage(message) {
    const messageDiv = document.getElementById('messages');
    messageDiv.innerHTML = message;
}
