import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: [...Array(props.size)].map(() => [...Array(props.size)]),
      cross: true,
      win: false,
      matchToWin: 5,
    };
  }

  winCondition = (field, rowIndex, cellIndex) => {
    const { matchToWin } = this.state;

    [...Array(matchToWin * 2 - 1)].forEach(() => {});
    return false;
  };

  handleClick = (rowIndex, cellIndex) => {
    const { state } = this;

    if (!state.field[rowIndex][cellIndex]) {
      this.setState(prevState => {
        const { field, cross } = prevState;

        field[rowIndex][cellIndex] = cross ? 'x' : 'o';
        // this.winCondition(field, rowIndex, cellIndex);
        return { field, cross: !cross };
      });
    }
  };

  render() {
    const { field, cross, win } = this.state;
    if (win) return <h1>{`Congrats, ${cross ? 'cross' : 'circle'}`}</h1>;
    return (
      <div>
        <table>
          <tbody>
            {field.map((row, rowIndex) => (
              <tr key={`row-${rowIndex + 1}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`row-${rowIndex + 1}-cell-${cellIndex + 1}`}>
                    <button type="button" onClick={() => this.handleClick(rowIndex, cellIndex)} onKeyDown={() => {}}>
                      {cell}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

App.propTypes = {
  size: PropTypes.number,
};

App.defaultProps = {
  size: 10,
};

export default App;
