export class BoardUI {
  constructor(boardElement) {
    this.boardElement = boardElement;
  }

  render(board, winningCombination = []) {
    this.boardElement.innerHTML = board
      .map((cell, index) => {
        const isWinnerCell = winningCombination.includes(index);

        return `
          <button 
            class="cell ${isWinnerCell ? 'cell-win' : ''}" 
            data-index="${index}"
          >
            ${cell}
          </button>
        `;
      })
      .join('');
  }

  onCellClick(callback) {
    this.boardElement.addEventListener('click', (event) => {
      const cell = event.target.closest('.cell');

      if (!cell) return;

      callback(Number(cell.dataset.index));
    });
  }
}