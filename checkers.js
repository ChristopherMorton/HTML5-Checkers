var canvas = $('canvas')[0]
var context = canvas.getContext('2d');
var snd = new Audio('checker_click.wav');

var board, num_red_pieces, num_black_pieces, player, current_move;
/*
var board = new Array(8);
for (var x = 0; x < 8; x++) {
   board[x] = new Array(8);
}

var num_red_pieces = 12;
var num_black_pieces = 12;

// Initialize pieces
// 0 = nothing, 1=p1, -1=p2
for (var x = 0; x < 8; x++) {
   for (var y = 0; y < 8; y++) {
      board[x][y] = 0; 
   }
}
for (var x = 0; x < 8; x += 2) {
   board[x][0] = 1;
   board[x+1][1] = 1;
   board[x][2] = 1;

   board[x+1][5] = -1;
   board[x][6] = -1;
   board[x+1][7] = -1;
}

var player = 1;

var current_move = new Array(); // e.g. [[1,1],[3,3],[5,1]] = 2 jumps from 1,1
*/

function NewGame() {
   board = new Array(8);
   for (var x = 0; x < 8; x++) {
      board[x] = new Array(8);
   }

   num_red_pieces = 12;
   num_black_pieces = 12;

   // Initialize pieces
   // 0 = nothing, 1=p1, -1=p2
   for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
         board[x][y] = 0; 
      }
   }
   for (var x = 0; x < 8; x += 2) {
      board[x][0] = 1;
      board[x+1][1] = 1;
      board[x][2] = 1;

      board[x+1][5] = -1;
      board[x][6] = -1;
      board[x+1][7] = -1;
   }

   player = 1;

   current_move = new Array(); // e.g. [[1,1],[3,3],[5,1]] = 2 jumps from 1,1

   DrawBoard();
}

function DrawPieces() {
   context.strokeStyle = "black";
   for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
         var checker = board[x][y];
         if (checker != 0) {

            if (checker % 3 == 0) checker /= 3;

            context.fillStyle = (checker>0)?"red":"black";
            var x_pix = 40*x;
            var y_pix = 40*y;
            if ( Math.abs( checker ) == 1 ) {
               context.beginPath();
               context.moveTo( x_pix + 20, y_pix + 8 );
               context.arc( x_pix + 20, y_pix + 20, 12, 0, Math.PI*2, false);
               context.fill();
            } else {
               context.beginPath();
               context.moveTo( x_pix + 20, y_pix + 12 );
               context.arc( x_pix + 20, y_pix + 24, 12, 0, Math.PI*2, false);
               context.fill(); 

               context.beginPath();
               context.moveTo( x_pix + 20, y_pix + 4 );
               context.arc( x_pix + 20, y_pix + 16, 12, 0, Math.PI*2, false);
               context.fill(); 
            }
         }
      }
   }
}

function DrawPendingMove() {
   context.fillStyle = "rgba(255, 80, 80, 0.2)";
   for (var i = 0; i < current_move.length; ++i) {
      var x_pix = current_move[i][0] * 40;
      var y_pix = current_move[i][1] * 40;
      context.fillRect( x_pix, y_pix, 40, 40 );
   }

   if (current_move.length > 1) {
      context.fillStyle = "rgb(255, 80, 80)";
      roundedRect( context, 110, 330, 100, 20, 6, true );
      context.fillStyle = "black";
      context.font = "14pt sans-serif";
      context.fillText( "Make Move", 113, 347);

      for (var i = 1; i < current_move.length; ++i) {
         // Draw move arrow
         var x_pix_start = current_move[i-1][0] * 40;
         var y_pix_start = current_move[i-1][1] * 40;
         var x_pix_end = current_move[i][0] * 40;
         var y_pix_end = current_move[i][1] * 40;
         var x_dir = ((x_pix_end - x_pix_start) > 0)?-10:10;
         var y_dir = ((y_pix_end - y_pix_start) > 0)?-10:10;

         context.strokeStyle = "rgba(0, 0, 0, 0.5)";
         context.fillStyle = "rgba(0, 0, 0, 0.5)";

         context.beginPath();
         context.moveTo(x_pix_start + 20, y_pix_start + 20);
         context.lineTo(x_pix_end + 20 + (x_dir/2), y_pix_end + 20 + (y_dir/2));
         context.stroke();

         context.beginPath();
         context.moveTo(x_pix_end + 20, y_pix_end + 20);
         context.lineTo(x_pix_end + x_dir + 20, y_pix_end + 20);
         context.lineTo(x_pix_end + 20, y_pix_end + y_dir + 20);
         context.fill();
      }
   }
}

function DrawInterface() {
   context.font = "10pt sans-serif";
   context.fillStyle = (player == 1)?"red":"black";
   context.fillText((player == 1)?"Red's Turn":"Black's Turn", 10, 340);

   // New Game Button
   context.strokeStyle = "black"
   roundedRect( context, 230, 330, 75, 20, 5, false );
   context.fillStyle = "black"
   context.fillText( "New Game", 235, 345 );

   if (current_move.length > 0) {
      DrawPendingMove();
   }
}

