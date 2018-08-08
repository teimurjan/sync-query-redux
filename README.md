# sync-query-redux
The library is created for easily synchronization between URL query params and redux state.
Inspired by [redux-query-sync](https://github.com/Treora/redux-query-sync).

## Installation
Installation can be done with [npm](https://www.npmjs.com/)

```sh
npm install --save sync-query-redux
```

or [yarn](https://yarnpkg.com/en/)

```sh
yarn add sync-query-redux
```

## Usage
### plain-sync
```javascript
import { plainSync } from "sync-query-redux";
import createHistory from "history/createBrowserHistory";

const history = createHistory();

const cancelSynchronization = plainSync(
  store, // REDUX STORE
  [
    {
      pathname: "/somePathname",
      actionCreator: newQueryString => ({ type: "SOME_ACTION", newQueryString }),
      selector: state => state.queryString
    }
  ],
  {
    history
  }
);
```

The first parameter is the redux store. Second is the list of objects which I call `SyncObject`. You can pass as many sync objects as you want for synchronization. Third parameter is options object which requires only one `history` object of type `BrowserHistory`. After calling `plainSync` all passed sync objects will be in sync with you redux state. As the return value you receive the `cancel` function to stop the synchronization.

Working example can be found [here](./examples/plain-sync). You just need to run:
```sh
npm i
npm run start
```
or with yarn
```sh
yarn
yarn start
```

## API
### plain-sync
| Parameter   | Type                                          | Description                                                                                                                         |
| ----------- | :-------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| store       | [Redux Store](https://redux.js.org/api/store) | Redux store object.                                                                                                                 |
| syncObjects | Array of `SyncObject`.                        | Description of `SyncObject` is given below.                                                                                         |
| options     | `{ history: BrowserHistory }`                 | Options is the extra dependencies needed for the correct work of the library. For `plainSync` we need only `history` as dependency. |

#### SyncObject
Here is an interface of `SyncObject`
```javascript
type SyncObject = {
  pathname: string,
  actionCreator: (
    newQuery: string | Object
  ) => { type: string, [key: string]: any },
  selector: (state: Object) => string,
  parseQuery?: boolean,
  stringifyState?: boolean,
  replaceState?: boolean,
  initialFrom?: "location" | "state"
};
```
| Property       | Description                                                                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pathname       | Pathname for listening changes of your URL query params. In other words it is the path where you need the synchronization.                                                                                                 |
| actionCreator  | A function which receives a new query string/Object as parameter and returns an action to dispatch.                                                                                                                        |
| selector       | A function which receives your redux state as parameter and returns new query string built from the state.                                                                                                                 |
| parseQuery     | Flag determines whether to pass `newQuery` to `actionCreator` as parsed object(using [qs library](https://www.npmjs.com/package/qs)) or as a plain string.                                                                 |
| stringifyState | Flag determines whether to stringify value from `selector`(using [qs library](https://www.npmjs.com/package/qs)) or not.                                                                                                   |
| replaceState   | If `false`  query changes will be saved to the history(you'll have the possibility to go back to the previous query state). Otherwise you'll be moved to the previouse pathname ignoring all the query parameters changes. |
| initialFrom    | Determines from where to get the initial state: whether from your current query parameters(location) or from your redux state(state)                                                                                       |
|                |

## Plans
* Add more tests
* Add module params-sync in which `SyncObject` will not have selector and actionCreator, but a list of params where each param will have its selector and its actionCreator.
* Add one-side sync modules(listening only store/history).
* Make library available like a redux middleware

## Contributions
Contributors are welcome. Please discuss new features and submit PRs for bug fixes with tests.
Run `npm run build` which detects type errors, tests passing status and build the lib if everything is well.

## License
[MIT](./blob/master/LICENSE.md)