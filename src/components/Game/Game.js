import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Text } from 'react-konva';

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
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscKey);
  }

  checkWin = array => {
    const { matchToWin } = this.state;
    let inRow = 1;

    array.slice().reduce((a, b, _, currentReducedArray) => {
      if (a && a === b) inRow += 1;
      else inRow = 1;
      if (inRow === matchToWin) currentReducedArray.splice(1);
      return b;
    });
    return inRow === matchToWin;
  };

  checkDraw = field => field.map(row => row.filter(x => !x)).filter(y => y.length !== 0).length === 0;

  getDiagonale = (field, rowIndex, cellIndex, isMain) => {
    const { matchToWin } = this.state;
    const a = [...Array(matchToWin * 2 + 1)].map((_, i) => {
      const row = rowIndex + i - matchToWin;
      const cell = isMain ? cellIndex + i - matchToWin : cellIndex - i + matchToWin;

      if (row >= 0 && row < field.length && cell >= 0 && cell < field[row].length) {
        return field[row][cell];
      }
      return undefined;
    });
    return a;
  };

  winCondition = (field, rowIndex, cellIndex) => {
    return (
      this.checkWin(field[rowIndex]) ||
      this.checkWin(field.map(x => x[cellIndex])) ||
      this.checkWin(this.getDiagonale(field, rowIndex, cellIndex, true)) ||
      this.checkWin(this.getDiagonale(field, rowIndex, cellIndex, false))
    );
  };

  handleClick = (rowIndex, cellIndex) => {
    const { state } = this;
    const { sizeX, sizeY } = this.props;

    if (!state.field[rowIndex][cellIndex] && !state.isGameWon && !state.isGameDrawn) {
      this.setState(prevState => {
        const { field, isCrossTurn } = prevState;

        field[rowIndex][cellIndex] = isCrossTurn ? 'x' : 'o';
        const isGameWon = this.winCondition(field, rowIndex, cellIndex);
        const isGameDrawn = this.checkDraw(field);
        if (!isGameWon && !isGameDrawn) {
          localStorage.setItem('field', JSON.stringify(field));
          localStorage.setItem('sizeX', sizeX);
          localStorage.setItem('sizeY', sizeY);
          localStorage.setItem('matchToWin', state.matchToWin);
          localStorage.setItem('isCrossTurn', !isCrossTurn);
        } else localStorage.clear();
        return { field, isCrossTurn: !isCrossTurn, isGameWon, isGameDrawn };
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
    const { field, isCrossTurn, isGameWon, isGameDrawn, isMenuShowed } = this.state;
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
