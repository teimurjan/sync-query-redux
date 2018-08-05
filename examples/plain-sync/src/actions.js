export const ActionTypes = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  SET_COUNTER: "SET_COUNTER"
};

export const increment = () => ({ type: ActionTypes.INCREMENT });
export const decrement = () => ({ type: ActionTypes.DECREMENT });
export const setCounter = ({ counter }) => ({
  type: ActionTypes.SET_COUNTER,
  value: counter
});
