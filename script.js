const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const modeRadios = document.querySelectorAll('input[name="mode"]');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp"; // "pvp" or "cpu"

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.textContent = cell;
    cellElement.addEventListener("click", handleCellClick);
    boardElement.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (mode === "cpu" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function checkWin() {
  return winConditions.some(condition => {
    const [a, b, c] = condition;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function computerMove() {
  if (!gameActive) return;

  let available = board
    .map((cell, i) => (cell === "" ? i : null))
    .filter(i => i !== null);

  let move = available[Math.floor(Math.random() * available.length)];
  board[move] = "O";
  createBoard();

  if (checkWin()) {
    statusText.textContent = `Computer wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

modeRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    mode = e.target.value;
    restartGame();
  });
});

restartButton.addEventListener("click", restartGame);

createBoard();
