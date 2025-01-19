const socket = io('https://glacial-thicket-72816.herokuapp.com'); // Backend URL

let currentPlayer = 'player1';
let gameBoard = [];
let roomCode = '';

// Oda oluşturma
function createRoom() {
    fetch('https://glacial-thicket-72816.herokuapp.com/create-room', {  // Backend'e istek
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        roomCode = data.roomCode;
        alert('Oda Kodu: ' + roomCode);
        document.getElementById('roomCode').value = roomCode;
        initializeBoard();
        document.getElementById('createRoomBtn').disabled = true;
        document.getElementById('joinRoomBtn').disabled = true;
    })
    .catch(error => console.error('Oda oluşturma hatası:', error));
}

// Odaya katılma
function joinRoom() {
    const enteredRoomCode = document.getElementById('roomCode').value;
    fetch('https://glacial-thicket-72816.herokuapp.com/join-room', {  // Backend'e istek
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode: enteredRoomCode }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Odaya katıldınız') {
            alert('Odaya katıldınız: ' + enteredRoomCode);
            initializeBoard();
        } else {
            alert('Geçersiz oda kodu!');
        }
    })
    .catch(error => console.error('Odaya katılma hatası:', error));
}

// Oyun tahtasını başlatma
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

// Hamle yapma
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

    // Backend'e hamle gönder
    socket.emit('move', { roomCode, row, col, player: currentPlayer });
}

// Mesaj güncelleme
function updateMessage(message) {
    const messageDiv = document.getElementById('messages');
    messageDiv.innerHTML = message;
}

// Oyun başladığında oyuncuları duyur
socket.on('start-game', (data) => {
    alert('Oyun başladı!');
    document.getElementById('players').innerText = `Oyuncular: ${data.players.join(', ')}`;
});

// Rakip oyuncu hareket yaptı
socket.on('opponentMove', (moveData) => {
    makeMove(moveData.row, moveData.col, 'opponent'); // Rakip hareketini işleme
});
