## action, reducer 타이핑하기

<br />

### reducer 에러 해결하기.

타입스크립트로 reducer의 형태를 파악해서 reducer를 작성했다. 하지만 다음과 같은 에러가 발생한다.

```ts
...
// [타입추론] (parameter) state: unknown
posts: (state, action) => {
  switch (action.type) {
    case "ADD_POST":
      return [...state, action.data]; // ❌ Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator.ts(2488)
    default:
      return state;
  }
},
...
```

state의 타입이 unknown이기 때문에 발생한다.<br />
지금까지의 내용을 바탕으로 `as`를 사용하거나 `타입가드`를 적용해보면 될 것 같은데,<br />
우선, `타입가드`를 적용해보자.

#### 타입 가드 적용해보기.

```ts
...
posts: (state, action) => {
  if (Array.isArray(state)) {
    switch (action.type) {
      case "ADD_POST":
        // [타입추론] (parameter) state: any[]
        return [...state, action.data]; // ✅
      default:
        return state;
    }
  }
},
...
```

<br />

나머지는 아래 파일들에서 진행 :)<br />

- `redux-lecture.ts`
- `action/`
  - `user.ts`
  - `post.ts`
- `reducers/`
  - `index.ts`
  - `user.ts`
  - `post.ts`
