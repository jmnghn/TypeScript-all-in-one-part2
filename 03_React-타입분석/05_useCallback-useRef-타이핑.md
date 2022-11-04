## `useCallback`, `useRef` 타이핑

<br />

### `useCallback`

#### 18버전과의 차이, GTD.

```ts
function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T;
// 18부터 바뀜.
// 타입을 지정하지 않으면 안되게끔...
function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
```

```ts
import { MouseEvent, FormEvent, ChangeEvent } from "react"; // lib.dom.d.ts에서 가져오지 않게 잘 import해준다.

const onClick = useCallback((e: MouseEvent<HtmlButtonElement>) => {
  // ...
}, []);

const onSubmitForm = useCallback((e: FormEvent<HTMLFormElement>) => {
  // ...
}, []);

const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.currentTarget.value);
}, []);
```

<br />

### `useRef`

#### GTD.

```ts
// 3가지 useRef 😅
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```

#### `:RefObject<T>`

```ts
// [타입추론] const inputEl: React.RefObject<HTMLInputElement>
const inputEl = useRef<HTMLInputElement>(null); // null도 같이 있어야 RefObject<T>
// null을 안넣으면,
// function useRef<T = undefined>(): MutableRefObject<T | undefined>; 타입.
```

> useRef를 JSX에 연결할 목적으로 쓰려면, 제네릭으로 타입을 넘겨주기.

#### `:MutableRefObject<T>`

html와 연결할 목적이 아닌 자체적으로 사용하는 목적으로 사용할 경우 사용한다.

```ts
// [타입추론] const mutableRef: React.MutableRefObject<number>
const mutableRef = useRef(0);

useEffect(() => {
  mutableRef.current += 1;
}, []);
```

<br />

타입스크립트에서는 `RefObject`냐 `MutableRefObject`의 차이가 매우 중요하므로 적절하게 타이핑 해줘야 한다.
