/*
 *   Chess Game in JavaScript   *
**/

var BLUE  = 1;
var RED   = 2;
var BLACK = 3;
var WHITE = 4;
var GREEN = 5;

var board_data;
var game_mode;

var MODE_SELECT_PIECE = 1;
var MODE_SELECT_MOVE = 2;
var MODE_WAITING = 3;

var players_turn;

var piecex;
var piecey;
var piecemoves;
var piecetype;

var bluex;
var bluey;

var move_in_progress;
var move_step;

var move_list = "<h3>Move List</h3>";

var KING_PIECE   = 6;
var QUEEN_PIECE  = 5;
var ROOK_PIECE   = 4;
var BISHOP_PIECE = 3;
var KNIGHT_PIECE = 2;
var PAWN_PIECE   = 1;

var NO_PIECE = 0;

var BLACK_PLAYER = 1;
var WHITE_PLAYER = 2;

var bkx = -1;
var bky = -1;
var wkx = -1;
var wky = -1;

var in_check = 0;
var checking_check = 0;

var movelist = "";

function CheckForCheck(side, board, kingy, kingx)
{
    if (side === undefined) side = players_turn;
    var opp_side = (side == BLACK_PLAYER ? WHITE_PLAYER : 
                    (side == WHITE_PLAYER ? BLACK_PLAYER : 0));

    checking_check = true;

    if (board === undefined) 
    {
        board = board_data;
    }

    var kx;
    var ky;

    if (kingx === undefined) 
    {
        if (side == BLACK_PLAYER)
        {
            kx = bkx;
            ky = bky;
        } 
        else if (side == WHITE_PLAYER) 
        {
            kx = wkx;
            ky = wky;
        }
    } else {
        kx = kingx;
        ky = kingy;
    }

    for (var r = 0; r < 8; r++)
    {
        for (var c = 0; c < 8; c++)
        {
            if (GetSide(board[r][c]) == opp_side)
            {
                var moves = MoveSet(r, c, board);
                for (var idx in moves) 
                {
                    if (moves[idx].row == ky &&
                        moves[idx].col == kx)
                    {
                        checking_check = false;
                        return true;
                    }
                }
            }
        }
    }

    checking_check = false;
    return false;
}

function GetSide(piece)
{
    if (piece) {
        return (piece < 7) ? 1 : 2;
    }
    return 0;
}

function GetType(piece)
{
    if (piece) {
        return (piece - 1)%6 + 1;
    }
    return 0;
}

function GetStarting(r,c)
{
    var pieces = 
    [
        [ 4, 2, 3, 5, 6, 3, 2, 4],
        [ 1, 1, 1, 1, 1, 1, 1, 1],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0],
        [ 7, 7, 7, 7, 7, 7, 7, 7],
        [10, 8, 9,11,12, 9, 8,10]
    ];
    return pieces[r][c];
}

function GetPieceChar(N)
{
    var n = (N - 1) % 6;
    // var mnemonics = ['P', 'K', 'B', 'R', 'Q', 'Kg'];
    var names = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    var teams = ['black', 'white'];

    if (GetSide(N)) {
        return "<img src='pic/" + teams[GetSide(N)-1] + "_"
                    + names[n] + ".png' width='78px'/>";
    } else {
        return "";
    }
}

function BoardColor(r,c)
{
    if ((r + c) % 2) {
        return BLACK;
    } else {
        return WHITE;
    }
}

function Makeboard()
{
    var board_html;
    board_html = "";

    board_data = [];
    game_mode = MODE_WAITING;
    players_turn = 0;

    for (var rows = 0; rows < 8; rows++)
    {
        var row_html = "";
        board_data.push([]);
        for (var col = 0; col < 8; col++)
        {
            row_html = row_html + "<div id='" + SquareID(rows, col) + "' ";
            if ((rows + col) % 2) {
                row_html = row_html + "class='black_sqr' onClick='ClickBoard("+rows+","+col+");'>";
            } else {
                row_html = row_html + "class='white_sqr' onClick='ClickBoard("+rows+","+col+");'>";
            }

            row_html = row_html + GetPieceChar(GetStarting(rows,col));
            board_data[rows].push(GetStarting(rows, col));

            if (GetType(board_data[rows][col]) == KING_PIECE) {
                if (GetSide(board_data[rows][col]) == BLACK_PLAYER) 
                {
                    bky = rows;
                    bkx = col;
                } else if (GetSide(board_data[rows][col]) == WHITE_PLAYER) {
                    wky = rows;
                    wkx = col;
                }       
            }

            row_html = row_html + "</div>";
        }
        row_html = row_html + "<br style='clear: both;'>";
        board_html = board_html + row_html;
    }

    var board = document.getElementById("gameboard");
    board.innerHTML = board_html;

    game_mode = MODE_SELECT_PIECE;
    players_turn = WHITE_PLAYER;
    piecex = -1;
    piecey = -1;
    
    piecetype = NO_PIECE;

    red_pieces = 12;
    black_pieces = 12;

    bluex = -1;
    bluey = -1;
    return;
}

