import './report.less';
import reportTemplate from './report.hbs';
import { ConfigClass } from '../../helpers/config-helper';

/**
 * Report page View class
 * @namespace ReportView
 */
export class ReportView extends ConfigClass {
/**
  * constructor of ReportView class
  * @constructs ReportView
  * @memberof ReportView
  * @param {Object} model instance of ReportModelClass
  */
  constructor(model) {
    super();
    this.model = model;
    this.filterByDate = 'day';
    this.sortBy = 'tasks';
  }

  /**
   * Observe's method calls 
   * each time when calls neccessary model's method
   * 
   * @param {Object} model 
   */
  observe(model) {
    this.model = model;
    this.render();
  }

  /**
    * method for rendering Main Content,
    * attaching on it listener,
    * changing pushState
    */
  render() {
    this.configPage();
    this.wrapper.append(this.main);
    history.pushState(
      { href: `/report/${this.filterByDate}/${this.sortBy}` },
      null,
      `/report/${this.filterByDate}/${this.sortBy}`,
    );

    this.main.innerHTML = reportTemplate();

    document.querySelector('.icon-statistics').classList.add('active');
    document.getElementById(`${this.filterByDate}`).classList.add('active');
    document.getElementById(`${this.sortBy}`).classList.add('active');

    this.attachListeners(this.main);
  }

  /**
   * Just a simple method with listener
   * on tabs
   * @param {Object} main On which node elem need to attach listener
   */
  attachListeners(main) {
    main.addEventListener('click', (e) => {
      const { target } = e;

      if (target.parentElement.parentElement.id === 'filter') {
        e.preventDefault();
        document.querySelectorAll('#filter .tab-link').forEach((elem) => {
          elem.classList.remove('active');
        });
        this.filterByDate = `${target.id}`;
        document.getElementById(`${this.filterByDate}`).classList.add('active');
        this.model.sortData(this.sortBy, this.filterByDate);
      } else if (target.parentElement.parentElement.id === 'sort') {
        e.preventDefault();
        document.querySelectorAll('#sort .tab-link').forEach((elem) => {
          elem.classList.remove('active');
        });
        this.sortBy = `${target.id}`;
        document.getElementById(`${this.filterByDate}`).classList.add('active');
        this.model.sortData(this.sortBy, this.filterByDate);
      }
    });
  }
}
