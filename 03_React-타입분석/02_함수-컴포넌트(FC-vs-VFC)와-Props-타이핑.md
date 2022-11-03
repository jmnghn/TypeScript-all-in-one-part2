## 함수 컴포넌트(FC vs. VFC), Props 타이핑

<br />

### `JSX.Element`와 `ReactElement`

```ts
const WordRelay: () => JSX.Element;
```

#### `JSX.Element`, GTD.

```ts
declare global {
    namespace JSX {
        interface Element extends React.ReactElement<any, any> { } // ✅ ReactElement구나 👀
        ...
```

> JSX.Element가 ReactElement와 같다는 걸 볼수있다.

#### `FuctionComponent`, GTD.

```ts
const WordRelay: FunctionComponent = () => {
```

```ts
interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactElement<any, any> | null; // ✅
        propTypes?: WeakValidationMap<P> | undefined;
```

> 타입을 `FunctionComponent`로 지정했을 때 ReactElement인데, JSX.Element와 동일하다는 것을 알 수 있다.

<br />

### 컴포넌트 타이핑

타이핑할 때 두 가지 방법을 많이 하는데,<br />
함수는 매개변수와 리턴값을 타이핑 해야하다보니까...

#### 1. props에 직접 타이핑

```ts
type Props = {
  name: string;
  title: string;
};

// [타입추론] const WordRelay: (props: Props) => JSX.Element
const WordRelay = (props: Props) => {

// 아래처럼 할수도 있지만, 어차피 타입추론이 되므로...
const WordRelay = (props: Props): ReactElement => {
const WordRelay = (props: Props): JSX.Element => { // namespace를 쓰므로 import 안 해도 된다.
```

#### 2-1. 만들어진 타입을 사용하는 방법 (`FunctionComponent`)

```ts
type Props = {
  name: string;
  title: string;
};

const WordRelay: FunctionComponent<Props> = (props) => {
```

`FunctionComponent`타입을 다시 살펴보면... props를 `P`로 받아 사용하고 있으므로...!

```ts
interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactElement<any, any> | null; // ✅
        propTypes?: WeakValidationMap<P> | undefined;
```

#### 2-2. `FC`

```ts
type Props = {
  name: string;
  title: string;
};

const WordRelay: FC<Props> = (props) => {
```

- `FC`, GTD

  ```ts
  type FC<P = {}> = FunctionComponent<P>;
  ```

<br />

### `VFC`와 `FC`

리액트 17버전 까지는 `FunctionComponent`에서 props에 `PropsWithChildren<P>`를 지원했었다.

#### `PropsWithChildren<P>`, GTD.

```ts
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
```

하지만 18버전에서는 `FunctionComponent` props의 타입이 `PropsWithChildren<P>`에서 `P`로 바뀌었다. 그래서 리액트 17에서 18로 올릴 때는 대부분 children이 없다는 에러를 봤을 수도 있다. 왜냐하면, `FunctionComponent`에서 children을 제공해주지 않았으니까.<br />
17버전에서는 `VoidFunctionComponent`가 children을 제공해주지 않고, `FunctionComponent`에서는 children 타이핑을 제공을 해줬었는데 18버전에서는 둘 다 (children 타이핑을) 안해주는걸로 바뀌었고, 둘 다 안해주다 보니까 차이가 사라져서 `VoidFunctionComponent`(VFC)는 없애버렸다. (deprecated)<br />

그래서 만약 children을 받고 싶다면,

```ts
type Props = {
  name: string;
  title: string;
  children?: ReactNode | undefined; // ✅
};

const WordRelay: FC<Props> = (props) => {
```

와 같이 사용하면 된다.

<br />

Props에 children을 추가해 children의 사용이 가능해졌다.

```ts
const Parent = () => {
  return (
    <WordRelay name='이름' title='타이틀'> {/* 자동완성으로 props을 완성시킬수도 있다. */}
      <div><div>
    </WordRelay>
  );
};
```

`children?: ReactNode | undefined;`이 없을 경우 에러

> Type '{ children: Element; name: string; title: string; }' is not assignable to type 'IntrinsicAttributes & Props'.<br />
> Property 'children' does not exist on type 'IntrinsicAttributes & Props'.ts(2322)

그리고 `children?`이기 때문에 필요없을 때는 사용하지 않아도 되므로

```ts
const Parent = () => {
  return <WordRelay name="이름" title="타이틀" />;
};
```
