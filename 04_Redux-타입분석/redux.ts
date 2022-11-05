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
    if (Array.isArray(state)) {
      switch (action.type) {
        case "ADD_POST":
          return [...state, action.data];
        default:
          return state;
      }
    }
  },
});

const store = createStore(reducer, initialState);
store.dispatch(LOGIN_ACTION);
store.dispatch({
  type: "ADD_POST",
  data: {
    id: 1,
    title: "title",
    content: "content",
  },
});
