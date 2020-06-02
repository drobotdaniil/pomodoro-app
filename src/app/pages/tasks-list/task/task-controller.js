import { TaskModel } from './task-model';
import { TaskView } from './task-view';

/**
 * Class for each task
 * calls each time when needs to render task-list page 
 * @namespace TaskController
 */
export class TaskController {
  /**
   * constructor of TaskController
   * @constructs TaskController
   * @memberof TaskController
   * @param {Object} root in which place need to be appended
   * @param {Object} task Object with data {id: "12121", title: "Title", ...}
   */
  constructor(root, task) {
    this.model = new TaskModel(task);
    this.view = new TaskView(root, this.model);

    this.init();
  }

  init() {
    this.view.render();
  }
}
