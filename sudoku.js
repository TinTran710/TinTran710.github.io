// we start with an empty sudoku...
var sudoku = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

var sudokuPuzzle = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

var tempPuzzle = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

var emptyPuzzle = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

var steps;
var log = '';

// ... and we solve it!!
solve(sudoku);

// given a sudoku cell, returns the row
function returnRow(cell) {
  return Math.floor(cell / 9);
}

// given a sudoku cell, returns the column
function returnCol(cell) {
  return cell % 9;
}

// given a sudoku cell, returns the 3x3 block
function returnBlock(cell) {
  return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
}

// given a number, a row and a sudoku, returns true if the number can be placed in the row
function isPossibleRow(number,row,sudoku) {
  for (var i=0; i<=8; i++) {
    if (sudoku[row*9+i] == number) {
      return false;
    }
  }
  return true;
}

// given a number, a column and a sudoku, returns true if the number can be placed in the column
function isPossibleCol(number,col,sudoku) {
  for (var i=0; i<=8; i++) {
    if (sudoku[col+9*i] == number) {
      return false;
    }
  }
  return true;
}

// given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
function isPossibleBlock(number,block,sudoku) {
  for (var i=0; i<=8; i++) {
    if (sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)] == number) {
      return false;
    }
  }
  return true;
}

// given a cell, a number and a sudoku, returns true if the number can be placed in the cell
function isPossibleNumber(cell,number,sudoku) {
  var row = returnRow(cell);
  var col = returnCol(cell);
  var block = returnBlock(cell);
  return isPossibleRow(number,row,sudoku) && isPossibleCol(number,col,sudoku) && isPossibleBlock(number,block,sudoku);
}

// given a row and a sudoku, returns true if it's a legal row
function isCorrectRow(row,sudoku) {
  var rightSequence = new Array(1,2,3,4,5,6,7,8,9);
  var rowTemp= new Array();
  for (var i=0; i<=8; i++) {
    rowTemp[i] = sudoku[row*9+i];
  }
  rowTemp.sort();
  return rowTemp.join() == rightSequence.join();
}

// given a column and a sudoku, returns true if it's a legal column
function isCorrectCol(col,sudoku) {
  var rightSequence = new Array(1,2,3,4,5,6,7,8,9);
  var colTemp= new Array();
  for (var i=0; i<=8; i++) {
    colTemp[i] = sudoku[col+i*9];
  }
  colTemp.sort();
  return colTemp.join() == rightSequence.join();
}

// given a 3x3 block and a sudoku, returns true if it's a legal block 
function isCorrectBlock(block,sudoku) {
  var rightSequence = new Array(1,2,3,4,5,6,7,8,9);
  var blockTemp= new Array();
  for (var i=0; i<=8; i++) {
    blockTemp[i] = sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)];
  }
  blockTemp.sort();
  return blockTemp.join() == rightSequence.join();
}

// given a sudoku, returns true if the sudoku is solved
function isSolvedSudoku(sudoku) {
  for (var i=0; i<=8; i++) {
    if (!isCorrectBlock(i,sudoku) || !isCorrectRow(i,sudoku) || !isCorrectCol(i,sudoku)) {
      return false;
    }
  }
  return true;
}

// given a cell and a sudoku, returns an array with all possible values we can write in the cell
function determinePossibleValues(cell,sudoku) {
  var possible = new Array();
  for (var i=1; i<=9; i++) {
    if (isPossibleNumber(cell,i,sudoku)) {
      possible.unshift(i);
    }
  }
  return possible;
}

// given an array of possible values assignable to a cell, returns a random value picked from the array
function determineRandomPossibleValue(possible,cell) {
  var randomPicked = Math.floor(Math.random() * possible[cell].length);
  return possible[cell][randomPicked];
}

// given a sudoku, returns a two dimension array with all possible values 
function scanSudokuForUnique(sudoku) {
  var possible = new Array();
  for (var i=0; i<=80; i++) {
    if (sudoku[i] == 0) {
      possible[i] = new Array();
      possible[i] = determinePossibleValues(i,sudoku);
      if (possible[i].length==0) {
        return false;
      }
    }
  }
  return possible;
}

// given an array and a number, removes the number from the array
function removeAttempt(attemptArray,number) {
  var newArray = new Array();
  for (var i=0; i<attemptArray.length; i++) {
    if (attemptArray[i] != number) {
      newArray.unshift(attemptArray[i]);
    }
  }
  return newArray;
}

// given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
function nextRandom(possible) {
  var max = 9;
  var minChoices = 0;
  for (var i=0; i<=80; i++) {
    if (possible[i]!=undefined) {
      if ((possible[i].length<=max) && (possible[i].length>0)) {
        max = possible[i].length;
        minChoices = i;
      }
    }
  }
  return minChoices;
}