function SquareID(row, col) 
{
    return "SQR_" + row + "_" + col;
}

function SetColor(row, col, color) 
{
    if (color == BLUE) {
        var square = document.getElementById(SquareID(row, col));
        square.className = "blue_sqr";
    } else if (color == RED) {
        var square = document.getElementById(SquareID(row, col));
        square.className = "red_sqr";
    } else if (color == BLACK) {
        var square = document.getElementById(SquareID(row, col));
        square.className = "black_sqr";
    } else if (color == WHITE) {
        var square = document.getElementById(SquareID(row, col));
        square.className = "white_sqr";
    } else if (color = GREEN) {
        var square = document.getElementById(SquareID(row, col));
        square.className = "green_sqr";
    } else {
//        console.log("Invalid color.");
    }
}

function SetPiece(row, col, piece)
{
    var square = document.getElementById(SquareID(row, col));
    var inner = "";

    inner = GetPieceChar(piece);
    board_data[row][col] = piece;

    square.innerHTML = inner;
    return;
}


function SetContains(set, item) 
{
    for (var idx in set) {
        if (set[idx].row == item.row && set[idx].col == item.col
                && set[idx].piece == item.piece)
            return true;
    }
    return false;
}

function GetSet(set, item)
{
    for (var idx in set) {
        if (set[idx].row == item.row && set[idx].col == item.col
                && set[idx].piece == item.piece)
            return set[idx];
    }
}

function PawnMoves(row, col, side, piece_type, board)
{
    var set = [];

    if (board === undefined) board = board_data;

    if (side == BLACK_PLAYER) 
    {
        if (row+1 < 8 && board[row+1][col] == 0) {
            set.push({"row": row+1, "col": col, "piece": piece_type, "cap": 0});
        }
        if (row == 1 && board[row+1][col] == 0 && board[row+2][col] == 0) {
            set.push({"row": row+2, "col": col, "piece": piece_type, "cap": 0});
        }
        if (col+1 < 8 && row+1 < 8 && GetSide(board[row+1][col+1]) == WHITE_PLAYER) {
            set.push({"row": row+1, "col": col+1, "piece": piece_type, "cap": 1});
        }
        if (col-1 >= 0 && row+1 < 8 && GetSide(board[row+1][col-1]) == WHITE_PLAYER) {
            set.push({"row": row+1, "col": col-1, "piece": piece_type, "cap": 1});
        }
        return set;
    } 
    else if (side == WHITE_PLAYER) 
    {
        if (row-1 >= 0 && board[row-1][col] == 0) {
            set.push({"row": row-1, "col": col, "piece": piece_type, "cap": 0});
        }
        if (row == 6 && board[row-1][col] == 0 && board[row-2][col] == 0) {
            set.push({"row": row-2, "col": col, "piece": piece_type, "cap": 0});
        }
        if (col+1 < 8 && row-1 >= 0 && GetSide(board[row-1][col+1]) == BLACK_PLAYER) {
            set.push({"row": row-1, "col": col+1, "piece": piece_type, "cap": 1});
        }
        if (col-1 >= 0 && row-1 >= 0 && GetSide(board[row-1][col-1]) == BLACK_PLAYER) {
            set.push({"row": row-1, "col": col-1, "piece": piece_type, "cap": 1});
        }
        return set;
    }
}

function KnightMoves(row, col, piece_side, piece_type, board) 
{
    var opposite = (piece_side == 1) ? 2 : 1;
    var xs = [-2, -2, -1, -1, 1, 1, 2, 2];
    var ys = [-1,  1, -2,  2,-2, 2,-1, 1];

    if (board === undefined) board = board_data;

    var set = [];
    for (var i = 0; i < 8; i++)
    {
        var nrow = row + ys[i];
        var ncol = col + xs[i];
        if (nrow >= 0 && nrow < 8 && ncol >= 0 && ncol < 8)
        {
            var p = board[nrow][ncol];
            if (p == 0 || GetSide(p) == opposite) 
            {
                set.push({"row": nrow, "col": ncol, "piece": piece_type, "cap": (p ? 1 : 0)});
            }
        }
    }
    return set;
}

