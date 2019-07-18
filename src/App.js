import React, { Component } from 'react';
import { debounce } from 'lodash';
import Game from './components/Game/Game';

import './App.css';

class App extends Component {
  state = {
    field: undefined,
    matchToWin: 5,
    isCrossTurn: true,
    sizeX: 10,
    sizeY: 10,
    isGameActive: false,
  };

  handleChange = debounce((label, value) => {
    this.setState({ [label]: value });
  }, 300);

  componentDidMount() {
    const field = JSON.parse(localStorage.getItem('field'));
    if (field) {
      const sizeX = parseInt(localStorage.getItem('sizeX'), 10);
      const sizeY = parseInt(localStorage.getItem('sizeY'), 10);
      const matchToWin = parseInt(localStorage.getItem('matchToWin'), 10);
      const isCrossTurn = localStorage.getItem('isCrossTurn') === 'true';
      this.setState({ isGameActive: true, field, sizeX, sizeY, matchToWin, isCrossTurn });
    }
  }

  toggleGame = () => {
    localStorage.clear();
    this.setState(prevState => ({
      field: undefined,
      matchToWin: 5,
      isCrossTurn: true,
      isGameActive: !prevState.isGameActive,
    }));
  };

  render() {
    const { sizeX, sizeY, isGameActive, field, matchToWin, isCrossTurn } = this.state;
    if (isGameActive)
      return (
        <Game
          field={field}
          sizeX={sizeX}
          sizeY={sizeY}
          matchToWin={matchToWin}
          isCrossTurn={isCrossTurn}
          quit={this.toggleGame}
        />
      );
    return (
      <div className="start-page">
        <h1>Welcome to Tic-Tac-Toe large edition!</h1>
        <h2>Enter field size: </h2>
        <label htmlFor="x">x: </label>
        <input id="x" defaultValue={sizeX} onChange={e => this.handleChange('sizeX', parseInt(e.target.value, 10))} />
        <label htmlFor="y">y: </label>
        <input id="y" defaultValue={sizeY} onChange={e => this.handleChange('sizeY', parseInt(e.target.value, 10))} />
        <button className="btn-start" type="button" onClick={this.toggleGame}>
          Start game!
        </button>
      </div>
    );
  }
}

export default App;
