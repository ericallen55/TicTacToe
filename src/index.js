
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    //This is the click handler passed to the child, Square,
    //when fired in the child its using a prop passed from the
    //parent, Game, to set the cell number
    //Personally this isn't the most eloquent way to pass data
    //from child to parent but seems to be the react way.
    handleClick(i) {
        this.props.onSetCellNumber(i);
    }

    //Common render function for Squares allows reuse to make lots of squares
    renderSquare(i) {
        return (
            <Square
                //props passed to children
                //value is just a number
                value={this.props.squares[calcCell(i, this.props.boardNumber)]}
                //onClick is passing a function that can be called by its children
                onClick={() => this.handleClick(calcCell(i, this.props.boardNumber))}
            />
        );
    }

    //render method part of React.Component its the only method that's required to implement
    //render should be pure, as in it doesn't modify state and always returns the same results
    //Here it's supplying html as well as passing props onto its children
    render() {
        return (
            <div>
                <br></br>
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
    //here is a constructor
    //super should always be called
    //I am setting up a set of attributes in the state that can be used
    //I feel these are like private class variables
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(27).fill(null),
            xIsNext: true,
            cellNumber: ''
        };
    }

    setCellNumber = (number) => {
        this.handleClick(number);
    }

    handleClick(i) {
        console.log(i + " onClick");
        //this here would allow for replaying of old moves, which I didn't implement
        //we are copying the array instead of modifying it.
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        //I am setting the state variables here
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderBoard(i) {
        return (
            <Board
                boardNumber={i}
                squares = {this.state.squares}
                onClick={() => this.handleClick(i)}
                onSetCellNumber = {this.setCellNumber}
            />
        );
    }

    //Again the render method from the React.Component
    //Its rendering and re rendering on changes the html
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <div className="status">{status}</div>
                    {this.renderBoard(0)}
                    {this.renderBoard(1)}
                    {this.renderBoard(2)}
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calcCell(cellNumber, boardNumber){
    return (boardNumber * 9) + cellNumber;
}

function calculateWinner(squares) {
    const lines = [ //This only wins for the top board or the first column
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 9, 18],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
