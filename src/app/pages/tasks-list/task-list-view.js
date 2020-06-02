import './task-list.less';
import taskTemplate from './task-list.hbs';
import { ConfigClass } from '../../helpers/config-helper';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';
import { TaskController } from './task/task-controller';

/**
 * View for Task-List page
 * @namespace TaskListView
 */
export class TaskListView extends ConfigClass {
  /**
   * constructor for TaskListView
   * @constructs TaskListView
   * @memberof TaskListView
   * @param {Object} model instance of Model Class 
   */
  constructor(model) {
    super();
    this.todo = true;
    this.done = false;
    this.model = model;
    this.priority = 'all';
    this.state = 'to-do';
    this.object = {};
    this.removeMode = false;
  }

  /**
   * main function that render main content 
   * with neccessary context for template
   * 
   * @param {Array} data 
   */
  render(data) {
    this.hasGlobalListItems = this.items.find(
      (task) => task.status === 'GLOBAL_LIST',
    );
    this.hasDailyListItems = this.items.find(
      (task) => task.status === 'DAILY_LIST',
    );
    this.hasCompletedItems = this.items.find(
      (task) => task.status === 'COMPLETED',
    );

    this.configPage();
    this.wrapper.append(this.main);

    this.main.innerHTML = taskTemplate(this.checkWhatToLoad());

    if (this.hasCompletedItems) {
      document.getElementById(`${this.state}`).classList.add('active');
    }

    if (this.hasGlobalListItems && this.todo) {
      [...document.querySelectorAll('.priority')]
        .find((item) => item.textContent.toLowerCase() === `${this.priority}`)
        .classList.add('active');
    }

    if (!this.hasGlobalListItems && this.todo && this.hasDailyListItems) {
      document.querySelector('.global-list').classList.add('hide');
      document.querySelector('.priority-tabs').classList.add('hide');
    }

    if (this.todo) {
      this.renderDailyList();
      this.renderGlobalList(data);
    }

    if (this.done) {
      this.renderDailyList();
      document.getElementById('selecting-daily').style.display = 'none';
    }

    if (!this.hasDailyListItems && !this.hasGlobalListItems) {
      localStorage.setItem('hasItem', false);
    }

    if (this.hasDailyListItems) {
      localStorage.setItem('hasItem', false);
    }

    if (localStorage.getItem('hasItem') == 'true' && this.todo) {
      document.querySelector('.priority-list').innerHTML = `
      <div class="message excellent">
        <h3 class="message__info">
          Excellent,<br />
          all daily tasks done! :)
        </h3>
      </div>
      `;
    }

    localStorage.setItem('hasItem', true);

    document.querySelector('.icon-list').classList.add('active');

    if (!this.removeMode) {
      this.count = document.querySelector('.count');
      this.count.classList.add('hidden');
      this.count.textContent = '';
      this.model.deleteArray = [];
    }

    if (this.removeMode) this.removeModeOn();

    this.attachListeners(this.main);
    history.pushState({ href: '/task-list' }, null, '/task-list');
  }

/**
  * Observe's method calls 
  * each time when calls neccessary model's method
  * 
  * @param {Object} model 
  */
  observe(model) {
    this.model = model;
    this.items = model.globalListItems;
    this.render(model.data);
  }

  /**
   * function for tepmplate's context(what need to be loaded)
   */
  checkWhatToLoad() {
    if (this.todo) {
      document.querySelector('.icon-trash').classList.remove('hidden');

      if (this.hasDailyListItems) {
        return (this.object = {
          show: true,
          showGlobal: true,
        });
      }

      if (!this.hasDailyListItems && this.hasGlobalListItems) {
        return (this.object = {
          show: true,
          dragFirstTaskToTop: true,
          showGlobal: true,
        });
      }

      if (
        !this.hasDailyListItems
        && !this.hasGlobalListItems
        && this.hasCompletedItems
      ) {
        document.querySelector('.icon-trash').classList.add('hidden');
        return (this.object = {
          show: true,
          noAnyTaskTemplate: true,
        });
      }

      if (this.items.length === 0) {
        document.querySelector('.icon-trash').classList.add('hidden');
        return (this.object = {
          addFirstTaskTemplate: true,
        });
      }
    }

    if (this.done) {
      if (this.hasCompletedItems) {
        return (this.object = {
          show: true,
        });
      }
      document.querySelector('.icon-trash').classList.add('hidden');
      return (this.object = {
        noDoneTaskTemplate: true,
        show: true,
      });
    }
  }

  /**
   * funtcion for rendering DailyList
   */
  renderDailyList() {
    this.items.forEach((task) => {
      if (this.todo && task.status === 'DAILY_LIST') {
        new TaskController(document.querySelector('.priority-list'), task);
      } else if (this.done && task.status === 'COMPLETED') {
        new TaskController(document.querySelector('.priority-list'), task);
        document.querySelector('.priority-list').classList.add('done-tasks');
      }
    });
  }

  /**
   * 
   * Function for rendering Globa List
   * 
   * @param {Array} data 
   */
  renderGlobalList(data) {
    this.out = document.querySelector('.global-list-output');

    data.forEach((task) => {
      if (task.status === 'GLOBAL_LIST') {
        if (task.categoryId === 'sport') {
          this.createCategory('sport', task);
        } else if (task.categoryId === 'education') {
          this.createCategory('education', task);
        } else if (task.categoryId === 'hobby') {
          this.createCategory('hobby', task);
        } else if (task.categoryId === 'work') {
          this.createCategory('work', task);
        } else if (task.categoryId === 'other') {
          this.createCategory('other', task);
        }
      }
    });
  }

