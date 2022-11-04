## named exports만 있는 Redux 알아보기

<br />

### `export default`와 `export =`이 없는 Redux. `index.d.ts`

`export default`와 `export =`가 없다는 의미는

```ts
import redux from "redux"; // 이와같이 사용할 일은 없다는 것이다. (export default)
```

```ts
// 이와 같이 'named export'만 불러와서 사용할 것이라는 의미.
import { compose, legacy_createStore as createStore } from "redux";
```

> `createStore`는 deprecated되어 만약 사용할 경우에 대한 안내도 주석으로 제공하고 있다.

```ts
/**
 * @deprecated
 *
 * **We recommend using the `configureStore` method
 * of the `@reduxjs/toolkit` package**, which replaces `createStore`.
 *
 * ...
 *
 * If you want to use `createStore` without this visual deprecation warning, use
 * the `legacy_createStore` import instead:
 *
 * `import { legacy_createStore as createStore} from 'redux'` ✅
 *
 */
export declare function createStore<S, A extends Action, Ext, StateExt>(
  // ...
```

### `ReducerMapObject`

#### 샘플코드

```ts
import {
  compose,
  legacy_createStore as createStore,
  combineReducers,
} from "redux";

const initialState = {
  user: {
    isLoggedIn: false,
    data: null,
  },
  posts: [],
};

const reducer = combineReducers({
  user: null,
  post: null,
}); // ❌ index.d.ts(112, 69): The expected type comes from property 'user' which is declared here on type 'ReducersMapObject<any, any>'
// → 우리는 현재 null만 넣었으므로...

const store = createStore(reducer, initialState);
```

> 에러 메세지의 `index.d.ts(112, 69)`를 사용해 에러에 해당하는 타입으로 갈 수 있다는 것은 몰랐다. 😳

<br />

#### `ReducerMapObject`, GTD.

```ts
/**
 * Object whose values correspond to different reducer functions.
 *
 * @template A The type of actions the reducers can potentially respond to.
 */
export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};
```

#### 반환타입 `Reducer`, GTD.

```ts
/**
 * ...
 *
 * Reducers are the most important concept in Redux.
 *
 * *Do not put API calls into reducers.*
 *
 * @template S The type of state consumed and produced by this reducer.
 * @template A The type of actions the reducer can potentially respond to.
 */
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;
```

> 설령 reducer가 뭔지 잘 모르겠더라도 `(state, action) => {}` 의 형식을 갖는 함수라는 것은 알 수 있다.

여기에 맞춰 샘플코드를 수정해보자.

#### 샘플코드 수정

```ts
import {
  compose,
  legacy_createStore as createStore,
  combineReducers,
} from "redux";

const initialState = {
  user: {
    isLoggedIn: false,
    data: null,
  },
  posts: [],
};

const reducer = combineReducers({
  user: (state, action) => {},
  post: (state, action) => {},
}); // ✅

const store = createStore(reducer, initialState); // ❌
// 아직 reducer를 구현하지 않아 에러가 난다 😅
```

<br />

### `Reducer`더 자세히보기. `Action`과 `AnyAction`

```ts
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;
```

`Reducer`타입의 `A extends Action = AnyAction`에서 `Action`과 `AnyAction` 살펴보기

#### `Action`

```ts
// index.d.ts

export interface Action<T = any> {
  type: T;
}
```

```ts
const action = { type: "example" }; // 이런 형태가 되겠구나~
```

#### `AnyAction`

```ts
// index.d.ts

export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}
```

```ts
const anyAction = { type: "example", data: "123" }; // 이런 형태가 되겠구나~2
```

<br />

### `combineReducers`와 `ReducerMapObject`분석해서 코드 완성하기

```ts
// index.d.ts

// combineReducers
// → S자리에 initialState가 들어간다. (S가 state라는 것을 알 수 있다.)
export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A> // ✅ 정체가 뭘까...
): Reducer<CombinedState<S>, A>;
```

> 제네릭 때문에 헷갈린다면, 없애고 파악해보는 것도 팁 :)

```ts
// index.d.ts

// ReducersMapObject
// → combineReducers로 전달받은 keyof S를 통해 initialState의 key들만 사용하는 것을 확인할 수 있다.
export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};

// Reducer
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;
```

Reducer 직접 대입시켜서 확인해보기.

```ts
// index.d.ts

// ReducersMapObject
export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: (state: S[K] | undefined, action: A) => S[K];
};
```

이를 combineReducers에도 대입해보자.

```ts
export function combineReducers<S, A extends Action = AnyAction>(reducers: {
  [K in keyof S]: (state: S[K] | undefined, action: A) => S[K];
}): Reducer<CombinedState<S>, A>;
```

```ts
// reducers 부분만 가져와 보자면...
reducers: {
  [K in keyof S]: (state: S[K] | undefined, action: A) => S[K];
}
```

이제 형태를 알았으니 코드를 수정해보자.

```ts
...

const reducer = combineReducers({
  user: (state, action) => {
    return state;
  },
  posts: (state, action) => {
    return state;
  },
});

const store = createStore(reducer, initialState); // ✅
```

조금 더 구현해보자면...

```ts
const LOGIN_ACTION = {
  type: "LOGIN",
};
...

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
```

<br />

### `Store`의 `dispatch` 살펴보기

위에서 사용한, 그리고 자주 사용하는 store의 dispatch를 살펴보자.

```ts
export interface Store<S = any, A extends Action = AnyAction> {
  ...
  dispatch: Dispatch<A>
```

#### `dispatch`, GTD.

```ts
export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}
```

> dispatch는 함수(`<T extends A>(action: T): T;`)며 AnyAction을 사용한다는 것을 확인할 수 있다. <br />
> ※ type 속성을 T 로 갖는 Action을 상속받고(extends) [extraProps: string]: any;를 타입으로 갖는.
> 그래서 AnyAction → { type: 'ACTION_NAME', data: {...} } 처럼 사용할 수 있는... :)
