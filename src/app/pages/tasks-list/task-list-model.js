/**
 * Task-List page Model class
 * @namespace ReportModel
 */
export class TaskListModel {
  /**
   * Constructor of Model class
   * @constructs TaskListModel
   * @memberof TaskListModel
   */
  constructor() {
    this.data = [];

    this.deleteArray = [];

    this.observers = [];
  }

   /**
   * Method which sets items from FB to an array
   * and then sort it by status completedeDate
   * @param {Object} items 
   */
  setItems(items) {
    this.globalListItems = [];
    this.items = items;

    if (items) {
      for (const item in items) {
        this.globalListItems.push(items[item]);
      }
    }

    this.globalListItems.sort((a, b) => b.completeDate - a.completeDate);

    this.data = this.globalListItems;
  }

  /**
   * Sorting method by priority and state
   * 
   * @param {string} priority 
   * @param {string} state 
   */
  sortItemsByPriority(priority, state) {
    if (state === 'to-do') {
      if (priority === 'all') {
        this.data = this.globalListItems;
      } else {
        this.data = this.globalListItems.filter(
          (item) => item.priority === priority,
        );
      }
    } else if (priority === 'all') {
      this.data = this.globalListItems;
    } else {
      this.data = this.globalListItems.filter(
        (item) => item.priority === priority,
      );
    }

    this.notify();
  }

  /**
   * Method for Selecting And Deselcting Tasks
   * push/filter deleteArray
   * 
   * @param {Array} data  [{id: '22121'}, {id:'215663'}]
   * @param {Boolean} state true/false
   */
  deleteMode(data, state) {
    if (state) {
      data.forEach((task) => {
        if (this.deleteArray.find((deleteTask) => deleteTask.id === task.id)) return;
        this.deleteArray.push(task);
      });
    } else {
      data.forEach((task) => {
        this.deleteArray = this.deleteArray.filter((deleteTask) => deleteTask.id !== task.id);
      });
    }
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
}
