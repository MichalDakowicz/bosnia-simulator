const gridSize = 40; // Rozmiar planszy
const numMines = 150; // Ilość min

console.log(map);

let board = []; // Tablica reprezentująca planszę
let mines = []; // Pozycje min
let revealedCells = 0; // Liczba odkrytych pól
let gameOver = false; // Czy gra się skończyła

// Tworzenie planszy
const gameBoard = document.getElementById("gameBoard");
for (let i = 0; i < gridSize; i++) {
    let row = [];
    let tr = document.createElement("tr");
    for (let j = 0; j < gridSize; j++) {
        let td = document.createElement("td");
        td.classList.add("hidden");
        td.addEventListener("click", (event) => {
            event.preventDefault();
            handleClick(i, j);
        });
        td.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            handleRightClick(i, j);
        });
        td.addEventListener("mousedown", (event) => {
            if (event.button === 2) {
                event.preventDefault();
                handleHoldClick(i, j);
            }
        });
        if (map[i * gridSize + j] === "Y") {
            tr.appendChild(td);
            row.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            });
        } else {
            td.classList.add("transparent");
            tr.appendChild(td);
            row.push({
                isMine: false,
                isRevealed: true,
                isFlagged: false,
                adjacentMines: 0,
            });
            td.style.backgroundColor = "white";
            td.style.border = "0px";
        }
    }
    gameBoard.appendChild(tr);
    board.push(row);
}

// Losowe rozmieszczenie min
while (mines.length < numMines) {
    let i = Math.floor(Math.random() * gridSize);
    let j = Math.floor(Math.random() * gridSize);
    if (!board[i][j].isMine) {
        if (!board[i][j].isRevealed) {
            board[i][j].isMine = true;
            mines.push({ i, j });
        }
    }
}

// Obliczanie liczby min w sąsiedztwie
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        if (!board[i][j].isMine) {
            board[i][j].adjacentMines = countAdjacentMines(i, j);
        }
    }
}

// Obsługa kliknięcia na pole
function handleClick(i, j) {
    if (gameOver) return;
    if (board[i][j].isRevealed || board[i][j].isFlagged) return;

    if (board[i][j].isMine) {
        gameOver = true;
        revealAllMines();
        alert("Przegrałeś!");
    } else {
        revealCell(i, j);
        if (revealedCells === gridSize * gridSize - numMines) {
            gameOver = true;
            alert("Wygrałeś!");
        }
    }
}

// Obsługa kliknięcia prawym przyciskiem myszy
function handleRightClick(i, j) {
    if (gameOver || board[i][j].isRevealed) return;

    board[i][j].isFlagged = !board[i][j].isFlagged;
    let cell = gameBoard.rows[i].cells[j];

    if (board[i][j].isFlagged) {
        cell.classList.add("flag");
    } else {
        cell.classList.remove("flag");
    }
}

// Obsługa przytrzymania przycisku myszy do postawnienia flagi
function handleHoldClick(i, j) {
    if (gameOver || board[i][j].isRevealed) return;

    board[i][j].isFlagged = true;
    let cell = gameBoard.rows[i].cells[j];
    cell.classList.add("flag");
}

// Odkrywanie pola
function revealCell(i, j) {
    if (
        i < 0 ||
        i >= gridSize ||
        j < 0 ||
        j >= gridSize ||
        board[i][j].isRevealed
    )
        return;

    board[i][j].isRevealed = true;
    revealedCells++;

    let cell = gameBoard.rows[i].cells[j];
    cell.classList.remove("hidden");
    cell.classList.add("revealed");

    if (board[i][j].adjacentMines > 0) {
        cell.classList.add(`n${board[i][j].adjacentMines}`);
        cell.textContent = board[i][j].adjacentMines;
    } else {
        // Rekursywne odkrywanie pustych pól
        revealCell(i - 1, j - 1);
        revealCell(i - 1, j);
        revealCell(i - 1, j + 1);
        revealCell(i, j - 1);
        revealCell(i, j + 1);
        revealCell(i + 1, j - 1);
        revealCell(i + 1, j);
        revealCell(i + 1, j + 1);
    }
}

// Odkrywanie wszystkich min
function revealAllMines() {
    for (let mine of mines) {
        let cell = gameBoard.rows[mine.i].cells[mine.j];
        cell.classList.remove("hidden");
        cell.classList.add("mine");
    }
}

// Liczenie min w sąsiedztwie
function countAdjacentMines(i, j) {
    let count = 0;
    for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
            if (
                x >= 0 &&
                x < gridSize &&
                y >= 0 &&
                y < gridSize &&
                board[x][y].isMine
            ) {
                count++;
            }
        }
    }
    return count;
}
