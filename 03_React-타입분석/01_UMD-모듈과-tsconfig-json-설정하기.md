## UMD 모듈과 tsconfig.json설정하기

- react는 `DT`니까 `@types/react` 설치해주기. (import부터 에러가 난다)

#### 모듈 체크

```ts
// index.d.ts

export = React; // commonjs
export as namespace React;
```

> `export as namespace React;`까지 같이 쓰였으니까. 정확하게는 UMD.

#### `Cannot use JSX unless the '--jsx' flag is provided.ts(17004)`<br />

jsx코드에서 다음과 같은 에러가 발생하는데, jsx는 리액트의 문법으로 자바스크립트, 타입스크립트는 이를 모른다. `tsconfig.json`에서 `"jsx"`를 `"react"`로 설정해줘야한다.

```json
"jsx": "react" /* Specify what JSX code is generated. */,
```

> react-native도 보이고 그렇다.<br />
> ※ TS Playground에서도 리액트 코드를 테스트해보고 싶다면, 상단에 TS Confg 메뉴에서 JSX를 react로 설정해줘야 한다.

#### 함수 컴포넌트 타입 지정

```ts
const WordRelay: FunctionComponent = () => {
```

#### `FunctionComponent`, GTD.

```ts
interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null; // props는 P 제네릭이고, ReactElement를 반환한다.(JSX 부분, 함수 컴포넌트는 JSX를 반환하니까.)
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

> `ReactElement`타입은 익숙한 type, props, key로 되어있는데, 여기에서는 굳이 알 필요는 없고 devtools에서 확인하는 것이 좋다는 의견. :)

#### JSX의 `form`, GTD.

JSX에서 사용할 수 있는 html tag들을 정의해놓은 걸 볼수있다.

```ts
declare global {
    namespace JSX {
      ...
      interface IntrinsicElements {
        ...
        footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>; // ✅
        h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        ...
```

> DOM API에 있는 것들을 모두 적어놨기 때문에 JSX를 타입스크립트에서도 사용할 수 있다.
