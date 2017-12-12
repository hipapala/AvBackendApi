import {  
    applyMiddleware,
    combineReducers,
    createStore,
  } from 'redux';
  
  // actions.js
  export const requestStart = () => ({  
    type: 'REQ_START'
  });
  
  export const requestFinish = () => ({  
    type: 'REQ_FINISH',
  });
  
  // reducers.js
  export const activeReq = (state = { activeReqCount: 0 }, action) => {  
    switch (action.type) {
      case 'REQ_START':
        return { activeReqCount: ++state.activeReqCount};
      case 'REQ_FINISH':
        return (state.activeReqCount > 0 ? {activeReqCount : --state.activeReqCount} : { activeReqCount: 0 });
      default:
        return state;
    }
  };
  
  export const reducers = combineReducers({  
    activeReq
  });
  
  // store.js
  export function configureStore(initialState = {}) {  
    const store = createStore(reducers, initialState);
    return store;
  };
  
  export const store = configureStore();  