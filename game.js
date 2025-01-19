const socket = io('https://glacial-thicket-72816.herokuapp.com'); // Backend URL
let currentPlayer = '';
let gameBoard = [];
let roomCode = '';

// Oda oluşturma
function createRoom() {
    fetch('https://glacial-thicket-72816.herokuapp.com/create-room', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
            roomCode = data.roomCode;
            alert(`Oda kodunuz: ${roomCode}`);
            document.getElementById('roomCode').value = roomCode;
            currentPlayer = 'player1';
            initializeBoard();
        })
        .catch((error) => console.error('Oda oluşturma hatası:', error));
}

// Odaya katılma
function joinRoom() {
    const enteredRoomCode = document.getElementById('roomCode').value;

    if (!enteredRoomCode) {
        alert('Lütfen geçerli bir oda kodu girin!');
        return;
    }

    fetch('https://glacial-thicket-72816.herokuapp.com/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: enteredRoomCode, player: 'player2' }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Odaya katıldınız') {
                alert('Odaya başarıyla katıldınız: ' + enteredRoomCode);
                roomCode = enteredRoomCode;
                currentPlayer = 'player2';
                initializeBoard();
            } else {
                alert(data.message);
            }
        })
        .catch((error) => console.error('Odaya katılma hatası:', error));
}

// Oyun tahtası
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

// Hamle
function makeMove(row, col) {
    const cell = gameBoard[row][col];
    if (cell.innerText) {
        alert('Bu hücre zaten seçildi!');
        return;
    }

    cell.innerText = currentPlayer === 'player1' ? 'X' : 'O';
    socket.emit('move', { roomCode, row, col, player: currentPlayer });
}

// Rakip hamle
socket.on('opponentMove', ({ row, col, player }) => {
    const cell = gameBoard[row][col];
    cell.innerText = player === 'player1' ? 'X' : 'O';
});
