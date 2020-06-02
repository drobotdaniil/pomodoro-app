import { ModalView } from './modalView';
import { eventBus } from '../../helpers/eventBus';
import constants from '../../constants/constants';
import { ModalModel } from './modalModel';

/**
 * Modal Form Controller Class
 * @namespace ModalController
 */
export class ModalController {
  /**
   * constructor of ModalController Class
   * @constructs ModalController
   * @memberof ModalController
   * @param {Object} root Node elem where need to append modal form 
   */
  constructor(root) {
    this.model = new ModalModel();
    this.view = new ModalView(root, this.model);
    this.init();
  }

  /**
   * subscribe to events from eventbus channels
   */
  subscribeToEvents() {
    eventBus.subscribe(constants.SHOW_MODAL_ADD, () => {
      this.view.render();
    });
    eventBus.subscribe(constants.SHOW_MODAL_EDIT, (model) => {
      this.view.renderEdit(model.task, { EditModal: true });
    });
    eventBus.subscribe(constants.SHOW_MODAL_DELETE, () => {
      this.view.renderRemove();
    });
  }

  init() {
    this.subscribeToEvents();
  }
}
