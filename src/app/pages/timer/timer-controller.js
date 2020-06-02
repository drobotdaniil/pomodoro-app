import { TimerView } from './timer-view';
import { TimerModel } from './timer-model';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';

/**
 * Timer page Controller class
 * @namespace TimerController
 */
export class TimerController {
  /**
   * constructor of TimerController class
   * Just init model and view
   * register Observer(View)
   * call Subscribe to events
   * @constructs TimerController
   * @memberof TimerController
   */
  constructor() {
    this.model = new TimerModel();
    this.view = new TimerView(this.model);

    this.model.registerObserver(this.view);

    this.subsribeToEvents();
  }

  /**
   * method for subscribing to events from eventBus
   */
  subsribeToEvents() {
    eventBus.subscribe(constants.SHOW_TIMER_PAGE, (model) => {
      this.model.task = model.task;
    });

    eventBus.subscribe(constants.CHANGE_POMODORO, (state) => {
      this.model.changePomodoros(state);
    });

    eventBus.subscribe(constants.COMPLETE_TASK, (counter) => {
      this.model.completeTask(counter);
    });

    eventBus.subscribe(constants.TIMER_START, (mode) => {
      this.model.startTimer(mode);
    });

    eventBus.subscribe(constants.CLEAR_TIMER, () => {
      this.model.clearTimer();
    });

    eventBus.subscribe(constants.RESET_TASK, () => {
      this.model.resetTask();
    });
  }

  /**
   *
   * Rendering method which is needed for Router class.
   * Load another methods(view's render, and model's method getting Data from FB)
   */
  render() {
    this.view.render();
    this.model.getTimeFromFB();
  }
}
