import React, { Component } from 'react';
import { debounce } from 'lodash';
import Game from './components/Game/Game';

import './App.css';

class App extends Component {
  state = {
    sizeX: 10,
    sizeY: 10,
    pvp: true,
    isGameActive: false,
  };

  handleChange = debounce((label, value) => {
    this.setState({ [label]: value });
  }, 300);

  toggleGame = () => this.setState(prevState => ({ isGameActive: !prevState.isGameActive }));

  togglePvP = () => this.setState(prevState => ({ pvp: !prevState.pvp }));

  render() {
    const { sizeX, sizeY, isGameActive, pvp } = this.state;
    if (isGameActive) return <Game quit={this.toggleGame} />;
    return (
      <div className="start-page">
        <h1>Welcome to Tic-Tac-Toe large edition!</h1>
        <h2>Enter field size: </h2>
        <label htmlFor="x">x: </label>
        <input id="x" defaultValue={sizeX} onChange={e => this.handleChange('sizeX', e.target.value)} />
        <label htmlFor="y">y: </label>
        <input id="y" defaultValue={sizeY} onChange={e => this.handleChange('sizeY', e.target.value)} />
        <h2>Select mode:</h2>
        <input id="pvp" type="radio" checked={pvp} onChange={this.togglePvP} />
        <label htmlFor="pvp">Player vs Player</label>
        <input id="ai" type="radio" checked={!pvp} onChange={this.togglePvP} />
        <label htmlFor="ai">Player vs AI</label>
        <button className="btn-start" type="button" onClick={this.toggleGame}>
          Start game!
        </button>
      </div>
    );
  }
}

export default App;
