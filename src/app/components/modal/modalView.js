import $ from 'jquery';
import modalAddTemplate from './modal-add.hbs';
import modalRemoveTemplate from './modal-remove.hbs';
import './modal.less';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';
import 'jquery-ui/ui/widgets/datepicker';

/**
 * Modal form View class
 * @namespace ModalView
 */
export class ModalView {
  /**
   * constructor for Modal View
   * @constructs ModalView
   * @memberof ModalView
   * @param {Object} root  Node elem in which need to be appended
   * @param {Object} model instance of Model class 
   */
  constructor(root, model) {
    this.root = root;
    this.model = model;
  }

  /**
   * Removing modal form from root
   */
  removeModal() {
    if (document.querySelector('.modal-wrapper')) {
      document.querySelector('.modal-wrapper').remove();
    }
    if (document.getElementById('ui-datepicker-div')) {
      document.getElementById('ui-datepicker-div').remove();
    }
  }

  /**
   * create wrapper over modal-from
   */
  createModal() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal-wrapper');
  }

  /**
   * render modal-form with neccessary context
   * and attach on it listeners
   */
  render() {
    this.createModal();
    this.modal.innerHTML = modalAddTemplate({ AddModal: true });

    this.root.append(this.modal);
    this.attachListeners(this.modal);
    document.getElementById('deadline').value = new Date(Date.now())
      .toLocaleDateString('en-GB')
      .split('/')
      .join('-');

    $('#deadline').datepicker({
      minDate: 0,
      dateFormat: 'dd-mm-yy',
    });

    document.getElementById('taskTitle').focus();
  }

  /**
   * Render Edit modal with current task's params
   * 
   * @param {Object} task 
   * @param {Object} edit 
   */
  renderEdit(task, edit) {
    this.createModal();
    this.modal.innerHTML = modalAddTemplate(edit);

    this.root.append(this.modal);
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.description;
    document
      .querySelector('input[name="category"]:checked')
      .removeAttribute('checked');
    document
      .querySelector('input[name="priority"]:checked')
      .removeAttribute('checked');
    document
      .querySelector(`input[id='${task.categoryId}']`)
      .setAttribute('checked', 'checked');
    document
      .querySelector(`input[id='${task.priority}']`)
      .setAttribute('checked', 'checked');

    document.getElementById('deadline').value = task.deadline;

    document
      .querySelector(`input[value='${task.estimation}']`)
      .setAttribute('checked', 'checked');

    document.getElementById('taskTitle').focus();

    this.attachListeners(this.modal);

    this.id = task.id;
    this.status = task.status;

    $('#deadline').datepicker({
      minDate: 0,
      dateFormat: 'dd-mm-yy',
    });
  }

  /**
   * Render remove modal
   */
  renderRemove() {
    this.createModal();
    this.modal.classList.add('modal-remove');
    this.modal.innerHTML = modalRemoveTemplate();

    this.root.append(this.modal);
    this.attachListeners(this.modal);
  }

  /**
   * Add listeners on modal
   * Validate inputs
   * 
   * @param {Object} modal Node elem modal
   */
  attachListeners(modal) {
    const sectionButtons = document.querySelector('.section-buttons');

    modal.addEventListener('click', (e) => {
      const { target } = e;

      if (target.id === 'topCloseBtn') {
        this.removeModal();
      } else if (target.id === 'topTrashBtn') {
        this.renderRemove();
        eventBus.publish(
          constants.REMOVE_TASK_FROM_MODAL,
          this.model.createTask(this.id, true),
        );
        this.removeModal();
      }
    });

    if (sectionButtons) {
      sectionButtons.addEventListener('click', (e) => {
        if (e.target.id === 'cancel') {
          this.removeModal();
        } else if (e.target.id === 'remove') {
          eventBus.publish(constants.REMOVE_TASKS_FROM_EVERYWHERE);
          this.removeModal();
        }
      });
    }

    modal.addEventListener('submit', (e) => {
      e.preventDefault();

      if (
        document.querySelector('.modal__title').textContent === 'Edit Task'
        && document.getElementById('taskTitle').value.trim().length >= 6
        && document.getElementById('taskDesc').value.trim().length >= 6
      ) {
        eventBus.publish(
          constants.UPDATE_TASK,
          this.model.createTask(this.id, false, this.status),
        );
        this.removeModal();
      } else if (
        document.querySelector('.modal__title').textContent === 'Add Task'
        && document.getElementById('taskTitle').value.trim().length >= 6
        && document.getElementById('taskDesc').value.trim().length >= 6
      ) {
        eventBus.publish(constants.ADD_TASK, this.model.createTask());
        this.removeModal();
      }
    });

    [...document.querySelectorAll('input[placeholder]')].forEach((input) => {
      input.addEventListener('change', (e) => {
        const { value } = e.target;

        if (value.trim().length < 6) {
          input.setCustomValidity(
            'Min field\'s length should be more than 6 symbols',
          );
        } else {
          input.setCustomValidity('');
        }
      });
    });
  }
}
