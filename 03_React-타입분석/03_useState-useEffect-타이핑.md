## useState, useEffect 타이핑

<br />

### `useState`, GTD.

```ts
// index.d.ts

function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
```

> 타입스크립트를 사용하면, `useState`에 함수를 사용하는 걸 몰랐던 사람들도 함수를 사용할 수 있다는 것을 알 수 있다. (`(() => S)`) ※ lazy init

#### `Dispatch`와 `SetStateAction`, GTD

```ts
Dispatch<SetStateAction<S>>

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
```

```ts
// useState, set-함수(Dispatch)에 value 또는 함수를 넣을 수 있다는 걸 확인할 수 있다.
type Dispatch<SetStateAction<S>> = (value: S | ((prevState: S) => S)) => void;
```

<br />

### `useEffect`

useState의 set함수(Dispatch)는 비동기다.<br />
가끔씩 이를 동기처럼 사용하기 위해 `async-await`을 사용하는 경우들도 있는데,<br />
이러면 안된다. 😵

```ts
// ❌
useEffect(async () => {
  await setA((prev) => {
    return prev + "2";
  });
});
```

`await`는 Promise를 반환하는 함수에서만 사용할 수 있다. 사용할 수야 있지만, 기대했던 동작으로는 동작하지 않을 것이다.

<br />

그리고 비슷한(!)예로 자바스크립트 리액트를 사용할 때,<br />
비동기 통신에 `async-await`을 사용하는 경우가 있다.

```ts
useEffect(async () => {
  await axios.post();
}, []);
```

동작도 하고 자바스크립트 리액트에서는 가능하지만,<br />
타입스크립트에서는 문제가 된다.<br />
왜냐하면 `useEffect`의 `EffectCallback`의 반환값이 `void | Destructor`로 고정되있기 때문이다.

#### `useEffect`, GTD.

```ts
// useEffect
function useEffect(effect: EffectCallback, deps?: DependencyList): void;

// EffectCallback
type EffectCallback = () => void | Destructor;

// Destructor
declare const UNDEFINED_VOID_ONLY: unique symbol;
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
```

`async`함수는 리턴값이 `Promise<T>`로 고정이기 때문에,<br />
`void`는 이를 사용하지 않거나 쓸 수 없다.

```ts
useEffect(async () => {
  return "3";
}, []);
// Argument of type '() => Promise<string>' is not assignable to parameter of type 'EffectCallback'.
// Type 'Promise<string>' is not assignable to type 'void | Destructor'.ts(2345)
// Promise<string>를 void | Destructor에 할당할 수 없다.
```

그래서 타입스크립트의 useEffect의 비동기 통신은 다음과 같이 강제된다.

```ts
useEffect(() => {
  const fn = async () => {
    await axios.post();
  };
  fn();
}, []);
```

<br />

그럼 `useEffect`에서 자주 사용하는 cleanup 함수는 어떨까?

```ts
useEffect(() => {
  console.log("useEffect");
  return () => {
    console.log("useEffect cleanup");
    return "3"; // ❌ 여기도 return을 사용하면 에러가 발생한다.
  };
}, []);
```
