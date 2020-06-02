import { TaskListView } from './task-list-view';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';
import { TaskListModel } from './task-list-model';
import { firebaseDB } from '../../firebase-api';

/**
 * Controller for Task-List page
 * @namespace TaskListController 
 */
export class TaskListController {
  /**
   * constructor of TaskListController
   * @constructs TaskListController
   * @memberof TaskListController
   */
  constructor() {
    this.model = new TaskListModel();
    this.view = new TaskListView(this.model);
    this.model.registerObserver(this.view);

    this.subscribeToEvents();
  }

  /**
   * 
   * Rendering method which is needed for Router class.
   * Load another method
   */
  render() {
    this.getTasksInfo();
    this.view.removeMode = false;
  }

  /**
   * method for subscribing to events from eventBus
   */
  subscribeToEvents() {
    eventBus.subscribe(constants.REMOVING_MODE_ON, () => {
      this.view.removeModeOn();
    });

    eventBus.subscribe(constants.LIFT_TASK_UP, () => {
      this.getTasksInfo();
    });

    eventBus.subscribe(constants.ADD_TASK_TO_DELETE_ARR, (data) => {
      if (this.model.deleteArray.find((item) => item.id === data.id)) {
        this.model.deleteArray = this.model.deleteArray.filter((task) => task.id !== data.id);
      } else {
        this.model.deleteArray.push(data);
      }
      this.view.calcSelectedTasks();
    });

    eventBus.subscribe(constants.REMOVE_TASKS_FROM_EVERYWHERE, () => {
      this.deleteTasks();
      this.getTasksInfo();
      this.view.calcSelectedTasks();
    });

    eventBus.subscribe(constants.ADD_TASK, (task) => {
      this.addTask(task);
    });

    eventBus.subscribe(constants.UPDATE_TASK, (task) => {
      this.addTask(task);
    });

    eventBus.subscribe(constants.REMOVE_TASK_FROM_MODAL, (task) => {
      this.model.deleteArray.push(task);
    });

    eventBus.subscribe(constants.SORT_TASKS_PRIORITY, (param) => {
      this.model.sortItemsByPriority(param.priority, param.sort);
    });

    eventBus.subscribe(constants.MANIPULATE_WITH_BAG, (obj) => {
      this.model.deleteMode(obj.data, obj.state);
      this.view.calcSelectedTasks();
    });
  }

  /**
   * getting tasks from FB and transfer it to model's method 
   */
  getTasksInfo() {
    firebaseDB.getInfo('/tasks', (items) => {
      this.model.setItems(items);
      this.model.sortItemsByPriority(this.view.priority, this.view.state);
    });
  }

  /**
   * Add task to FB
   * 
   * @param {Object} task {id: '21212', title: 'title', ...} 
   */
  addTask(task) {
    firebaseDB.setInfo(`tasks/${task.id}`, task, 'task');
    this.getTasksInfo();
    localStorage.setItem('hasItem', false);
  }

  /**
   * Delete selected tasks(this.model.deleteArray) from FB 
   */
  deleteTasks() {
    this.model.deleteArray.forEach((task) => {
      firebaseDB.deleteInfo(`tasks/${task.id}`);
    });
    this.model.deleteArray = [];
    this.view.removeMode = false;
  }
}
