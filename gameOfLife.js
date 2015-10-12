var kBoardWidth = 70;
var kBoardHeight= 40;
var kPieceWidth = 10;
var kPieceHeight= 10;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);
var kPixelWidth2 = 1 + (15 * kPieceWidth);
var kPixelHeight2= 1 + (50 * kPieceHeight);

var gCanvasElement;
var gDrawingContext;
var gPattern;

var gPieces;
var gMoveCount;
var gMoveCountElem;
var gGameInProgress;

var gFigureCross;
var gFigureGlider;
var dragok;
var drawing;

var intervalDrowBoard;
var intervalNextStep;

var gAddFigureCross;
var gAddFigureGlider;

function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function startGame(){
    if (gGameInProgress){
        return
    }
    if (drawing){
        startDrowing()
    }

    gGameInProgress = true;
    intervalNextStep = setInterval(nextStep, 100);
    var span = document.getElementById("gameOver");
    span.style.visibility = "hidden";
    gMoveCount = 0;
}

function endGame() {
    gGameInProgress = false;
    clearInterval(intervalNextStep);
    var span = document.getElementById("gameOver");
    span.style.visibility = "visible";
}

function startDrowing(){
    if (gGameInProgress){
        return
    }

    drawing = !drawing;
    var button = document.getElementById("startDrowing");
    if (drawing){
       button.style.backgroundColor = "#888"; 
    }
    else{
       button.style.backgroundColor = "";  
    }
}

function addFigureCross(){
    gAddFigureCross = !gAddFigureCross;
}

function addFigureGlider(){
    gAddFigureGlider = !gAddFigureGlider;
}


function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
    return cell;
}

function halmaOnClick(e) {
   if (gGameInProgress){
        return;
    }
    if (gAddFigureCross){
       var currentCell = getCursorPosition(e)
       drawFigure(gFigureCross, currentCell.row, currentCell.column);
       gAddFigureCross = false; 
       return;
    }
    if (gAddFigureGlider){
       var currentCell = getCursorPosition(e)
       drawFigure(gFigureGlider, currentCell.row, currentCell.column);
       gAddFigureGlider = false; 
       return;
    }
            
    var cell = getCursorPosition(e);
    gPieces.push(cell);
    drawBoard();

}

function drawBoard() {
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    gDrawingContext.beginPath();
    
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
	gDrawingContext.moveTo(0.5 + x, 0);
	gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
	gDrawingContext.moveTo(0, 0.5 + y);
	gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    /* draw it! */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    
    for (var i = 0; i < gPieces.length; i++) {
	drawPiece(gPieces[i]);
    }

    gMoveCountElem.innerHTML = gMoveCount;
}

function drawFigure(figure, initialRow, initialColumn){

    for (var i = 0; i < figure.length; i++){
        var cell = new Cell(figure[i][0]+initialRow-1, figure[i][1]+initialColumn-1);
        if (!(iaArrayContainsCell(gPieces, cell.row, cell.column))){
           gPieces.push(cell)
        }
    }
    drawBoard();
}


