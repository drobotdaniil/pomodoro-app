import { FirstEntranceView } from './first-entrance-view';

/**
 * Class for First-Entrance page
 * @namespace FirstEntranceController
 */

export class FirstEntranceController {
  /**
   * constructor of FirstEntranceController class
   * @constructs FirstEntranceController
   * @memberof FirstEntranceController
   */
  constructor() {
    this.view = new FirstEntranceView();
  }

  /**
   * Just a simple method which render view's render method
   */
  render() {
    this.view.render();
  }
}
