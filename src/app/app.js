import 'assets/less/main.less';
import jQuery from 'jquery';
import { Header } from './components/header';
import { Router } from './router';
import { eventBus } from './helpers/eventBus';
import constants from './constants/constants';
import { SettingsPage } from './pages/settings/settings';
import { ReportController } from './pages/report/report-controller';
import { TaskListController } from './pages/tasks-list/task-list-controller';
import { TimerController } from './pages/timer/timer-controller';
import { FirstEntranceController } from './pages/first-entrance/first-entrance-controller';
import { ModalController } from './components/modal/modalController';
import uiTooltip from './plugins/tooltip';

/**
 * Class which contains all pages imports, plugins
 * and events for navigation
 * @namespace MainController
 */
class MainController {
  /**
   * constructor of MainController class
   * just init all neccessary instances, methods, events
   * @constructs MainController
   * @memberof MainController
   */
  constructor() {
    this.init();
  }

  /**
   * method for init all neccessary instances, methods, events
   */
  init() {
    this.header = new Header();
    this.settingsPage = new SettingsPage();
    this.reportPage = new ReportController();
    this.taskPage = new TaskListController();
    this.timerPage = new TimerController();
    this.firstEntrance = new FirstEntranceController();
    this.router = new Router();
    new ModalController(document.querySelector('#wrapper'));
    jQuery('#wrapper').uiTooltip();

    this.addPath();
    this.header.render();
    this.checkIfNewUser();
    this.events();
    this.subscribeToEvents();
  }

  /**
   * method for adding paths for Router instance
   */
  addPath() {
    this.router.add('/settings', this.settingsPage);
    this.router.add('/report', this.reportPage);
    this.router.add('/task-list', this.taskPage);
    this.router.add('/timer', this.timerPage);
    this.router.add('/first-entrance', this.firstEntrance);
  }

  /**
   * method for subscribing to events from eventBus
   */
  subscribeToEvents() {
    eventBus.subscribe(constants.SHOW_TIMER_PAGE, () => {
      this.router.navigate('/timer');
      history.pushState({ href: '/timer' }, null, '/timer');
    });

    eventBus.subscribe(constants.SHOW_SETTINGS_PAGE, () => {
      this.router.navigate('/settings');
    });

    eventBus.subscribe(constants.SHOW_TASKLIST_PAGE, () => {
      this.router.navigate('/task-list');
      history.pushState({ href: '/task-list' }, null, '/task-list');
    });

    eventBus.subscribe(constants.SHOW_REPORT_PAGE, () => {
      this.router.navigate('/report');
    });
  }

  /**
   * method for init events like router navigation,
   * popstate evnt, tooltip bug fixing
   */
  events() {
    document.addEventListener('click', (e) => {
      const { target } = e;

      // tooltip fix
      const tooltip = document.querySelector('.ui-tooltip');

      if (tooltip) tooltip.remove();

      if (
        target.tagName === 'A'
        && !target.classList.contains('icon-trash')
        && target.parentElement.classList.contains('navigation-item')
      ) {
        e.preventDefault();
        this.router.navigate(target.href);
        window.sessionStorage.setItem('page', target.href);
      }
    });

    window.addEventListener('popstate', (e) => {
      this.router.navigate(`/${e.state.href.split('/')[1]}`);
    });
  }
  
  /**
   * method which checks if user come first time on site
   * if yes load /first-entrance page, no - /task-list
   */
  checkIfNewUser() {
    const hrefPage = window.sessionStorage.getItem('page');

    if (window.sessionStorage.getItem('isNewUser')) {
      if (hrefPage) {
        this.router.navigate(hrefPage);
      } else {
        this.router.navigate('/task-list');
        history.pushState({ href: '/task-list' }, null, '/task-list');
      }
    } else {
      window.sessionStorage.setItem('isNewUser', true);
      this.router.navigate('/first-entrance');
      history.pushState({ href: '/first-entrance' }, null, '/first-entrance');
    }
  }
}

new MainController();
