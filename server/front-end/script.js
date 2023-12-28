const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const X_ICON = 'x';
const O_ICON = 'o';
const EMPTY_ICON = '-';

const cellSize = 100;
const margin = cellSize/10;
canvas.width = (cellSize*3 + margin*2);
canvas.height = (cellSize*3 + margin*2);

function drawBoard(){
    ctx.beginPath();
    ctx.moveTo(margin + cellSize, margin);
    ctx.lineTo(margin + cellSize, margin + cellSize*3);
    ctx.moveTo(margin + cellSize*2, margin);
    ctx.lineTo(margin + cellSize*2, margin + cellSize*3);
    ctx.moveTo(margin, margin + cellSize);
    ctx.lineTo(margin + cellSize*3, margin + cellSize);
    ctx.moveTo(margin, margin + cellSize*2);
    ctx.lineTo(margin + cellSize*3, margin + cellSize*2);
    ctx.stroke();
}

function drawX(x, y){
    const size = (cellSize/2) - margin;
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
}

function drawO(x, y){
    const radius = (cellSize/2) - margin;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.stroke();
}

function drawIcon(icon, row, col){
    let x = margin + cellSize/2 + col * cellSize;
    let y = margin + cellSize/2 + row * cellSize;
    switch(icon){
        case X_ICON:
            drawX(x, y);
            break;
        case O_ICON:
            drawO(x, y);
            break;
    }
}

let currentIcon = X_ICON;

let gamestate = new Array(9).fill(EMPTY_ICON);

async function setIcon(icon, row, col){
    let pos = (row*3) + col;
    await $.ajax({
        url: "/move?icon=" + icon + "&pos=" + pos,
        method: "GET"
    })
}

function getIcon(row, col){
    return gamestate[(row*3) + col];
}

function drawGameState(){
    for (let row=0; row < 3; row++){
        for (let col=0; col < 3; col++){
            drawIcon(getIcon(row, col), row, col);
        }
    }
}

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawGameState();
}

async function updateGameState(){
    gamestate = await $.ajax({
        url: "/gamestate",
        method: "GET"
    })
}

canvas.addEventListener('click', async (event) => {
    let x = event.offsetX;
    let y = event.offsetY;

    let col = Math.floor((x - margin)/cellSize);
    let row = Math.floor((y - margin)/cellSize);

    if (col < 0 || col > 2 || row < 0 || row > 2) {
        return;
    }
    if (getIcon(row, col) != EMPTY_ICON){
        return;
    }
    await setIcon(currentIcon, row, col);
    await updateGameState();
    render();
    if (currentIcon == X_ICON){
        currentIcon = O_ICON;
    } else {
        currentIcon = X_ICON;
    }
});

updateGameState().then(render);