// given a sudoku, solves it
function solve() {
  var saved = new Array();
  var savedSudoku = new Array();
  var i=0;
  var nextMove;
  var whatToTry;
  var attempt;
  while (!isSolvedSudoku(sudoku)) {
    i++;
    nextMove = scanSudokuForUnique(sudoku);
    /* scanSudokuForUnique: tìm cách tìm ra tập các giá trị có thể cho từng vị trí một cách tuần tự, nếu giữa chừng ko đc thì return false nếu được thì return mảng 2 chiều với tất cả giá trị có thể cho từng vị trí của sudoku và gán cho nextMove
    */
    if (nextMove == false) {
      nextMove = saved.pop();
      sudoku = savedSudoku.pop();
    }
    whatToTry = nextRandom(nextMove); // nextRandom: given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
    // whatToTry lúc này là một index. index này có ít khả năng ngẫu nhiên nhất trong bảng sudoku
    attempt = determineRandomPossibleValue(nextMove,whatToTry); // nextMove ở đây là 1 sudoku = array 2 chiều
    // attempt = giá trị của cell 
    if (nextMove[whatToTry].length>1) {
      nextMove[whatToTry] = removeAttempt(nextMove[whatToTry],attempt);
      saved.push(nextMove.slice());
      savedSudoku.push(sudoku.slice());
    }
    sudoku[whatToTry] = attempt;
    var output = "<pre>Assigning: " + attempt + " into " + whatToTry + "</pre>";
    log = log + output;
  }
  steps = i;
  showPuzzle();
}

function showPuzzle() {
  var numOfCellsToHide = Math.floor(Math.random() * (56 - 46 + 1)) + 46;
  var cellsToHide = new Array();
  for(var i=0; i<81; i++) {
    cellsToHide[i] = i;
  }

  // randomize the array
  cellsToHide.sort(function () {
      return Math.random() - 0.5;
  });
  
  // shorten the array
  for(var i=0; i<81-numOfCellsToHide; i++) {
    cellsToHide.pop();
  }

  var count = 0;
  for (var i=0; i<=8; i++) {
    for (var j=0; j<=8; j++) {  
      var id = 'cell-';    
      id = id.concat(count);
      if(cellsToHide.includes(count)) {
        $('#' + id).val('');
        sudokuPuzzle[count] = '';
      } else {
        $('#' + id).val(sudoku[i*9+j]);
        $('#' + id).attr("disabled","disabled");
        sudokuPuzzle[count] = sudoku[i*9+j];
      }
      count++;
    }
  }
}

function submit() {
  var count = 0;
  for(var i=0; i<=80; i++) {
    var id = 'cell-';
    id = id.concat(count);
    tempPuzzle[count] = document.getElementById(id).value;
    count++;
  }
  if(tempPuzzle.toString() != sudoku.toString()) {
    document.getElementById("show-log").innerHTML = '<div class="alert alert-info"><p>The sudoku board has been saved.</p><p>You have not solved the puzzle yet!</p></div>';
  } else {
    document.getElementById("show-log").innerHTML = '<div class="alert alert-success"><p><b>Congratulations!</b> You have successfully solved the puzzle!</p></div>';
  }
}


function unshowSudoku() {
  var count = 0;
  if(tempPuzzle.toString() != emptyPuzzle.toString()) { // if tempPuzzle exists
    for (var i=0; i<=8; i++) {
      for (var j=0; j<=8; j++) {
        var id = 'cell-';
        id = id.concat(count);
        $('#' + id).val(tempPuzzle[i*9+j]);
        count++;
      }
    }
  } else {
    for (var i=0; i<=8; i++) {
      for (var j=0; j<=8; j++) {
        var id = 'cell-';
        id = id.concat(count);
        $('#' + id).val(sudokuPuzzle[i*9+j]);
        count++;
      }
    }    
  }
  document.getElementById("show-total-steps").innerHTML = '';
  document.getElementById("show-log").innerHTML = '';
}

//given a solved sudoku and the number of steps, prints out the sudoku
function showSudoku() {
  var count = 0;
  var totalSteps = "Solved in "+steps+" steps";
  document.getElementById("show-total-steps").innerHTML = totalSteps;
  document.getElementById("show-log").innerHTML = log;

  for (var i=0; i<=8; i++) {
    for (var j=0; j<=8; j++) {
      var id = 'cell-';
      id = id.concat(count);
      $('#' + id).val(sudoku[i*9+j]);
      count++;
    }
  }
}

function refreshPage(){
  window.location.reload();
}