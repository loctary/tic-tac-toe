import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Text } from 'react-konva';

import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: [...Array(props.sizeY)].map(() => [...Array(props.sizeX)]),
      cross: true,
      win: false,
      matchToWin: 5,
      escPressed: false,
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

    array.reduce((a, b, _, currentReducedArray) => {
      if (a && a === b) inRow += 1;
      else inRow = 1;
      if (inRow === matchToWin) currentReducedArray.splice(1);
      return b;
    });
    return inRow === matchToWin;
  };

  getDiagonale = (field, rowIndex, cellIndex, isMain) => {
    const { matchToWin } = this.state;

    return [...Array(matchToWin * 2 + 1)].map((_, i) => {
      const row = rowIndex + i - matchToWin;
      const cell = isMain ? cellIndex + i - matchToWin : cellIndex - i + matchToWin;

      if (row >= 0 && row < field.length && cell >= 0 && cell < field.length) {
        return field[row][cell];
      }
      return undefined;
    });
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

    if (!state.field[rowIndex][cellIndex]) {
      this.setState(prevState => {
        const { field, cross } = prevState;

        field[rowIndex][cellIndex] = cross ? 'x' : 'o';
        const win = this.winCondition(field, rowIndex, cellIndex);
        if (!win) {
          localStorage.setItem('field', JSON.stringify(field));
          localStorage.setItem('sizeX', sizeX);
          localStorage.setItem('sizeY', sizeY);
          localStorage.setItem('matchToWin', state.matchToWin);
          localStorage.setItem('cross', cross);
        } else localStorage.clear();

        return { field, cross: !cross, win };
      });
    }
  };

  restart = () => {
    const { sizeX, sizeY } = this.props;
    this.setState({ field: [...Array(sizeY)].map(() => [...Array(sizeX)]), cross: true, win: false });
  };

  handleEscKey = e => {
    if (e.keyCode === 27) {
      this.setState(prevState => ({
        escPressed: !prevState.escPressed,
      }));
    }
  };

  render() {
    const { sizeX, sizeY, quit } = this.props;
    const { field, cross, win, escPressed } = this.state;
    const cellSize = 40;

    if (win) return <h1>{`Congrats, ${cross ? 'circle' : 'cross'}!`}</h1>;
    return (
      <div className="game">
        <Stage width={sizeX * cellSize + 2} height={sizeY * cellSize + 2}>
          <Layer>
            <Rect x={0} y={0} width={sizeX * cellSize + 2} height={sizeY * cellSize + 2} fill="#bfbfbf" />
            {field.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <React.Fragment key={`canvas-row-${rowIndex + 1}-cell-${cellIndex + 1}`}>
                  <Rect
                    x={cellIndex * cellSize + 1}
                    y={rowIndex * cellSize + 1}
                    width={cellSize}
                    height={cellSize}
                    fill="#bfbfbf"
                  />
                  <Rect
                    x={cellIndex * cellSize + 2}
                    y={rowIndex * cellSize + 2}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill="#ebe8be"
                    onClick={() => this.handleClick(rowIndex, cellIndex)}
                  />
                  <Text
                    x={cellIndex * cellSize}
                    y={rowIndex * cellSize}
                    text={cell}
                    fontStyle="bold"
                    offsetX={-cellSize / 5}
                    fontSize={cellSize}
                    fill={cell === 'x' ? '#bf866b' : '#c2c186'}
                  />
                </React.Fragment>
              ))
            )}
          </Layer>
        </Stage>

        {escPressed && (
          <div className="menu">
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
  sizeX: PropTypes.number,
  sizeY: PropTypes.number,
  quit: PropTypes.func.isRequired,
};

Game.defaultProps = {
  sizeX: 10,
  sizeY: 10,
};

export default Game;
