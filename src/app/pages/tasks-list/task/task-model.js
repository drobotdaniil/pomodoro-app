import { firebaseDB } from '../../../firebase-api';

/**
 * Task model Class
 * @namespace TaskModel
 */
export class TaskModel {
  /**
   * 
   * @param {Object} task {id: "12121", title: "Title", ...}
   */
  constructor(task) {
    this.task = task;
    this.dailyLength = [];
  }

  /**
   * Changing current task status and set it to FB
   * 
   * @param {string} status  
   */
  changeStatus(status) {
    this.task.status = status;
    // if (status === "DAILY_LIST") {
    firebaseDB.setInfo(`tasks/${this.task.id}`, this.task, 'daily');
    // } else {
    //   firebaseDB.setInfo(`tasks/${this.task.id}`, this.task);
    // }
  }

  /**
   * Method which is called each time when 
   * we need to render task and its data for template
   * 
   * @return {Object} {id: "12121", title: "Title", ...}
   */
  getTaskInfo() {
    return {
      id: this.task.id,
      title: this.task.title,
      description: this.task.description,
      categoryId: this.task.categoryId,
      priority: this.task.priority,
      estimation: this.task.estimation,
      deadlineDay:
        this.task.status === 'COMPLETED'
          ? new Date(this.task.completeDate).getDate()
          : this.task.deadline.split('-')[0],
      deadlineMonth:
        this.task.status === 'COMPLETED'
          ? new Date(this.task.completeDate).toLocaleString('en-US', {
            month: 'long',
          })
          : new Date(
            this.task.deadline
              .split('-')
              .reverse()
              .join('-'),
          ).toLocaleDateString('en', {
            month: 'long',
          }),
      status: this.task.status,
      today:
        this.task.status === 'COMPLETED'
          ? new Date(this.task.completeDate)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-')
            === new Date(Date.now()).toLocaleDateString('en-GB').replace(/\//g, '-')
          : this.task.deadline
            === new Date(Date.now())
              .toLocaleDateString('en-GB')
              .replace(/\//g, '-'),
      overdue:
        Date.parse(
          this.task.deadline
            .split('-')
            .reverse()
            .join('-'),
        )
          < Date.parse(
            new Date(Date.now())
              .toLocaleDateString('en-GB')
              .split('/')
              .reverse()
              .join('-'),
          ) && !this.task.completeDate,
      hasTitle: this.task.status === 'DAILY_LIST',
    };
  }
}
