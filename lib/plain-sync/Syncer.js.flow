// @flow
type ActionCreator = (
  search: string | Object
) => { type: string, [key: string]: any };

type Selector = (state: Object) => any;

type Options = {
  parseQuery?: boolean,
  stringifyState?: boolean,
  replaceState?: boolean,
  relyOn?: "location" | "state"
};

class Syncer {
  pathname: string;
  actionCreator: ActionCreator;
  selector: Selector;
  options: Options;

  constructor(
    pathname: string,
    actionCreator: ActionCreator,
    selector: Selector,
    options: Options = {}
  ) {
    this.pathname = pathname;
    this.actionCreator = actionCreator;
    this.selector = selector;
    this.options = options;
  }
}

export default Syncer;
