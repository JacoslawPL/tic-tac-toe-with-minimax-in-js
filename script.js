var size = 3, realBoard, tempBoard;

const human = "O", ai = "X";
var move;

$fields = $('#board td');
startGame(size, 1);

function startGame(size, start) {
  createTable(size);
  $fields = $('#board td');
  $fields.text('');
  $fields.css('background-color','');
  $fields.on('click', mark);
  $fields.attr('score','0')
  $('.endgame').hide();
  player = start;
}

function createTable(size) {
  var tr = "";
  for (let i = 0; i < size; i++) {
    tr = tr + "<tr>";
    for (let j = 0; j < size; j++) {
      tr = tr + "<td row='" + i + "' column='" + j + "'></td>"
    }
    tr = tr + "</tr>";
  }
  $('#board').html(tr);
  realBoard = new Array(size);
  for (let i = 0; i < size; i++)
  realBoard[i] = new Array(size);
  
/*  tempBoard = new Array(size);
  for (i = 0; i < size; i++)
  tempBoard[i] = new Array(size);*/
}

function mark(square) {
  if (this.innerText == "") {
    this.innerText = (player == 1) ? human : ai;
    realBoard[$(this).attr("row")][$(this).attr("column")] = player;
    if (checkState(realBoard) === size * -1 || checkState(realBoard) === size || checkState(realBoard) === 0) declareWinner(checkState(realBoard));
    if (player == 1) {
      player = -1;
      //winningMove(realBoard, -1);
      bestMove();
    } else player = 1
  }
}

function checkState(board) {
  for (let i = 0; i < size; i++) {
    var rowCheck = 0;
    for (let j = 0; j < size; j++) {
      rowCheck += board[i][j];
    }
    if (rowCheck === size || rowCheck === size * -1) {
      return rowCheck;
    }
  }
  for (let i = 0; i < size; i++) {
    var colCheck = 0;
    for (let j = 0; j < size; j++) {
      colCheck += board[j][i];
    }
    if (colCheck === size || colCheck === size * -1) {
      return colCheck;
    }
  }
  var crossCheck = 0;
  for (let i = 0; i < size; i++) {
    crossCheck += board[i][i];
    if (crossCheck === size || crossCheck === size * -1) {
      return crossCheck;
    }
  }
  var crossCheck2 = 0;
  for (let i = 0; i < size; i++) {
    let j = size - i - 1;
    crossCheck2 += board[i][j];
    if (crossCheck2 === size || crossCheck2 === size * -1) {
      return crossCheck2;
    }
  }
  var moveOptions = emptySquares(realBoard);
  if (moveOptions.length == 0) {
    return 0;
  } else return null;
}

function declareWinner(score) {
  var winner;
  if (score == size) winner = "You WIN!";
  else if (score == size * -1) winner = "Computer WINS!";
  else if (score == 0) winner = "TIE!";
  $('.endgame .text').text(winner);
  $('.endgame').show();
  $fields.off('click', mark);
}

function emptySquares(board) {
  var availSpots = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] == null) {
        var checkMove = {i:i, j:j, score:0};
        availSpots.push(checkMove);
      }
    }
  }
  return availSpots;
}

function copyTable(board) {
  var newBoard = new Array(size);
  for (let i = 0; i < size; i++)
  newBoard[i] = new Array(size);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let x = board[i][j];
      newBoard[i][j] = x;
    }
  }
  return newBoard;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getDepth() {
  var currDepth = emptySquares(realBoard);
  return currDepth.length;
}

function randomMove() {
  var moveOptions = emptySquares(realBoard);
  var x = getRandomInt(moveOptions.length);
  $("#board td[row='"+ moveOptions[x].i +"']")[moveOptions[x].j].click();
}

function bestMove() {
  var x = minimax(realBoard, player);
  console.log(x);
  $("#board td[row='"+ x.i +"']")[x.j].click();
}

function winningMove(board, player) {
  var moveOptions = emptySquares(board), winningMove = 0;
  for (let m = 0; m < moveOptions.length; m++) {
    var tempBoard = copyTable(board);
    tempBoard[moveOptions[m].i][moveOptions[m].j] = player;
    if(checkState(tempBoard) === size * player) {
      winningMove = 1;
      $("#board td[row='"+ moveOptions[m].i +"']")[moveOptions[m].j].click();
      break;
    }
  }
  if (winningMove == 0) randomMove();
}

function minimax(board, player) {
  var moveOptions = emptySquares(board);
  if (checkState(board) === size) return {score: 10}
  else if (checkState(board) === size * -1) return {score: -10}
  else if (moveOptions.length === 0) return {score: 0}
  var moves = [];
  
  for (let m = 0; m < moveOptions.length; m++) {
    //tempBoard = copyTable(board);
    var move = {};
    move.i = moveOptions[m].i;
    move.j = moveOptions[m].j;
    board[move.i][move.j] = player;
    //console.log(minimax(tempBoard, player * -1).score);
    move.score = minimax(board, player * -1).score;
    //console.log(board);
    board[move.i][move.j] = undefined;
    if ((player === 1 && move.score === 10) || (player === -1 && move.score === -10)) {
      //console.log(move);
      return move;
    }      
    else
      moves.push(move);
    }
  let bestMove, bestScore;
  //console.log(moves);
  if(player === 1) {
    bestScore = -100;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 100;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }    
  }
  return moves[bestMove]; 
  //console.log(moves);*/
}