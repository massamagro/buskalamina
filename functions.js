console.log("functions.js loaded");
const reset = document.getElementById("reset-button");

const columnsN = 10;
const rowsN = 10;
const bombsN = 10;
const bomb = "💣";
const flag = "🚩";
let cells = [];

const board = document.getElementById("board");


createBoard();
reset.addEventListener("click", () => {
    createBoard();
});

function createBoard() {
    board.innerHTML = "";
    let availableBombs = bombsN;
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
                console.log(`Cell clicked: ${cell.id}`);
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
    while (availableBombs > 0) {
        let row = Math.floor(Math.random() * 10);
        let column = Math.floor(Math.random() * 10);
        const cell = cells.find(c => c.row === row && c.column === column);
        if (!cell.isBomb) {
            cell.isBomb = true;
            availableBombs--;
            //debugging
            cell.element.innerHTML = bomb;
        }
    }
    cells.forEach(cell => {
        cell.element.addEventListener("click", () => {
            if (cell.isBomb) {
                alert("BOOM");
            } else {
                checkBombsAround(cell)
            }
            console.log(cells);
        });
    });

}



function checkBombsAround(cellToCheck) {
    if (cellToCheck.isDiscovered) return;
    cellToCheck.isDiscovered = true;
    if (checkWin()) {
        alert("nice!");
        return;
    }    
    let anyBomb = false;
    let bombs = 0;
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
            bombs++;

        }
    })

    cellToCheck.element.style.backgroundColor = "lightgreen";
    if (bombs > 0) cellToCheck.element.innerHTML = bombs;

    if (!anyBomb) {
        aroundCells.forEach(aroundCell => checkBombsAround(aroundCell));
    }
}

function checkWin() {
    let win = cells.every(cell => cell.isDiscovered || cell.isBomb);
    console.log("cells", cells);
    cells.forEach((cell, index) => {
        console.log(`Cell ${index}: isDiscovered = ${cell.isDiscovered}`);
    });

    return win;

}

