const STORAGE_KEY = 'tictactoe-pro-score';

export class Storage {
  static getScore() {
    const savedScore = localStorage.getItem(STORAGE_KEY);

    if (!savedScore) {
      return {
        x: 0,
        o: 0,
        draws: 0,
      };
    }

    return JSON.parse(savedScore);
  }

  static saveScore(score) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
  }

  static clearScore() {
    localStorage.removeItem(STORAGE_KEY);
  }
}