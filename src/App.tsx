import React from "react";
import reactDom from "react-dom";
import { AppState, BoardProps, SquareProps } from "./types/types";

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={"square-" + i.toString()}
      />
    );
  }

  render() {
    const gameBoard = [];
    const row = 3;
    const col = 3;
    for (let colNum = 0; colNum < col; colNum++) {
      let colBoard = [];
      for (let rowNum = 0; rowNum < row; rowNum++) {
        colBoard.push(this.renderSquare(rowNum + 3 * colNum));
      }
      gameBoard.push(
        <div className="board-row" key={"col-" + colNum.toString()}>
          {colBoard}
        </div>
      );
    }
    return <div>{gameBoard}</div>;
  }
}

export class App extends React.Component<{}, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      isAsc: true,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : "Go to Game Start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner === "draw") {
      status = "引き分けになった";
    } else if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if (!this.state.isAsc) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ isAsc: true })}>昇順</button>
          <button onClick={() => this.setState({ isAsc: false })}>降順</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

reactDom.render(<App />, document.getElementById("root"));

function calculateWinner(squares: ("O" | "X" | "draw" | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.indexOf(null) === -1) {
    return "draw";
  }
  return null;
}
