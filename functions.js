console.log("functions.js loaded");

const columnsN = 10;
const rowsN = 10;
const bomb = "💣";
const flag = "🚩";

const board = document.getElementById("board");

createBoard();

function createBoard(){
    board.innerHTML = ""; // Clear existing content
    board.innerHTML = `<table>`
for (let i = 0; i < rowsN; i++) {
    let row = document.createElement("tr");
    row.id = `tr-${i}`;
    
    board.appendChild(row);
    for (let j = 0; j < columnsN; j++) {
        const cell = document.createElement("td");
        cell.id = `cell-${i}-${j}`;
        cell.addEventListener("click", () => {
            console.log(`Cell clicked: ${cell.id}`);
        });
        cell.innerHTML = bomb;
        row.appendChild(cell);
    }
    board.appendChild(row);
    console.log("board", board);
}
}
