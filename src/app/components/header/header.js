import headerTemplate from './header.hbs';
import './header.less';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';

/**
 * Header class 
 * @namespace Header
 */
export class Header {
  constructor() {
    /**
     * constructor of Header class
     * @constructs Header
     * @memberof Header
     */
    this.render();
  }

  /**
   * render func using template,
   * attach listeners
   */
  render() {
    this.wrapper = document.querySelector('#wrapper');
    this.wrapper.innerHTML = headerTemplate();

    window.addEventListener('scroll', this.scrollHeader);
    this.attachListeners();
  }

  /**
   * function for scroll header
   */
  scrollHeader() {
    const header = document.querySelector('#header');
    const logo = document.querySelector('#logo');
    const scroll = window.pageYOffset || document.documentElement.scrollTop;

    if (scroll > 80) {
      header.classList.add('scroll-header');
      logo.classList.remove('hidden');
    } else if (scroll <= 80) {
      header.classList.remove('scroll-header');
      logo.classList.add('hidden');
    }
  }

  // add listener for header 
  attachListeners() {
    document.querySelector('#header').addEventListener('click', (e) => {
      const { target } = e;

      if (
        target.classList.contains('icon-trash')
        || target.classList.contains('count')
      ) {
        e.preventDefault();
        eventBus.publish(constants.REMOVING_MODE_ON);
      }

      if (
        (target.classList.contains('icon-trash')
          || target.classList.contains('count'))
        && document.querySelector('.count').textContent != 0
      ) {
        target.blur();
        eventBus.publish(constants.SHOW_MODAL_DELETE);
      }
    });
  }
}
