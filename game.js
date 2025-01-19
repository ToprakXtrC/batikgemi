let currentPlayer = 'player1'; // İlk başta player1 başlar
let gameBoard = [];
let isGameOver = false;

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
    if (isGameOver) {
        return;
    }

    const cell = gameBoard[row][col];

    // Zaten vurulmuş olan hücreyi tekrar seçemezsin
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        alert('Bu hücre zaten seçildi!');
        return;
    }

    // Hamle yapma
    if (currentPlayer === 'player1') {
        cell.classList.add('hit');
        currentPlayer = 'player2';
        updateGameInfo('Sıra player2\'de.');
    } else {
        cell.classList.add('miss');
        currentPlayer = 'player1';
        updateGameInfo('Sıra player1\'de.');
    }
}

function updateGameInfo(message) {
    document.getElementById('messages').innerText = message;
    document.getElementById('playerTurn').innerText = `Şu an oynayan oyuncu: ${currentPlayer}`;
}

function endTurn() {
    // Burada tur bitirme işlemleri yapılabilir
    // Şu an için sadece oyuncunun sırasını değiştireceğiz.
    if (currentPlayer === 'player1') {
        currentPlayer = 'player2';
    } else {
        currentPlayer = 'player1';
    }

    updateGameInfo(`Sıra ${currentPlayer} oyuncusunda.`);
}

// Oyunu başlat
initializeBoard();
updateGameInfo(`Sıra ${currentPlayer} oyuncusunda.`);
// Socket.IO server bağlantısı
const socket = io('http://localhost:3000');

// Oda oluşturulursa
function createRoom() {
    const roomCode = generateRoomCode();
    socket.emit('createRoom', roomCode);
}

// Odaya katılma
function joinRoom(roomCode) {
    socket.emit('joinRoom', roomCode);
}

// Oda kodu üretme (rastgele 5 haneli kod)
function generateRoomCode() {
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += Math.floor(Math.random() * 10); // 0-9 arasında rastgele sayı
    }
    return code;
}

// Hamle yapma
function makeMove(row, col) {
    const move = { row, col };
    socket.emit('makeMove', roomCode, move); // Hamleyi sunucuya gönder
}

// Oda oluşturulursa
socket.on('roomCreated', (roomCode) => {
    console.log('Oda kodu: ' + roomCode);
    alert('Oda oluşturuldu! Oda kodu: ' + roomCode);
});

// Odaya katıldığında
socket.on('gameStarted', (message) => {
    alert(message);
});

// Hamle yapıldığında
socket.on('moveMade', (move) => {
    console.log('Hamle yapıldı: ', move);
    // Hamleyi tahtada görsel olarak güncelle
});

// Hata durumunda
socket.on('error', (message) => {
    alert(message);
});
