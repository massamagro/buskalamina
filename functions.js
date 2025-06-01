console.log("functions.js loaded");
const reset = document.getElementById("reset-button");
const board = document.getElementById("board");
const title = document.getElementById("title");

const columnsN = 10;
const rowsN = columnsN;
const bombsN = columnsN * 1.5;
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
            cell.addEventListener("contextmenu", () => {
                if (cellObj.isDiscovered) return;
                cellObj.isFlag = !cellObj.isFlag;
                cell.innerHTML = cellObj.isFlag ? flag : "";
                cell.style.backgroundColor = cellObj.isFlag ? flagColor : "";                
            });
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
        }
    }
    cells.forEach(cell => {
        cell.element.addEventListener("click", () => {
            if (cell.isBomb) {
                showBombs();
                title.innerHTML = "you exploded";
                disableBoard();
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

    cellToCheck.element.style.backgroundColor = discoveredColor;
    if (bombs > 0){
        cellToCheck.element.innerHTML = bombs;
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

function checkWin() {
    let win = cells.every(cell => cell.isDiscovered || cell.isBomb);
    console.log("cells", cells);
    cells.forEach((cell, index) => {
        console.log(`Cell ${index}: isDiscovered = ${cell.isDiscovered}`);
    });

    return win;

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
            //debugging
            cell.element.innerHTML = bomb;

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