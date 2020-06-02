import { RenderChart } from './renderChart';

/**
 * Report page Model class
 * @namespace ReportModel
 */
export class ReportModel {
/**
  * constructor of ReportModel class
  * @constructs ReportModel
  * @memberof ReportModel
  */
  constructor() {
    this.data = [];

    this.observers = [];
  }

  /**
   * Method which sets items from FB to an array
   * and then sort it by status 'COMPLETED'
   * @param {Object} items 
   */
  setItems(items) {
    this.globalListItems = [];

    if (items) {
      for (const item in items) {
        this.globalListItems.push(items[item]);
      }
    }

    this.data = this.globalListItems;
    this.data = this.data.filter((item) => item.status === 'COMPLETED');
  }

  /**
   * Observer's method for notifing view's method observe
   * each time when calls neccessary model's method
   */
  notify() {
    this.observers.forEach((observer) => observer.observe(this));
  }

  /**
   * Observer's method to register observer(View)
   * @param {Object} observer 
   */
  registerObserver(observer) {
    this.observers.push(observer);
  }

  /**
   * Method which filters current array with objects in range of last N days
   * @param {number} days how many days need to be filtered 
   */
  filterByDays(days) {
    this.arrByDate = [];
    this.data.forEach((item) => {
      for (let i = 0; i < days; i++) {
        if (
          new Date(item.completeDate).toLocaleDateString()
          === new Date(Date.now() - i * (1000 * 3600 * 24)).toLocaleDateString()
        ) {
          this.arrByDate.push(item);
        }
      }
    });
  }

  /**
   * Method which calculates completed tasks by priorities for each day 
   * 
   * @param {Array} arr Array of tasks (this.arrByDate)
   * @param {string} tab depending on which tab will be sorted array 
   * 
   * @returns {Array} {date: 12.02.2020, urgent: 0, middle: 5 ..., {}, ...}
   */
  calcData(arr, tab) {
    let mas = [];

    if (tab === 'pomodoros') {
      arr.forEach((item) => {
        mas.push({
          date: new Date(item.completeDate).toLocaleDateString('en-US'),
          failed: 0,
        });
        if (item.completedCount >= item.failedPomodoros) {
          if (
            typeof mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] === 'undefined'
          ) {
            mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] = item.completedCount;
          } else if (
            typeof mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] !== 'undefined'
          ) {
            mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] += item.completedCount;
          }
        } else if (
          typeof mas.find(
            (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
          )[item.priority] === 'undefined'
        ) {
          mas.find(
            (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
          )[item.priority] = item.completedCount;
        } else {
          mas.find(
            (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
          )[item.priority] += item.completedCount;
        }

        mas.find(
          (elem) => elem.date
            === new Date(item.completeDate).toLocaleDateString('en-US'),
        ).failed += item.failedPomodoros;
      });
    }

    if (tab === 'tasks') {
      arr.forEach((item) => {
        mas.push({
          date: new Date(item.completeDate).toLocaleDateString('en-US'),
          failed: 0,
        });
        if (item.completedCount >= item.failedPomodoros) {
          if (
            typeof mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] === 'undefined'
          ) {
            mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] = 1;
          } else {
            mas.find(
              (elem) => elem.date
                === new Date(item.completeDate).toLocaleDateString('en-US'),
            )[item.priority] += 1;
          }
        } else {
          mas.find(
            (elem) => elem.date
              === new Date(item.completeDate).toLocaleDateString('en-US'),
          ).failed += 1;
        }
      });
    }

    mas = mas.filter((item) => Object.keys(item).length > 2 || item.failed !== 0);

    mas.forEach((item) => {
      if (item.urgent === undefined) {
        item.urgent = 0;
      }
      if (item.high === undefined) {
        item.high = 0;
      }
      if (item.middle === undefined) {
        item.middle = 0;
      }
      if (item.low === undefined) {
        item.low = 0;
      }
    });

    mas.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    return mas;
  }

  /**
   * Method which sorts array which will be appended in RenderChart function
   * 
   * @param {string} sort By which tab will be Sorted 
   * @param {string} filter  By which tab will be filtered
   */
  sortData(sort, filter) {
    if (sort === 'tasks') {
      if (filter === 'day') {
        this.filterByDays(1);
      } else if (filter === 'week') {
        this.filterByDays(7);
      } else if (filter === 'month') {
        this.filterByDays(30);
      }
    } else if (sort === 'pomodoros') {
      if (filter === 'day') {
        this.filterByDays(1);
      } else if (filter === 'week') {
        this.filterByDays(7);
      } else if (filter === 'month') {
        this.filterByDays(30);
      }
    }
    this.arrByDate = this.calcData(this.arrByDate, sort);
    this.notify();

    RenderChart(document.querySelector('.graph'), this.arrByDate, sort, filter);
  }
}
