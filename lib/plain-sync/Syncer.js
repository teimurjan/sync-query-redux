

class Syncer {

  constructor(pathname, actionCreator, selector, options = {}) {
    this.pathname = pathname;
    this.actionCreator = actionCreator;
    this.selector = selector;
    this.options = options;
  }
}


export default Syncer;