  /**
   * 
   * Function for creating category in global list
   * and append to it task with current category
   * 
   * @param {string} categoryClass 
   * @param {Object} task 
   */
  createCategory(categoryClass, task) {
    if (!this.out.querySelector(`.${categoryClass}`)) {
      const taskGroup = document.createElement('div');

      taskGroup.classList.add('task-group');
      taskGroup.classList.add(categoryClass);
      const groupTitle = document.createElement('h4');

      groupTitle.classList.add('task-group__title');
      groupTitle.classList.add('uppercase');
      const circle = document.createElement('span');

      circle.classList.add('circle');
      const emptyCircle = document.createElement('span');

      emptyCircle.classList.add('empty-circle');
      circle.append(emptyCircle);
      const title = document.createElement('span');

      title.textContent = categoryClass.toUpperCase();
      groupTitle.append(circle);
      groupTitle.append(title);
      taskGroup.append(groupTitle);
      this.out.append(taskGroup);
    }

    new TaskController(this.out.querySelector(`.${categoryClass}`), task);
  }

  /**
   * Attach main content by Listenr
   * @param {Object} main 
   */
  attachListeners(main) {
    main.addEventListener('click', (e) => {
      const { target } = e;

      if (target.classList.contains('icon-add')) {
        eventBus.publish(constants.SHOW_MODAL_ADD);
      }

      if (
        target.textContent === 'Select All'
        && target.parentNode.parentNode.id === 'selecting-daily'
      ) {
        e.preventDefault();

        const selectedArr = [];

        document
          .querySelector('.priority-list')
          .getElementsByClassName('task-item')
          .forEach((item) => {
            item
              .querySelector('.task-item__left')
              .classList.add('task-item__left--selected');
            selectedArr.push({ id: item.dataset.id });
          });

        eventBus.publish(constants.MANIPULATE_WITH_BAG, {
          data: selectedArr,
          state: true,
        });
      } else if (
        target.textContent === 'Deselect All'
        && target.parentNode.parentNode.id === 'selecting-daily'
      ) {
        e.preventDefault();

        const selectedArr = [];

        document
          .querySelector('.priority-list')
          .getElementsByClassName('task-item')
          .forEach((item) => {
            item
              .querySelector('.task-item__left')
              .classList.remove('task-item__left--selected');
            selectedArr.push({ id: item.dataset.id });
          });

        eventBus.publish(constants.MANIPULATE_WITH_BAG, {
          data: selectedArr,
          state: false,
        });
      } else if (
        target.textContent === 'Select All'
        && target.parentNode.parentNode.id === 'selecting-global'
      ) {
        e.preventDefault();

        const selectedArr = [];

        document
          .querySelector('.global-list')
          .getElementsByClassName('task-item')
          .forEach((item) => {
            item
              .querySelector('.task-item__left')
              .classList.add('task-item__left--selected');
            selectedArr.push({ id: item.dataset.id });
          });

        eventBus.publish(constants.MANIPULATE_WITH_BAG, {
          data: selectedArr,
          state: true,
        });
      } else if (
        target.textContent === 'Deselect All'
        && target.parentNode.parentNode.id === 'selecting-global'
      ) {
        e.preventDefault();

        const selectedArr = [];

        document
          .querySelector('.global-list')
          .getElementsByClassName('task-item')
          .forEach((item) => {
            item
              .querySelector('.task-item__left')
              .classList.remove('task-item__left--selected');
            selectedArr.push({ id: item.dataset.id });
          });

        eventBus.publish(constants.MANIPULATE_WITH_BAG, {
          data: selectedArr,
          state: false,
        });
      } else if (target.id === 'to-do') {
        e.preventDefault();

        this.todo = true;
        this.done = false;
        this.state = target.id;

        eventBus.publish(constants.SORT_TASKS_PRIORITY, {
          priority: this.priority,
          state: this.state,
        });
      } else if (target.id === 'done') {
        e.preventDefault();

        this.todo = false;
        this.done = true;
        this.state = target.id;

        this.render();
        document.querySelector('.tasks').classList.remove('removing');
      } else if (target.classList.contains('priority')) {
        e.preventDefault();

        this.priority = target.textContent.toLowerCase();

        eventBus.publish(constants.SORT_TASKS_PRIORITY, {
          priority: this.priority,
          state: this.state,
        });
      } else if (target.id === 'globalList' || target.id === 'globalArrow') {
        document.querySelector('.global-list-output').classList.toggle('hide');
        document.querySelector('.priority-tabs').classList.toggle('hide');
        document
          .getElementById('globalArrow')
          .classList.toggle('icon-global-list-arrow-right');
      }
    });
  }

  /**
   * function for remove mode 
   */
  removeModeOn() {
    document.querySelector('.tasks').classList.add('removing');
    document
      .querySelector('.navigation-link.active')
      .classList.remove('active');
    document.querySelector('.icon-trash').classList.add('active');

    this.removeMode = true;

    if (!this.hasDailyListItems) {
      document.getElementById('selecting-daily').style.display = 'none';
    }

    if (this.hasGlobalListItems && this.todo) {
      document.querySelector('.global-list-output').classList.remove('hide');
      document.querySelector('.priority-tabs').classList.remove('hide');
    }

    if (!this.hasGlobalListItems) {
      document.getElementById('selecting-global').style.display = 'none';
    }

    this.model.deleteArray.forEach((item) => {
      if (document.querySelector(`[data-id='${item.id}']`)) {
        document
          .querySelector(`[data-id='${item.id}']`)
          .children[0].classList.add('task-item__left--selected');
      }
    });
  }

  /**
   * Calculate selected items which are prepared for deleting
   */
  calcSelectedTasks() {
    this.count.classList.remove('hidden');
    this.count.textContent = this.model.deleteArray.length;

    if (this.model.deleteArray.length === 0) this.count.classList.add('hidden');
  }
}