function CleanBoard() {
   // Unmarks previously marked pieces
   for (var x = 0; x < 8; ++x) {
      for (var y = 0; y < 8; ++y) {
         if (board[x][y] % 3 == 0)
            board[x][y] /= 3;
      }
   }
}

function DrawBoard() {
   context.fillStyle = "rgb(255,255,255)"; 
   context.clearRect( 0, 0, 320, 360 );
   context.fillRect( 0, 0 , 320, 360 );

   context.fillStyle = "rgb(240,240,240)"; 
   for (var y = 0; y < 320; y += 40) {
      for (var x = 0; x < 320; x += 40) {
         if ( (x + y) % 80 == 0 ) {
            context.fillRect( x, y, 40, 40 );
         }
      }
   }

   DrawPieces();
   DrawInterface();
}

function MakeTheMove() {
   for (var i = 0; i < current_move.length - 1; ++i) {
      var start = current_move[i];
      var end = current_move[i + 1];
      if ( Math.abs( start[0] - end[0] ) == 2 ) { // capture
         var mid_x = (start[0] + end[0]) / 2;
         var mid_y = (start[1] + end[1]) / 2;
         board[mid_x][mid_y] = 0;
         if (this.player==1)
            num_black_pieces--;
         else
            num_red_pieces--;
      };
      board[end[0]][end[1]] = board[start[0]][start[1]];
      board[start[0]][start[1]] = 0;
   }
   snd.currentTime = 0;
   snd.play();

   // Promotion
   if (end[1] == ((player == 1)?7:0)) {
      if ( Math.abs( board[ end[0] ][ end[1] ] ) == 1 ) {
         board[ end[0] ][ end[1] ] *= 2;
      }
   }

   if (num_red_pieces == 0 || num_black_pieces == 0) {
      alert( "Game Over!" );
   }

   current_move = new Array();
   CleanBoard();
   player = -player;
   DrawBoard();
}

var OnClick = function( e ) {

   var x_pix = e.pageX - canvas.offsetLeft;
   var y_pix = e.pageY - canvas.offsetTop;

   if (y_pix < 320) {
      if (num_black_pieces == 0 || num_red_pieces == 0) {
         // game is over
         return;
      }

      // If on active board, is it a valid move specification?
      var x = Math.floor(x_pix / 40);
      var y = Math.floor(y_pix / 40);

      var move_length = current_move.length;

      if (move_length == 0) {

         // No current piece, so is the player's piece?
         if (board[x][y] == player ||
               board[x][y] == player * 2) {
            current_move.push( new Array( x, y ) );
            DrawBoard();

$('p').text( "Initial piece selected." );
            return;
         }
      } else {
         // Does move follow from the previous one?
         var old_x = current_move[ move_length - 1 ][0];
         var old_y = current_move[ move_length - 1 ][1];

         if ( x == old_x && y == old_y ) { //take the last move back
            current_move.pop();
            if ( move_length > 1 && 
                  Math.abs( old_x - current_move[move_length - 2][0] ) == 2 ) {
               // Clean jumped piece
               board[ ( current_move[move_length - 2][0] + old_x) / 2 ]
                  [ ( current_move[move_length - 2][1] + old_y) / 2 ] /= 3;
            }
            DrawBoard();
            return;
         }

         if ( x == current_move[0][0] && y == current_move[0][1] 
               && (move_length < 4 || move_length % 2 != 0) ) {
            // It is possible to cycle back around, so that will be allowed.
            current_move = new Array();
            CleanBoard();
            DrawBoard();
            return;
         }

         if (move_length > 1 &&
               Math.abs(current_move[ move_length - 2 ][0] - old_x) == 1) {
            return; // Last move not a capture, can't continue the move
         }

         // Otherwise, just need to check if the move is possible from position
         if ( Math.abs( old_x - x ) != Math.abs( old_y - y ) ) {
            return; // Not a diagonal move, clearly not possible
         }

         if ( board[x][y] != 0 &&
               (x != current_move[0][0] || y != current_move[0][1]) ) {
            return; // There's a piece in the way, this isn't the moving piece
         }

         if ( Math.abs( old_x - x ) == 2 ) {
            var jumped_x = ( x + old_x ) / 2;
            var jumped_y = ( y + old_y ) / 2;

            if ( board[jumped_x][jumped_y] != -player &&
                  board[jumped_x][jumped_y] != -player * 2) {
               return; // Not jumping an enemy piece
            }
            else
            {
               board[jumped_x][jumped_y] *= 3; // Mark as will-be-jumped
            }
         }
         if ( Math.abs( board[ current_move[0][0] ][ current_move[0][1] ] ) == 1 &&
               ( (y - old_y) > 0 ) != ( player > 0 ) ) {
            return; // Non-promoted piece going the wrong way.
         }

         // Seems to check out!
         current_move.push( new Array( x, y ) );
         DrawBoard();
         return;
      }
   } else {
      // If not on the board, did they click an active button?
      if ( current_move.length > 1 &&
            x_pix > 110 && x_pix <= 210 &&
            y_pix > 330 && y_pix <= 350 ) {
         MakeTheMove();
      } else if ( x_pix > 230 && x_pix <= 305 &&
            y_pix > 330 && y_pix <= 350 ) {
         NewGame();
      }
   }
}

$('canvas').click( OnClick ); 

NewGame();
