import firstTemplate from './first-entrance.hbs';
import { ConfigClass } from '../../helpers/config-helper';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';

/**
 * Class for First-Entrance Page
 * @namespace FirstEntranceView
 */

export class FirstEntranceView extends ConfigClass {
  /**
   * constructor of FirstEntranceView Class
   * @constructs FirstEntranceView
   * @memberof FirstEntranceView
   */
  constructor() {
    super();
  }

  /**
   * method for rendering Main Content,
   * attaching on it listener,
   * changing pushState
   */
  render() {
    this.configPage();
    history.pushState({ href: '/first-entrance' }, null, '/first-entrance');
    this.wrapper.append(this.main);

    this.main.innerHTML = firstTemplate();

    document.querySelector('.icon-list').classList.add('active');

    this.attachListeners(this.main);
  }

  /**
   * Just a simple method with publishing eventbus channels 
   * on buttons
   * @param {Object} main On which node elem need to attach listener
   */
  attachListeners(main) {
    main.addEventListener('click', (e) => {
      const { target } = e;

      if (target.classList.contains('go-to-settings')) {
        eventBus.publish(constants.SHOW_SETTINGS_PAGE);
      } else if (target.classList.contains('skip')) {
        eventBus.publish(constants.SHOW_TASKLIST_PAGE);
      }
    });
  }
}
