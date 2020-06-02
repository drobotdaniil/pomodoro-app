import jQuery from 'jquery';
import { firebaseDB } from '../../firebase-api';
import radialTimer from '../../plugins/radialTimer';

/**
 * Timer page Model class
 * @namespace TimerModel
 */
export class TimerModel {
/**
  * constructor of TimerModel class
  * @constructs TimerModel
  * @memberof TimerModel
 */
  constructor() {
    this.task;
    this.iteration = 0;

    this.observers = [];

    this.notify = this.notify.bind(this);
  }

/**
  * Observer's method to register observer(View)
  * @param {Object} observer 
  */
  registerObserver(observer) {
    this.observers.push(observer);
  }

/**
  * Observer's method for notifing view's method observe
  * each time when calls neccessary model's method
  */
  notify() {
    this.observers.forEach((observer) => observer.observe(this));
  }

  /**
   * Getting data from FB
   */
  getTimeFromFB() {
    firebaseDB.getInfo('settings/', (timeObj) => {
      this.workTime = timeObj.workTime;
      this.workIteration = timeObj.workIteration;
      this.shortBreak = timeObj.shortBreak;
      this.longBreak = timeObj.longBreak;
    });

    this.timer = jQuery('.circle').radialTimer();
  }

  /**
   * Changing current task params(completedCount or failedPomodoros)
   * 
   * @param {string} state  
   */
  changePomodoros(state) {
    if (state === 'done') {
      this.task.completedCount++;
    } else if (state === 'fail') {
      this.task.failedPomodoros++;
    }
  }

  /**
   * Changing task params and setting new data to FB
   * 
   * @param {number} counter 
   */
  completeTask(counter) {
    this.task.status = 'COMPLETED';
    this.task.estimation = counter;
    this.task.completeDate = Date.now();

    if (this.iteration % this.workIteration === 0) {
      firebaseDB.setInfo(`tasks/${this.task.id}`, this.task, 'long-break');
    } else {
      firebaseDB.setInfo(`tasks/${this.task.id}`, this.task, 'completed');
    }

    this.iteration = 0;
  }

  /**
   * Reset task status from ACTIVE to DAILY
   */
  resetTask() {
    this.task.status = 'DAILY_LIST';
    firebaseDB.setInfo(`tasks/${this.task.id}`, this.task);
  }

  /**
   * Start timer in different mode(workTime or Break)
   * 
   * @param {string} mode  
   */
  startTimer(mode) {
    if (mode === 'workTime') {
      this.iteration++;

      this.started = this.timer.start(this.workTime);
    } else if (mode === 'Break') {
      if (this.iteration % this.workIteration === 0) {
        this.started = this.timer.start(this.longBreak, this.notify);
      } else {
        this.started = this.timer.start(this.shortBreak, this.notify);
      }
    }
  }

  /**
   * clear current timer
   */
  clearTimer() {
    this.timer.clear(this.started);
  }
}
