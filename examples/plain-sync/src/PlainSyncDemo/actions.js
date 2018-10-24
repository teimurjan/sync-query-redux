export const ActionTypes = {
  INCREMENT: "PLAIN_SYNC_DEMO/INCREMENT",
  DECREMENT: "PLAIN_SYNC_DEMO/DECREMENT",
  SET_COUNTER: "PLAIN_SYNC_DEMO/SET_COUNTER"
};

export const increment = () => ({ type: ActionTypes.INCREMENT });
export const decrement = () => ({ type: ActionTypes.DECREMENT });
export const setCounter = ({ counter: counterStr }) => ({
  type: ActionTypes.SET_COUNTER,
  counter: parseInt(counterStr || '0', 10)
});