function BishopMoves(row, col, piece_side, piece_type, board)
{
    var dx = [-1, 1, -1, 1];
    var dy = [-1, -1, 1, 1];

    if (board === undefined) board = board_data;

    var set = [];
    for (var i = 0; i < 4; i++)
    {
        var nrow = row + dy[i];
        var ncol = col + dx[i];
        while (nrow >= 0 && nrow < 8 &&
               ncol >= 0 && ncol < 8)
        {
            var p = board[nrow][ncol];
            if (p == 0 || GetSide(p) != piece_side) {
                set.push({"row": nrow, "col": ncol, "piece": piece_type, "cap": (p ? 1 : 0)});
            }
            if (p) break;
            nrow = nrow + dy[i];
            ncol = ncol + dx[i];
        }      
    }
    return set;
}

function RookMoves(row, col, piece_side, piece_type, board)
{
    var dx = [1, 0, -1, 0];
    var dy = [0, 1, 0, -1];

    if (board === undefined) board = board_data;

    var set = [];
    for (var i = 0; i < 4; i++)
    {
        var nrow = row + dy[i];
        var ncol = col + dx[i];
        while (nrow >= 0 && nrow < 8 &&
               ncol >= 0 && ncol < 8)
        {
            var p = board[nrow][ncol];
            if (p == 0 || GetSide(p) != piece_side) {
                set.push({"row": nrow, "col": ncol, "piece": piece_type, "cap": (p ? 1 : 0)});
            }
            if (p) break;
            nrow = nrow + dy[i];
            ncol = ncol + dx[i];
        }
    }
    return set;
}

function KingMoves(row, col, piece_side, piece_type, board)
{
    var set = [];

    var dx = [1, 1, 1,-1,-1,-1, 0, 0];
    var dy = [0, 1,-1, 0, 1,-1, 1,-1];

    if (board === undefined) board = board_data;

    for (var i = 0; i < 8; i++)
    {
        var nrow = row + dy[i];
        var ncol = col + dx[i];

        if (nrow < 8 && nrow >= 0 &&
            ncol < 8 && ncol >= 0)
        {
            var p = board[nrow][ncol];
            if (p == 0 || GetSide(p) != piece_side)
            {
                set.push({"row": nrow, "col": ncol, "piece": piece_type, "cap": (p ? 1 : 0)});
            }
        }
    }

    return set;
}

function QueenMoves(row, col, piece_side, piece_type, board)
{
    var dnx = [1, 0, -1, 0];
    var dny = [0, 1, 0, -1];

    if (board === undefined) board = board_data;

    var set = [];
    for (var i = 0; i < 4; i++)
    {
        var nrow = row + dny[i];
        var ncol = col + dnx[i];
        while (nrow >= 0 && nrow < 8 &&
               ncol >= 0 && ncol < 8)
        {
            var p = board[nrow][ncol];
            if (p == 0 || GetSide(p) != piece_side) {
                set.push({"row": nrow, "col": ncol, "piece": piece_type, "cap": (p ? 1 : 0)});
            }
            if (p) break;
            nrow = nrow + dny[i];
            ncol = ncol + dnx[i];
        }
    }

    var dx = [-1, 1, -1, 1];
    var dy = [-1, -1, 1, 1];

    for (var i = 0; i < 4; i++)
    {
        var nrow = row + dy[i];
        var ncol = col + dx[i];
        while (nrow >= 0 && nrow < 8 &&
               ncol >= 0 && ncol < 8)
        {
            var p = board[nrow][ncol];
            if (p == 0 || GetSide(p) != piece_side) {
                set.push({"row": nrow, "col": ncol, "piece": piece_type, "cap": (p ? 1 : 0)});
            }
            if (p) break;
            nrow = nrow + dy[i];
            ncol = ncol + dx[i];
        }      
    }
    return set;
}

