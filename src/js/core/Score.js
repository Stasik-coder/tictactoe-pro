import { PLAYERS } from '../utils/constants.js';
import { Storage } from './Storage.js';

export class Score {
  constructor() {
    this.score = Storage.getScore();
  }

  addWin(player) {
    if (player === PLAYERS.X) {
      this.score.x += 1;
    }

    if (player === PLAYERS.O) {
      this.score.o += 1;
    }

    Storage.saveScore(this.score);
  }

  addDraw() {
    this.score.draws += 1;
    Storage.saveScore(this.score);
  }

  reset() {
    this.score = {
      x: 0,
      o: 0,
      draws: 0,
    };

    Storage.clearScore();
  }

  getScore() {
    return this.score;
  }
}