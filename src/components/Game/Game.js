import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';

import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: props.field || [...Array(props.sizeY)].map(() => [...Array(props.sizeX)]),
      isCrossTurn: props.isCrossTurn,
      isGameWon: false,
      isGameDrawn: false,
      isMenuShowed: false,
      matchToWin: props.matchToWin,
      winCoordinates: [],
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscKey);
  }

  checkWin = (array, isGettingCoordinates = false) => {
    // checks if array has certain number of ident elements in row and returns either boolean result
    // or position of those elements in array (depends on isGettingCoordinates)
    const { matchToWin } = this.state;
    let inRow = 1;
    const coordinates = [0];
    array.slice().reduce((a, b, _, currentReducedArray) => {
      if (a && a === b) inRow += 1;
      else {
        coordinates[0] += 1;
        inRow = 1;
      }
      if (inRow === matchToWin) {
        coordinates[1] = coordinates[0] + 4;
        currentReducedArray.splice(1);
      }
      return b;
    });
    if (isGettingCoordinates) return coordinates;
    return inRow === matchToWin;
  };

  checkDraw = field => field.map(row => row.filter(x => !x)).filter(y => y.length !== 0).length === 0;

  getDiagonal = (field, rowIndex, cellIndex, isMain) => {
    // gets diagonal depending on certain position. isMain parameter says if it's main or off diagonal
    const biggerShape = field.length >= field[0].length ? field.length : field[0].length;
    const diagonal = [];

    [...Array(biggerShape * 2 + 1)].forEach((_, i) => {
      const row = rowIndex + i - biggerShape;
      const cell = isMain ? cellIndex + i - biggerShape : cellIndex - i + biggerShape;

      if (row >= 0 && row < field.length && cell >= 0 && cell < field[row].length) diagonal.push(field[row][cell]);
    });
    return diagonal;
  };

  getDiagonalStartCoordinates = (x, y) => {
    // calculating start points of main and off diagonal return [mainX, mainY, offX, offY]
    const { sizeX } = this.props;
    const coordinates = [];
    let mainX = x;
    let mainY = y;
    let offX = x;
    let offY = y;
    while (mainX >= 0 && mainY >= 0) {
      coordinates[0] = mainX;
      mainX -= 1;
      coordinates[1] = mainY;
      mainY -= 1;
    }
    while (offX < sizeX && offY >= 0) {
      coordinates[2] = offX;
      offX += 1;
      coordinates[3] = offY;
      offY -= 1;
    }
    return coordinates;
  };

  getWinCoordinates = (field, rowIndex, cellIndex) => {
    const diagMain = this.getDiagonal(field, rowIndex, cellIndex, true); // getting array of items of main diagonal
    const diagOff = this.getDiagonal(field, rowIndex, cellIndex, false); // getting array of items of off diagonal
    const diagonalStartCoordinates = this.getDiagonalStartCoordinates(cellIndex, rowIndex);

    const rowCoords = this.checkWin(field[rowIndex], true); // getting winning coordinates of row
    const colCoords = this.checkWin(field.map(x => x[cellIndex]), true); // getting winning coordinates of column
    const diagMainCoords = this.checkWin(diagMain, true); // getting winning coordinates of main diagonal
    const diagOffCoords = this.checkWin(diagOff, true); // getting winning coordinates of off diagonal
    // calculating position of start and end points of crossing line return [startX, startY, endX. endY]
    if (rowCoords[1]) return [rowCoords[0], rowIndex + 0.5, rowCoords[1] + 1, rowIndex + 0.5];
    if (colCoords[1]) return [cellIndex + 0.5, colCoords[0], cellIndex + 0.5, colCoords[1] + 1];
    if (diagMainCoords[1])
      return [
        diagonalStartCoordinates[0] + diagMainCoords[0],
        diagonalStartCoordinates[1] + diagMainCoords[0],
        diagonalStartCoordinates[0] + diagMainCoords[1] + 1,
        diagonalStartCoordinates[1] + diagMainCoords[1] + 1,
      ];
    return [
      diagonalStartCoordinates[2] - diagOffCoords[0] + 1,
      diagonalStartCoordinates[3] + diagOffCoords[0],
      diagonalStartCoordinates[2] - diagOffCoords[1],
      diagonalStartCoordinates[3] + diagOffCoords[1] + 1,
    ];
  };

  winCondition = (field, rowIndex, cellIndex) => {
    return (
      this.checkWin(field[rowIndex]) ||
      this.checkWin(field.map(x => x[cellIndex])) ||
      this.checkWin(this.getDiagonal(field, rowIndex, cellIndex, true)) ||
      this.checkWin(this.getDiagonal(field, rowIndex, cellIndex, false))
    );
  };

  handleClick = (rowIndex, cellIndex) => {
    const {
      state,
      props: { sizeX, sizeY },
    } = this;

    if (!state.field[rowIndex][cellIndex] && !state.isGameWon && !state.isGameDrawn) {
      this.setState(prevState => {
        const { field, isCrossTurn } = prevState;
        let winCoordinates = [];

        // puts either cross or circle in empty field
        field[rowIndex][cellIndex] = isCrossTurn ? 'x' : 'o';
        const isGameWon = this.winCondition(field, rowIndex, cellIndex);
        const isGameDrawn = this.checkDraw(field);
        // if game isn't finished keeping result in localStorage
        if (!isGameWon && !isGameDrawn) {
          localStorage.setItem('field', JSON.stringify(field));
          localStorage.setItem('sizeX', sizeX);
          localStorage.setItem('sizeY', sizeY);
          localStorage.setItem('matchToWin', state.matchToWin);
          localStorage.setItem('isCrossTurn', !isCrossTurn);
        } else {
          // if game is finished getting and setting winCoordinates
          localStorage.clear();
          winCoordinates = this.getWinCoordinates(field, rowIndex, cellIndex);
        }
        return { field, isCrossTurn: !isCrossTurn, isGameWon, isGameDrawn, winCoordinates };
      });
    }
  };

  restart = () => {
    const { sizeX, sizeY } = this.props;
    localStorage.clear();
    this.setState({
      field: [...Array(sizeY)].map(() => [...Array(sizeX)]),
      isCrossTurn: true,
      isGameWon: false,
      isGameDrawn: false,
      isMenuShowed: false,
      winCoordinates: [],
    });
  };

  handleEscKey = e => {
    if (e.keyCode === 27) {
      this.setState(prevState => ({
        isMenuShowed: !prevState.isMenuShowed,
      }));
    }
  };

  render() {
    const { sizeX, sizeY, quit } = this.props;
    const { field, isCrossTurn, isGameWon, isGameDrawn, isMenuShowed, winCoordinates } = this.state;
    const CELL_SIZE = 40;

    return (
      <div className="game">
        <p>Press Esc to open Menu</p>
        <Stage width={sizeX * CELL_SIZE + 2} height={sizeY * CELL_SIZE + 2}>
          <Layer>
            <Rect x={0} y={0} width={sizeX * CELL_SIZE + 2} height={sizeY * CELL_SIZE + 2} fill="#bfbfbf" />
            {field.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <React.Fragment key={`canvas-row-${rowIndex + 1}-cell-${cellIndex + 1}`}>
                  <Rect
                    x={cellIndex * CELL_SIZE + 1}
                    y={rowIndex * CELL_SIZE + 1}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill="#bfbfbf"
                  />
                  <Rect
                    x={cellIndex * CELL_SIZE + 2}
                    y={rowIndex * CELL_SIZE + 2}
                    width={CELL_SIZE - 2}
                    height={CELL_SIZE - 2}
                    fill="#ebe8be"
                    onClick={() => this.handleClick(rowIndex, cellIndex)}
                  />
                  <Text
                    x={cellIndex * CELL_SIZE}
                    y={rowIndex * CELL_SIZE}
                    text={cell}
                    fontStyle="bold"
                    offsetX={-CELL_SIZE / 5}
                    fontSize={CELL_SIZE}
                    fill={cell === 'x' ? '#bf866b' : '#c2c186'}
                  />
                </React.Fragment>
              ))
            )}
            {winCoordinates.length !== 0 && <Line stroke="black" points={winCoordinates.map(i => i * CELL_SIZE)} />}
          </Layer>
        </Stage>

        {(isMenuShowed || isGameWon || isGameDrawn) && (
          <div className="menu">
            <h1>
              {isGameWon || isGameDrawn
                ? (isGameWon && `Congrats, ${isCrossTurn ? 'circle' : 'cross'}!`) ||
                  (isGameDrawn && 'Ooops! This is a draw!')
                : 'Menu'}
            </h1>
            <button type="button" className="btn" onClick={this.restart}>
              Restart
            </button>
            <button type="button" className="btn" onClick={quit}>
              Quit
            </button>
          </div>
        )}
      </div>
    );
  }
}

Game.propTypes = {
  field: PropTypes.instanceOf(Array),
  sizeX: PropTypes.number,
  sizeY: PropTypes.number,
  quit: PropTypes.func.isRequired,
  isCrossTurn: PropTypes.bool,
  matchToWin: PropTypes.number,
};

Game.defaultProps = {
  field: undefined,
  sizeX: 10,
  sizeY: 10,
  isCrossTurn: true,
  matchToWin: 5,
};

export default Game;
