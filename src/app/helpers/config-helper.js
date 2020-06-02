export class ConfigClass {
  constructor() {}

  configPage() {
    if (document.querySelector('.main')) {
      document.querySelector('.main').remove();
    }
    this.wrapper = document.querySelector('#wrapper');
    this.main = document.createElement('main');
    this.main.classList.add('main');

    document
      .querySelector('.navigation-link.active')
      .classList.remove('active');
    document.querySelector('.icon-trash').classList.add('hidden');
  }
}
