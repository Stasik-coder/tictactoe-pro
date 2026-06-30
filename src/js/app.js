import '../css/base.css';
import '../css/layout.css';
import '../css/board.css';
import '../css/buttons.css';
import '../css/modal.css';
import '../css/responsive.css';

import {Game} from './core/Game.js';
import {Score} from './core/Score.js';
import {AI} from './core/AI.js';
import {BoardUI} from './ui/BoardUI.js';
import {ThemeUI} from './ui/ThemeUI.js';
import {ModalUI} from './ui/ModalUI.js';
import {GAME_STATUS,PLAYERS} from './utils/constants.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="page">
    <section class="game-card">
      <p class="eyebrow">JavaScript Practice Project</p>
      <h1>TicTacToe Pro</h1>

      <div class="players">
        <div>
            <span>Игрок X</span>
            <strong>Player</strong>
        </div>
        <div>
            <span>Игрок O</span>
            <strong>Computer</strong>
        </div>
        </div>

    <div class="settings">
      <label for="difficulty">Сложность ИИ</label>
      <select id="difficulty" data-difficulty>
        <option value="easy">Легкий</option>
        <option value="medium">Средний</option>
        <option value="hard" selected>Сложный</option>
      </select>
    </div>

      <p class="status" data-status>Ход игрока X</p>

      <div class="board" data-board></div>

      <div class="score">
        <div><span>X</span><strong data-score-x>0</strong></div>
        <div><span>Ничьи</span><strong data-score-draws>0</strong></div>
        <div><span>O</span><strong data-score-o>0</strong></div>
      </div>

      <div class="actions">
        <button class="button" data-new-game>Новая игра</button>
        <button class="button button-secondary" data-reset-score>Сбросить счет</button>
        <button class="button button-secondary" data-theme-toggle>Светлая тема</button>
      </div>
    </section>
  </main>
`;

const modalContainer=document.createElement('div');
modalContainer.setAttribute('data-modal','');
document.body.append(modalContainer);

const game = new Game();
const score = new Score();

const boardUI = new BoardUI(document.querySelector('[data-board]'));
const modalUI = new ModalUI(modalContainer);
const statusElement = document.querySelector('[data-status]');
const newGameButton = document.querySelector('[data-new-game]');
const resetScoreButton = document.querySelector('[data-reset-score]');
const difficultySelect = document.querySelector('[data-difficulty]');
const themeButton = document.querySelector('[data-theme-toggle]');
const themeUI = new ThemeUI(themeButton);

themeUI.init();

const scoreXElement = document.querySelector('[data-score-x]');
const scoreOElement = document.querySelector('[data-score-o]');
const scoreDrawsElement = document.querySelector('[data-score-draws]');

let isResultSaved = false;
let isComputerThinking = false;

const updateStatus = () => {
    if (game.status === GAME_STATUS.WIN) {
        statusElement.textContent = `Победил игрок ${game.winner}`;
        return;
    }

    if (game.status === GAME_STATUS.DRAW) {
        statusElement.textContent = 'Ничья';
        return;
    }

    if (isComputerThinking) {
        statusElement.textContent = 'Компьютер думает...';
        return;
    }

    statusElement.textContent = `Ход игрока ${game.currentPlayer}`;
};

const updateScore = () => {
    const currentScore = score.getScore();

    scoreXElement.textContent = currentScore.x;
    scoreOElement.textContent = currentScore.o;
    scoreDrawsElement.textContent = currentScore.draws;
};

const saveResultIfNeeded=()=>{
    if(isResultSaved)return;
    if(game.status===GAME_STATUS.WIN){
        score.addWin(game.winner);
        isResultSaved=true;
        modalUI.show({
            title:'🏆 Победа!',
            text:`Победил игрок ${game.winner}`
        });
    }
    if(game.status===GAME_STATUS.DRAW){
        score.addDraw();
        isResultSaved=true;
        modalUI.show({
            title:'🤝 Ничья!',
            text:'Победителя нет, попробуй еще раз'
        });
    }
};

const render = () => {
    saveResultIfNeeded();
    boardUI.render(game.board, game.winningCombination);
    updateStatus();
    updateScore();
};

const makeComputerMove = () => {
    if (game.status !== GAME_STATUS.PLAYING) return;
    if (game.currentPlayer !== PLAYERS.O) return;

    isComputerThinking = true;
    render();

    setTimeout(() => {
        const move = AI.getMove(game.board, difficultySelect.value);

        if (move !== null) {
            game.makeMove(move);
        }

        isComputerThinking = false;
        render();
    }, 500);
};

boardUI.onCellClick((index) => {
    if (isComputerThinking) return;
    if (game.currentPlayer !== PLAYERS.X) return;

    const isMoveMade = game.makeMove(index);

    if (!isMoveMade) return;

    render();
    makeComputerMove();
});

newGameButton.addEventListener('click', () => {
    game.reset();
    isResultSaved = false;
    isComputerThinking = false;
    modalUI.hide();
    render();
});

resetScoreButton.addEventListener('click', () => {
    score.reset();
    updateScore();
});

modalUI.onNewGameClick(() => {
    game.reset();
    isResultSaved = false;
    isComputerThinking=false;
    modalUI.hide();
    render();
});

render();