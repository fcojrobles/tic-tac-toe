import {useState} from 'react';

function Square({ className, value, style, onSquareClick }) {
  return (
   <button className={className} background-color={style} onClick={onSquareClick}>
    {value}
   </button>
  );
}

function Board({ xIsNext, squares, onPlay, setStatus }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  let [status, highlights] = setStatus(squares);

  function buildBoard() {
    const numRows = 3;
    const numCols = 3;
    const board = [];
  
    board.push(<div key={"status"} className="status">{status}</div>)
    for (let row = 0; row < numRows; row++) {
      board.push(<div key={"row-"+row+1} className="board-row"></div>)
      for (let col = 0; col < numCols; col++) {
        const squareNum = col + 3*row;
        if (highlights && highlights.includes(squareNum)) {
          board.push(<Square key={"square-"+(squareNum+1)} className={"square-winner"} value={squares[squareNum]} onSquareClick={() => handleClick(squareNum)} />);
        } else {
          board.push(<Square key={"square-"+(squareNum+1)} className={"square"} value={squares[squareNum]} onSquareClick={() => handleClick(squareNum)} />);
        }
      }
    } 

    return board;
  }
  
  return <>{buildBoard()}</>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isDescending, setIsDescending] = useState(true);
  const [currMovePos, setCurrMovePos] = useState([Array(9).fill(null)]);

  function handlePlay(nextSquares) {
    let previousHistory = history[currentMove]
    for (let pos = 0; pos < nextSquares.length; pos++) {
      if (previousHistory[pos] !== nextSquares[pos]) {
        setCurrMovePos([...currMovePos.slice(0, currentMove + 1), [Math.floor(pos / 3), pos % 3]]);
      }
    }
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function setStatus(squares) {
    const winner = calculateWinner(squares);
    let status;
    let highlights;
    if (winner) {
      status = "Winner: " + winner[0];
      highlights = winner[1];
    } else if (!winner && currentMove === 9) {
      status = "Draw Game";
    } else {
      status = "Next player: " + (xIsNext ? 'X' : 'O')
    }
    return [status, highlights];
  }

  let moves = history.map((squares, move) => {
    let description;
    let position = "";
    if (currMovePos.length > 0) {
      position = ", (" + currMovePos[move][0] + ", " + currMovePos[move][1] + ")";
    }
    if (move > 0) {
      if (move === currentMove) {
        description = "You are at move #" + move + position;
        return (
          <div key={move}>
            <div className="description">{description}</div>   
          </div>
        );
      } else {
        description = "Go to move #" + move + position;
      }
    } else {
      description = "Go to game start";
    }

    return (
      <div key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </div>
    );
  });

  function sortMoves(isDescending) {
    setIsDescending(!isDescending);
  }

  function checkOrder(isDescending) {
    if (!isDescending) {
      moves.reverse();
    }
    return moves;
  }

  let toggleButton = "Sort in descending order:";
  if (isDescending) {
    toggleButton = "Sort in ascending order:";
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} setStatus={setStatus} />
      </div>
      <div className='game-info'>
        <ol>
          <button onClick={() => sortMoves(isDescending)}>{toggleButton}</button>
        </ol>
        <ol>
          {checkOrder(isDescending)}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}