function MoveSet(row, col, board)
{
    if (board === undefined) board = board_data;

    var piece = board[row][col];
    var piece_side = GetSide(piece);
    var piece_type = (piece - 1) % 6 + 1;

    var set = [];

    if (piece) {
        switch (piece_type) {
            case PAWN_PIECE:
                set = PawnMoves(row, col, piece_side, piece, board);
            break;
            case KNIGHT_PIECE:
                set = KnightMoves(row, col, piece_side, piece, board);
            break;
            case BISHOP_PIECE:
                set = BishopMoves(row, col, piece_side, piece, board);
            break;
            case ROOK_PIECE:
                set = RookMoves(row, col, piece_side, piece, board);
            break;
            case QUEEN_PIECE:
                set = QueenMoves(row, col, piece_side, piece, board);
            break;
            case KING_PIECE:
                set = KingMoves(row, col, piece_side, piece, board);
            break;
        }
    }

    var temp_board = [];
    for (var i = 0; i < 8; i++)
    {
        temp_board.push([]);
        for (var j = 0; j < 8; j++)
        {   temp_board[i].push(board[i][j]);  }
    }

    var final_set = [];
    if (checking_check) return set;
    for (var idx in set)
    {
        var prev = board[set[idx].row][set[idx].col];
        temp_board[set[idx].row][set[idx].col] = set[idx].piece;
        temp_board[row][col] = 0;

        if (GetType(set[idx].piece) == KING_PIECE) 
        {
            if (CheckForCheck(piece_side, temp_board, set[idx].row, set[idx].col) == false) 
            {
                final_set.push(set[idx]);
            }
        } else {
            if (CheckForCheck(piece_side, temp_board) == false) 
            {
                final_set.push(set[idx]);
            }
        }
        temp_board[row][col] = set[idx].piece;
        temp_board[set[idx].row][set[idx].col] = prev;
    }

    return final_set;
}

function ROW(n) {
    return 8 - n + 1;
}

function COL(n) {
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return letters[n-1];
}


function AnimateMove()
{
    // make move
    //SetColor(row, col, BLUE);
    var move = move_in_progress;

    move_list = move_list + "P" + (players_turn == BLACK_PLAYER ? 1 : 2) + ". ";
    move_list = move_list + "(" + ROW(piecey+1) + "," + COL(piecex+1) + ") ";

    // perform captures
    // do kinging

    // change pieces on the table
    SetPiece(piecey, piecex, NO_PIECE);
    SetPiece(move.row, move.col, piecetype);

    if (GetType(piecetype) == KING_PIECE) 
    {
        if (GetSide(piecetype) == BLACK_PLAYER)
        {
            bky = move.row;
            bkx = move.col;
        } 
        else if (GetSide(piecetype) == WHITE_PLAYER) 
        {
            wky = move.row;
            wkx = move.col;
        }
    }

    move_list = move_list + "to (" + ROW(move.row+1) + "," + COL(move.col+1) + ")<br>";

    // highlight finished move
    bluey = move.row; bluex = move.col;
    SetColor(bluey, bluex, BLUE);

    // change state
    game_mode = MODE_SELECT_PIECE;
    if (players_turn == BLACK_PLAYER)
        { players_turn = WHITE_PLAYER; }
    else if (players_turn == WHITE_PLAYER)
        { players_turn = BLACK_PLAYER; }

    in_check = CheckForCheck(players_turn, board_data);
    if (in_check) { 
        move_list = move_list + "Check.<br/>"; 
    }

    if (players_turn == BLACK_PLAYER) {
        /* computer's turn */
        game_mode = MODE_WAITING;
        window.setTimeout(ComputersTurn, 500);
    } else {
        /* check for game over */
        var valid_moves = 0;
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (GetSide(board_data[r][c]) == players_turn &&
                    MoveSet(r,c).length > 0)
                {
                    valid_moves = 1;
                    r = 8; break;
                }
            }
        }

        if (valid_moves == 0) {
            if (in_check) 
            {
                movelist = movelist + "Checkmate.<br>";
                document.getElementById("gameboard").innerHTML += "<div style='margin-top: 2px; text-align: center; border: 1px solid black; background-color: f78;'><h3>CHECKMATE</h3></div>";
            } else {
                movelist = movelist + "Stalemate.<br>";
                document.getElementById("gameboard").innerHTML += "<div style='margin-top: 2px; text-align: center; border: 1px solid black; background-color: f78;'><h3>STALEMATE</h3></div>";
            }
        }
    }

    return;
}

