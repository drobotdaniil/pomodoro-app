/**
 * Modal form Model Class
 * @namespace ModalModel
 */
export class ModalModel {
  /**
   * constructor of ModalModel class
   * @constructs ModalModel
   * @memberof ModalModel
   */
  constructor() {}

  /**
   * 
   * CreateTask function for adding task to FB
   * 
   * @param {string} id 
   * @param {Boolean} removing 
   * @param {string} status 
   * 
   * @returns {Object} {id: '1212', title: 'Title', ...}
   */
  createTask(id, removing, status) {
    if (removing) {
      return { id };
    }
    return {
      id: id || (Math.random() * 100000).toFixed(),
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDesc').value,
      categoryId: document.querySelector('input[name="category"]:checked')
        .value,
      priority: document.querySelector('input[name="priority"]:checked').value,
      estimation: document.querySelector('input[name="estimation"]:checked')
        .value,
      deadline: document.getElementById('deadline').value,
      status: status === undefined ? 'GLOBAL_LIST' : status,
      createDate: Date.now(),
      completedCount: 0,
      failedPomodoros: 0,
      completeDate: 0
    };
  }
}
