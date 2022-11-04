import {
  compose,
  legacy_createStore as createStore,
  combineReducers,
} from "redux";

const LOGIN_ACTION = {
  type: "LOGIN",
};

// keyof S
const initialState = {
  user: {
    // S[K]
    isLoggedIn: false,
    data: null,
  },
  posts: [],
};

const reducer = combineReducers({
  user: (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          isLoggedIn: false,
          data: {
            nickname: "닉네임",
            password: "1234",
          },
        };
      default:
        return state;
    }
  },
  posts: (state, action) => {
    return state;
  },
});

const store = createStore(reducer, initialState);
store.dispatch(LOGIN_ACTION);