var computer_turn;
function ComputersTurn() 
{
    var pieces = [];
    for (var y = 0; y < 8; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            if (GetSide(board_data[y][x]) == players_turn) {
                var moves = MoveSet(y, x);
                if (moves.length) {
                    pieces.push({px: x, py: y, pmoves: moves});
                }
            }
        }
    }

    if (pieces.length) {
        var piece = Math.floor(Math.random() * pieces.length);
        piece = pieces[piece];
        game_mode = MODE_SELECT_PIECE;
        ClickBoard(piece.py, piece.px, true);
        computer_turn = [];
        computer_turn.pmoves = piece.pmoves;
        window.setTimeout(ComputersTurnPart2, 1500);
    } else {
        if (in_check) 
        {
            movelist = movelist + "Checkmate.<br>";
                document.getElementById("gameboard").innerHTML += "<div style='margin-top: 2px; text-align: center; border: 1px solid black; background-color: f78;'><h3>CHECKMATE</h3></div>";
        } else {
            movelist = movelist + "Stalemate.<br>";
                document.getElementById("gameboard").innerHTML += "<div style='margin-top: 2px; text-align: center; border: 1px solid black; background-color: f78;'><h3>STALEMATE</h3></div>";
        }
    }
}

function ComputersTurnPart2()
{
    if (computer_turn.pmoves.length) {
        var move_sel = Math.floor(Math.random() * computer_turn.pmoves.length);
        var mov_row = computer_turn.pmoves[move_sel].row;
        var mov_col = computer_turn.pmoves[move_sel].col;
        ClickBoard(mov_row, mov_col, true);
    } else {
        if (in_check) 
        {
            movelist = movelist + "Checkmate.<br>";
                document.getElementById("gameboard").innerHTML += "<div style='margin-top: 2px; text-align: center; border: 1px solid black; background-color: f78;'><h3>CHECKMATE</h3></div>";
        } else {
            movelist = movelist + "Stalemate.<br>";
                document.getElementById("gameboard").innerHTML += "<div style='margin-top: 2px; text-align: center; border: 1px solid black; background-color: f78;'><h3>STALEMATE</h3></div>";
        }
    }
}

function ClickBoard(row, col, npc)
{
    if (players_turn == BLACK_PLAYER && npc === undefined) return;

    if (game_mode == MODE_WAITING) {
        return;
    } else if (game_mode == MODE_SELECT_PIECE) {
        if (bluex != -1) {
            SetColor(bluey, bluex, BoardColor(bluey, bluex));
            bluex = -1;
            bluey = -1;
        }
        if (GetSide(board_data[row][col]) == players_turn)
        {
            // select piece
            piecex = col;   
            piecey = row;
            piecemoves = MoveSet(row, col);
            piecetype = board_data[row][col];
            game_mode = MODE_SELECT_MOVE;

            // color board
            SetColor(piecey, piecex, RED);

            for (var idx in piecemoves)
            {
                if (piecemoves[idx].cap)
                    SetColor(piecemoves[idx].row, piecemoves[idx].col, GREEN);
                else
                    SetColor(piecemoves[idx].row, piecemoves[idx].col, BLUE);
            }
        }
    } else if (game_mode == MODE_SELECT_MOVE) {
        if (SetContains(piecemoves, {"row": row, "col": col, "piece": piecetype})) 
        {
            // uncolor board
            SetColor(piecey, piecex, BoardColor(piecey, piecex));
            for (var idx in piecemoves)
            {
                SetColor(piecemoves[idx].row, piecemoves[idx].col, 
                        BoardColor(piecemoves[idx].row,
                                   piecemoves[idx].col));
            }

            game_mode = MODE_WAITING;

            move_in_progress = GetSet(piecemoves, {"row": row, "col": col, "piece": piecetype});
            move_step = 0;

            window.setTimeout(AnimateMove, 200);
        } else if (GetSide(board_data[row][col]) == players_turn) {
            // uncolor board
            SetColor(piecey, piecex, BoardColor(piecey, piecex));
            for (var idx in piecemoves)
            {
                SetColor(piecemoves[idx].row, piecemoves[idx].col, 
                        BoardColor(piecemoves[idx].row,
                                   piecemoves[idx].col));
            }
            
            // select piece
            piecex = col;
            piecey = row;
            piecemoves = MoveSet(row, col);
            piecetype = board_data[row][col];
            game_mode = MODE_SELECT_MOVE;
            
            // color board
            SetColor(piecey, piecex, RED);
            for (var idx in piecemoves)
            {
                if (piecemoves[idx].cap)
                    SetColor(piecemoves[idx].row, piecemoves[idx].col, GREEN);
                else
                    SetColor(piecemoves[idx].row, piecemoves[idx].col, BLUE);
            }
        }
        return;
    } else {
        return;
    }
}


