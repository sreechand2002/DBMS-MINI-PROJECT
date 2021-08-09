export const initialState = null;

export const reducer1 = (state, action) => {
  if (action.type === 'USER') {
    return action.paylaod;
  }
  if (action.type === 'CLEAR') {
    return null;
  }
  return state;
};
