import { ActionTypes } from "./actions";

export const counter = (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return state + 1;
    case ActionTypes.DECREMENT:
      return state - 1;
    case ActionTypes.SET_COUNTER:
      return action.value;
    default:
      return state;
  }
};
