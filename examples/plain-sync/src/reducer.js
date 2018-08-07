import { ActionTypes as PlainSyncActionTypes } from "./PlainSyncDemo/actions";

const initialState = {
  plainSyncCounter: 0
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case PlainSyncActionTypes.INCREMENT:
      return { plainSyncCounter: state.plainSyncCounter + 1 };
    case PlainSyncActionTypes.DECREMENT:
      return { plainSyncCounter: state.plainSyncCounter - 1 };
    case PlainSyncActionTypes.SET_COUNTER:
      return { plainSyncCounter: action.counter };
    default:
      return state;
  }
};
