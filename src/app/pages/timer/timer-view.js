import './timer.less';
import jQuery from 'jquery';
import timerTemplate from './timer.hbs';
import { ConfigClass } from '../../helpers/config-helper';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';
import notification from '../../plugins/notification';

/**
 * Timer page View class
 * @namespace TimerView
 */
export class TimerView extends ConfigClass {
  /**
   * constructor of TimerView
   * @constructs TimerView
   * @memberof TimerView
   * @param {Object} model instance of TimerModel
   */
  constructor(model) {
    super();
    this.model = model;
  }

/**
  * Observe's method calls 
  * each time when calls neccessary model's method
  */
  observe() {
    this.breakisOver();
  }

/**
  * method for rendering Main Content,
  * attaching on it listener,
  */
  render() {
    this.configPage();

    this.wrapper.append(this.main);
    this.main.innerHTML = timerTemplate(this.model.task);
    this.counter = this.model.task.estimation;

    document.querySelector('.icon-trash').classList.add('active');
    this.minutesText = document.querySelector('.timer-minutes');
    this.arrowLeft = document.getElementById('arrowLeft');
    this.arrowRight = document.getElementById('arrowRight');
    this.timerText = document.querySelector('.timer-text');
    this.timerSubTitle = document.querySelector('.timer-subtitle');
    this.header = document.getElementById('header');
    this.timerBlock = document.querySelector('.timer-block');
    this.btnAddPomodoro = document.querySelector('.icon-add');
    this.default = true;
    this.attachListeners(this.main);
  }

  /**
   * hide buttons under timer block
   */
  hideBtns() {
    document.querySelectorAll('.button').forEach((btn) => {
      btn.classList.add('hide');
    });
  }

  /**
   * starts each time when work iteration
   */
  renderStart() {
    this.hideBtns();
    this.header.classList.add('hidden');

    document.getElementById('btnFinishPomodora').classList.remove('hide');
    document.getElementById('btnFailPomodora').classList.remove('hide');

    this.arrowLeft.classList.add('hidden');
    this.btnAddPomodoro.classList.add('hide');

    this.minutesText.classList.remove('hide');
    this.timerSubTitle.classList.add('hide');
    this.timerText.textContent = 'min';
    this.timerText.classList.remove('line-height');
  }

  /**
   * starts each time when break 
   */
  renderBreak() {
    this.hideBtns();

    document.getElementById('btnStartPomodora').classList.remove('hide');

    this.timerSubTitle.classList.remove('hide');

    if (this.counter !== 10) this.btnAddPomodoro.classList.remove('hide');
  }

  /**
   * starts after renderBreak's end
   */
  breakisOver() {
    document.getElementById('btnFinish').classList.remove('hide');

    this.minutesText.classList.add('hide');
    this.timerSubTitle.classList.add('hide');
    this.timerText.innerHTML = 'Break <br />is over';
    this.timerText.classList.add('line-height');
  }

  /**
   * starts when task will be completed
   */
  renderFinish() {
    this.hideBtns();

    this.timerText.innerHTML = 'You<br />Completed <br />Task';
    this.minutesText.classList.add('hide');
    this.timerSubTitle.classList.add('hide');
    this.timerText.classList.add('line-height');
    this.header.classList.remove('hidden');
    this.arrowLeft.classList.remove('hidden');
    this.arrowRight.classList.remove('hidden');
    this.timerBlock.classList.add('full');
    this.btnAddPomodoro.classList.add('hide');
    this.default = false;
  }
  /**
   * Just method with listeners fro starting functions after clicking
   * on some elements
   * 
   * @param {Object} main On which node elem need to attach listener
   */
  attachListeners(main) {
    main.addEventListener('click', (e) => {
      const { target } = e;

      if (target.classList.contains('icon-add') && this.counter !== 10) {
        this.counter++;

        const span = document.createElement('span');

        span.classList.add('tomato');
        span.setAttribute('data-fill', 'false');

        this.btnAddPomodoro.before(span);

        if (this.counter === 10) this.btnAddPomodoro.classList.add('hide');
      } else if (target.id === 'btnStart') {
        this.renderStart();

        eventBus.publish(constants.TIMER_START, 'workTime');
      } else if (target.id === 'btnFinishPomodora') {
        this.renderBreak();

        eventBus.publish(constants.CLEAR_TIMER);

        document.querySelector(
          '.tomato[data-fill="false"]',
        ).style.backgroundImage = 'url("../images/fill tomato.svg")';
        document
          .querySelector('.tomato[data-fill="false"]')
          .setAttribute('data-fill', 'true');
        eventBus.publish(constants.CHANGE_POMODORO, 'done');

        jQuery('#wrapper').notification('info', 'You finished pomodoro!', 4);

        if (this.counter == this.model.iteration) {
          this.renderFinish();

          eventBus.publish(constants.COMPLETE_TASK, this.counter);
        } else {
          eventBus.publish(constants.TIMER_START, 'Break');
        }
      } else if (target.id === 'btnFailPomodora') {
        this.renderBreak();

        eventBus.publish(constants.CLEAR_TIMER);
        document.querySelector(
          '.tomato[data-fill="false"]',
        ).style.backgroundImage = 'url("../images/tomato-failed.svg")';
        document
          .querySelector('.tomato[data-fill="false"]')
          .setAttribute('data-fill', 'true');

        eventBus.publish(constants.CHANGE_POMODORO, 'fail');

        if (this.counter == this.model.iteration) {
          this.renderFinish();

          eventBus.publish(constants.COMPLETE_TASK, this.counter);
        } else {
          eventBus.publish(constants.TIMER_START, 'Break');
        }
      } else if (target.id === 'btnStartPomodora') {
        this.renderStart();

        eventBus.publish(constants.CLEAR_TIMER);
        eventBus.publish(constants.TIMER_START, 'workTime');
      } else if (target.id === 'btnFinish') {
        this.renderFinish();

        eventBus.publish(constants.COMPLETE_TASK, this.counter);
      }
    });

    this.arrowLeft.addEventListener('click', () => {
      if (this.default) {
        eventBus.publish(constants.RESET_TASK);
        eventBus.publish(constants.SHOW_TASKLIST_PAGE);
      } else {
        eventBus.publish(constants.SHOW_TASKLIST_PAGE);
      }
    });

    this.arrowRight.addEventListener('click', () => {
      eventBus.publish(constants.SHOW_REPORT_PAGE);
    });
  }
}
