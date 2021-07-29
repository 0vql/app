import { actions } from '../api';
import ws from '../services/ws';

export default store => next => async action => {
  if (action.type !== actions.wsCallBegan.type)
    return next(action);
  
  const { data, event, onStart, onSuccess } = action.payload;
  if (onStart)
    store.dispatch({ type: onStart });

  next(action);

  const callback = (payload) => {
    onSuccess && store.dispatch({ type: onSuccess, payload });
    store.dispatch(actions.wsCallSucceded(payload))
    // ws.off(event, callback);
    // ws.off('error', errorCallback);    
  };
  const errorCallback = payload =>
    store.dispatch(actions.wsCallFailed(payload));

  ws.on(event, callback);
  ws.on('error', errorCallback);

  ws.emit(event, data);
};