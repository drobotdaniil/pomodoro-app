import { ReportView } from './report-view';
import { ReportModel } from './report-model';
import { firebaseDB } from '../../firebase-api';

/**
 * Report page Controller class
 * @namespace ReportController
 */
export class ReportController {
  /**
   * constructor of ReportController class
   * @constructs ReportController
   * @memberof ReportController
   */
  constructor() {
    this.model = new ReportModel();
    this.view = new ReportView(this.model);

    this.model.registerObserver(this.view);
  }

  /**
   * Rendering method which is needed for Router class.
   * Load another method
   */
  render() {
    this.getTasksInfo();
  }

  /**
   * method which gets tasks data from db,
   * sets it to array by Model's method and then sort it
   */
  getTasksInfo() {
    firebaseDB.getInfo('/tasks', (items) => {
      this.model.setItems(items);
      this.model.sortData(this.view.sortBy, this.view.filterByDate);
    });
  }
}