function drawPiece(p) {
    var column = p.column;
    var row = p.row;
    var x = (column * kPieceWidth) + (kPieceWidth/2);
    var y = (row * kPieceHeight) + (kPieceHeight/2);
    var radius = (kPieceWidth/2) - (kPieceWidth/10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    gDrawingContext.fillStyle = "#000";
	gDrawingContext.fill();
}

function newGame() {
    gPieces = [];
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    gMoveCount = 0;
    var span = document.getElementById("gameOver");
    span.style.visibility = "hidden";

    drawBoard();
}

function initGame() {
    gCanvasElement = document.getElementById("game");
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", halmaOnClick, false);
    gMoveCountElem = document.getElementById("movecount");;
    gDrawingContext = gCanvasElement.getContext("2d");
   
    gCanvasElement.onmousedown = myDown;
    gCanvasElement.onmouseup = myUp;

    gFigureCross = [
                        [1, 3], [1, 4], [1, 5], [1, 6],
                        [2, 3],                 [2, 6],
        [3, 1], [3, 2], [3, 3],                 [3, 6], [3, 7], [3, 8],
        [4, 1],                                                 [4, 8],
        [5, 1],                                                 [5, 8],
        [6, 1], [6, 2], [6, 3],                 [6, 6], [6, 7], [6, 8],
                        [7, 3],                 [7, 6],
                        [8, 3], [8, 4], [8, 5], [8, 6]
        ];

    gFigureGlider = [
                [1, 2],
                        [2, 3],
        [3, 1], [3, 2], [3, 3] 
    ]

    newGame();
}

function myDown(e){
    if (!drawing){
        return
    }
    var cell = getCursorPosition(e);
        
    dragok = true;
    gCanvasElement.onmousemove = myMove;
    intervalDrowBoard = setInterval(drawBoard, 10);
}

function myMove(e){
    if (!drawing){
        return
    }
    if (dragok){
        var cell = getCursorPosition(e);
        gPieces.push(cell);
    }
}

function myUp(){
    if (!drawing){
        return
    }
    dragok = false;
    gCanvasElement.onmousemove = null;
    clearInterval(intervalDrowBoard);
}

function nextStep(){
    var checked = [];
    var newArray = cloneArray(gPieces);
    
    if (gPieces.length == 0){
        endGame();
        return;
    }

    var gameOver = true;
    // добавляем ожившие клетки
    for (var i = 0; i<gPieces.length; i++){
        var cell = gPieces[i];
        
        for (var row = cell.row - 1; row <= cell.row+1; row++){
            var checkedRow = row;

            if (checkedRow<0){
                checkedRow = kBoardHeight - 1;
            } else if (checkedRow>=kBoardHeight){
                checkedRow = 0;
            }

            for (var column = cell.column - 1; column <= cell.column+1; column++){
                var checkedColumn = column;
                if (checkedColumn<0){
                    checkedColumn = kBoardWidth - 1;
                } else if (checkedColumn>=kBoardWidth){
                    checkedColumn = 0;
                }

                if (
                    (checkedRow==cell.row&&checkedColumn==cell.column)||
                    (iaArrayContainsCell(gPieces, checkedRow, checkedColumn))||
                    (iaArrayContainsCell(checked, checkedRow, checkedColumn))
                    ){
                    continue
                }
                var checkedCell = new Cell(checkedRow, checkedColumn);
                checked.push(checkedCell);
                var count = countOfAlive(checkedCell, gPieces);
                if (count == 3){
                    newArray.push(checkedCell);
                }
            }
        }
    }
    if (gPieces.length != newArray.length){
        gameOver = false;
    }

    //удаляем умершие
    var DeadArray = [];
    for (var i = 0; i<gPieces.length; i++){
        var cell = gPieces[i];
        var count = countOfAlive(cell, gPieces);
        if (!(count==2||count==3)){
            DeadArray.push(cell)
        }
    }
    for (var i = 0; i<newArray.length; i++){
        var cell = newArray[i];
        if (iaArrayContainsCell(DeadArray, cell.row, cell.column)){
            newArray.splice(i,1);
            i--;
        }
    }

    if (gameOver && gPieces.length != newArray.length){
        gameOver = false;
    }

    if (gameOver){
        endGame();
        return;
    }

    gPieces = newArray;
    gMoveCount++;
    drawBoard();
    
}

function countOfAlive(cell, array) {
    var count = 0;
    for (var row = cell.row - 1; row <= cell.row+1; row++){
        var checkedRow = row;

        if (checkedRow<0){
            checkedRow = kBoardHeight - 1;
        } else if (checkedRow>=kBoardHeight){
            checkedRow = 0;
        }
        for (var column = cell.column - 1; column <= cell.column+1; column++){
            var checkedColumn = column;
            if (checkedColumn<0){
                checkedColumn = kBoardWidth - 1;
            } else if (checkedColumn>=kBoardWidth){
                checkedColumn = 0;
            }
            
            if (checkedRow==cell.row&&checkedColumn==cell.column){
                continue
            }
            if (iaArrayContainsCell(array, checkedRow, checkedColumn)){
                count++;
            } 
        }
    }
    return count;
}

function iaArrayContainsCell(array, row, column){
    for (var i=0; i<array.length; i++){
        if ((array[i].row == row)&&(array[i].column == column)){
            return true
        }
    }
    return false
}

function cloneArray(array){
    var cloned = [];
    for (var i=0; i<array.length; i++){
        cloned.push(array[i]);
    }
    return cloned
}