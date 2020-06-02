import task from './task.hbs';
import { eventBus } from '../../../helpers/eventBus';
import constants from '../../../constants/constants';

/**
 * class TaskView
 * @namespace TaskView
 */
export class TaskView {
  /**
   * constructor of TaskView class
   * @constructs TaskView
   * @memberof TaskView
   * @param {Object} root in which place need to be appended
   * @param {Object} model instance of Model Class
   */
  constructor(root, model) {
    this.root = root;
    this.model = model;
  }

  /**
   * Render and attaching on task Listener
   */
  render() {
    const taskItem = document.createElement('div');

    taskItem.classList.add('wrapper-task');
    taskItem.innerHTML = task(this.model.getTaskInfo());

    this.root.append(taskItem);

    this.attachListeners(taskItem);
  }

    /**
   * Just method with listeners fro starting functions after clicking
   * on some elements
   * 
   * @param {Object} main On which node elem need to attach listener
   */
  attachListeners(item) {
    item.addEventListener('click', (e) => {
      const { target } = e;

      if (
        (target.classList.contains('task-item__priority')
          || target.classList.contains('icon-timer'))
        && this.model.task.status === 'DAILY_LIST'
      ) {
        // this.model.changeStatus("ACTIVE");
        eventBus.publish(constants.SHOW_TIMER_PAGE, { task: this.model.task });
      } else if (target.classList.contains('icon-edit')) {
        eventBus.publish(constants.SHOW_MODAL_EDIT, { task: this.model.task });
      } else if (
        target.classList.contains('icon-arrows-up')
        && document.querySelector('.priority-list').children.length < 5
      ) {
        this.model.changeStatus('DAILY_LIST');
        eventBus.publish(constants.LIFT_TASK_UP);
      } else if (
        target.classList.contains('remove')
        || target.classList.contains('icon-trash')
        || target.classList.contains('icon-close')
      ) {
        item
          .querySelector('.task-item__left')
          .classList.toggle('task-item__left--selected');
        eventBus.publish(constants.ADD_TASK_TO_DELETE_ARR, {
          id: this.model.task.id,
          status: this.model.task.status,
          priority: this.model.task.priority,
        });
      }
    });
  }
}
