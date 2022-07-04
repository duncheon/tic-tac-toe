import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './helper.js';
import { calculateWinner, getStatus } from './helper.js';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="status"></div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      turn: {
        xIsNext: true,
        total: 0,
      },
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.turn.total + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (
      calculateWinner(current.squares) ||
      current.squares[i] !== null ||
      this.state.turn.total === 9
    ) {
      return;
    } else {
      squares[i] = this.state.turn.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat({ squares: squares }),
        turn: {
          xIsNext: !this.state.turn.xIsNext,
          total: history.length,
        },
      });
    }
  }

  jumpTo(move) {
    this.setState({
      turn: {
        total: move,
        xIsNext: move % 2 === 0,
      },
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.turn.total];
    const status = getStatus(current.squares, this.state.turn);

    const moves = history.map((step, move) => {
      const desc = move ? 'Goto move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
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
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
