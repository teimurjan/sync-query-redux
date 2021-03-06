// @flow
type ActionCreator = (
  search: string | Object
) => { type: string, [key: string]: any };

type Selector = (state: Object) => any;

export type Options = {
  parseQuery?: boolean,
  stringifyState?: boolean,
  replaceState?: boolean,
  relyOn?: "location" | "state"
};

interface ISyncer {
  constructor(
    pathname: string,
    actionCreator: ActionCreator,
    selector: Selector,
    options: ?Options,
  ): void;
}

class Syncer implements ISyncer {
  pathname: string;
  actionCreator: ActionCreator;
  selector: Selector;
  options: Options;

  constructor(
    pathname: string,
    actionCreator: ActionCreator,
    selector: Selector,
    options: ?Options
  ) {
    this.pathname = pathname;
    this.actionCreator = actionCreator;
    this.selector = selector;
    this.options = options || {};
  }
}

export default Syncer;
