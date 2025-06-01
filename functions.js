const reset = document.getElementById("reset-button");
const board = document.getElementById("board");
const title = document.getElementById("title");

const columnsN = 10;
const rowsN = columnsN;
const bomb = "💣";
const flag = "🚩";
let cells = [];

const discoveredColor = "#7ecc94";
const undiscoveredColor = "#32a852";
const flagColor = "#f0ad4e";


createBoard();

reset.addEventListener("click", () => {
    createBoard();
});

function createBoard() {
    enableBoard();
    board.innerHTML = "";
    title.innerHTML = "buskalamina";
    cells = [];
    board.innerHTML = `<table>`
    for (let i = 0; i < rowsN; i++) {
        let row = document.createElement("tr");
        row.id = `tr-${i}`;
        board.appendChild(row);
        for (let j = 0; j < columnsN; j++) {
            const cell = document.createElement("td");
            cell.id = `row${i}column${j}`;
            cell.addEventListener("click", () => {
            });
            row.appendChild(cell);
            const cellObj = {
                element: cell,
                row: i,
                column: j,
                isBomb: false,
                isFlag: false,
                isDiscovered: false
            };
            cells.push(cellObj);
            
        }
        board.appendChild(row);

    }
    placeBombs();
    setCellListeners();
}

function checkBombsAround(cellToCheck) {
    if (cellToCheck.isDiscovered) return;
    cellToCheck.isDiscovered = true;
      
    let anyBomb = false;
    let aroundBombs = 0;
    const aroundCells = [];

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
        const newRow = cellToCheck.row + dx;
        const newCol = cellToCheck.column + dy;

        if (newRow >= 0 && newCol >= 0) {
            const neighbor = cells.find(c => c.row === newRow && c.column === newCol);
            if (neighbor) aroundCells.push(neighbor);
        }
    });

    aroundCells.forEach(aroundCell => {
        if (aroundCell.isBomb) {
            anyBomb = true;
            aroundBombs++;

        }
    })

    cellToCheck.element.style.backgroundColor = discoveredColor;
    if (aroundBombs > 0){
        cellToCheck.element.innerHTML = aroundBombs;
    } else {
            cellToCheck.element.style.backgroundColor = undiscoveredColor;
    }

    if (!anyBomb) {
        aroundCells.forEach(aroundCell => checkBombsAround(aroundCell));
    }
    if (checkWin()) {
        title.innerHTML = "well done";
        disableBoard();
        return;
    }  
}
function placeBombs() {
    availableBombs = columnsN * 1.5;
    while (availableBombs > 0) {
        let row = Math.floor(Math.random() * 10);
        let column = Math.floor(Math.random() * 10);
        const cell = cells.find(c => c.row === row && c.column === column);
        if (!cell.isBomb) {
            cell.isBomb = true;
            availableBombs--;
        }
    }
}

function setCellListeners() {
    cells.forEach(cell => {
        cell.element.addEventListener("click", () => {
            if (cell.isBomb) {
                showBombs();
                title.innerHTML = "you exploded";
                disableBoard();
            } else {
                checkBombsAround(cell)
            }
        });
        cell.element.addEventListener("contextmenu", () => {
            if (cell.isDiscovered) return;
            cell.isFlag = !cell.isFlag;
            cell.element.innerHTML = cell.isFlag ? flag : "";
            cell.element.style.backgroundColor = cell.isFlag ? flagColor : "";
        });
    });
}

function checkWin() {
    return cells.every(cell => cell.isDiscovered || cell.isBomb);
}

function disableBoard(){
    board.style.pointerEvents = "none";
}

function enableBoard(){
    board.style.pointerEvents = "auto";
    board.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
}

function disableCell(cell) {
    cell.element.style.pointerEvents = "none";
}

function enableCell(cell) {
    cell.element.style.pointerEvents = "auto";
}

function showBombs() {
    cells.forEach(cell => {
        if (cell.isBomb) {
            cell.element.innerHTML = bomb;
        }
    });
}