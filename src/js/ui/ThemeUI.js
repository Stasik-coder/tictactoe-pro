const THEME_KEY = 'tictactoe-pro-theme';

export class ThemeUI {
  constructor(buttonElement) {
    this.buttonElement = buttonElement;
    this.currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
  }

  init() {
    this.applyTheme();
    this.updateButtonText();

    this.buttonElement.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, this.currentTheme);
    this.applyTheme();
    this.updateButtonText();
  }

  applyTheme() {
    document.body.dataset.theme = this.currentTheme;
  }

  updateButtonText() {
    this.buttonElement.textContent =
      this.currentTheme === 'dark' ? 'Светлая тема' : 'Темная тема';
  }
}