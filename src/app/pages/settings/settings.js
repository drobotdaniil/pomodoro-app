import './settings.less';
import pomodoroTemplate from './settings-pomodoro.hbs';
import categoryTemplate from './settings-category.hbs';
import { renderingGraph } from './voter';
import { ConfigClass } from '../../helpers/config-helper';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';
import { firebaseDB } from '../../firebase-api';

/**
 * Setting page class
 * @namespace SettingPage
 */
export class SettingsPage extends ConfigClass {
    /**
   * constructor of SettingPage class
   * @constructs SettingPage
   * @memberof SettingPage
   */
  constructor() {
    super();
    this.pomodoro = true;
    this.category = false;
  }

    /**
    * method for rendering Main Content,
    * rendering GraphCycle
    * attaching on it listener,
    * changing pushState
    */
  render() {
    this.configPage();

    if (this.pomodoro) {
      this.main.innerHTML = pomodoroTemplate();
      this.wrapper.append(this.main);
      history.pushState(
        { href: '/settings/pomodoros' },
        null,
        '/settings/pomodoros',
      );
      renderingGraph();
    } else {
      this.main.innerHTML = categoryTemplate();
      this.wrapper.append(this.main);
      history.pushState(
        { href: '/settings/categories' },
        null,
        '/settings/categories',
      );
    }

    document.querySelector('.icon-settings').classList.add('active');

    this.attachListeners(this.main);
  }

/**
   * Just a simple method with listener on tabs
   * Setting Data to FB from criterias inputs(workIteration, workTime, ...)
   * 
   * @param {Object} main On which node elem need to attach listener
   */
  attachListeners(main) {
    main.addEventListener('click', (e) => {
      const { target } = e;

      if (target.id === 'pomodoro') {
        e.preventDefault();
        this.pomodoro = true;
        this.category = false;
        this.render();
      } else if (target.id === 'category') {
        e.preventDefault();
        this.category = true;
        this.pomodoro = false;
        this.render();
      } else if (target.classList.contains('go-to')) {
        eventBus.publish(constants.SHOW_TASKLIST_PAGE);
      } else if (target.classList.contains('save')) {
        firebaseDB.setInfo(
          '/settings',
          {
            workTime: +document.querySelector('#workTimeQuantity').textContent,
            workIteration: +document.querySelector('#workIterQuantity')
              .textContent,
            longBreak: +document.querySelector('#longBreakQuantity')
              .textContent,
            shortBreak: +document.querySelector('#shortBreakQuantity')
              .textContent,
          },
          'settings',
        );
      }
    });
  }
}
