/**
 * This is just a simple router which loads
 * page's render function when you 
 * navigate to it
 * @namespace Router
 */

export class Router {
/**
  * constructor for Router class
  * @constructs Router
  * @memberof Router
  */
  constructor() {
    this.routes = {};
  }

  /**
   * Load page's instance
   * @param {string} path 
   */
  load(path) {
    this.routes[path].render();
  }

  /**
   * Method for clearing slashes from href
   * @param {string} href
   */
  clearSlashes(href) {
    return href
      .toString()
      .replace(/.+\/\//, '')
      .replace(/.+\//, '/');
  }

  /**
   * Add paths to router
   * @param {string} path - name of route
   * @param {Object} page  - page's instance
   */
  add(path, page) {
    this.routes[path] = page;
  }

  /**
   * Method for navigation through the site
   * @param {string} href 
   */
  navigate(href) {
    const path = this.clearSlashes(href);

    this.load(path);
  }
}
