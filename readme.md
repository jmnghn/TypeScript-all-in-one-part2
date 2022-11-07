## TypeScript-all-in-one-part2

> ※ Fork Repository: [https://github.com/jmnghn/ts-all-in-one](https://github.com/jmnghn/ts-all-in-one) <br />
> ※ Original Repository: [https://github.com/ZeroCho/ts-all-in-one](https://github.com/ZeroCho/ts-all-in-one) <br /><br />
> ※ Part1 Repository: [TypeScript-all-in-one-part1](https://github.com/jmnghn/TypeScript-all-in-one-part1)

<br />

- 라이브러리의 타입을 분석하다보니 Go to Definition으로 코드를 살펴볼 일이 많아, 이를 그대로 풀어 사용하거나 GTD라는 용어를 사용했다.

<br />

#### ※ @types의 맨 앞자리 버전과 라이브러리 버전의 맨 앞자리는 대부분 일치해야 한다.

```json
"dependencies": {
  "axios": "^1.1.3",
  "jquery": "^3.6.1",
  "react": "^18.2.0",
  "redux": "^4.2.0",
  "typescript": "^4.8.4"
},
"devDependencies": {
  "@types/jquery": "^3.5.14",
  "@types/react": "^18.0.24"
}
```

<br />

## 모듈 시스템

```ts
export = A; // commonjs
import A = require("a"); // commonjs

export = A;
export as namespace A; // UMD

export default A; // ESM
import A from "a"; // ESM
```

```ts
declare global {}
export {}; // export나 import 필요
```

<br />

## jQuery의 타이핑

```ts
$("p").removeClass("myClass noClass").addClass("yourClass");
$(["p", "t"]).text("hello");
const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});
$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
```

```ts
export = jQuery;

declare const jQuery: JQueryStatic;
declare const $: JQueryStatic;

interface JQueryStatic {
  <TElement extends HTMLElement = HTMLElement>(
    html: JQuery.htmlString,
    ownerDocument_attributes?: Document | JQuery.PlainObject
  ): JQuery<TElement>;
  <TElement extends Element = HTMLElement>(
    selector: JQuery.Selector,
    context?: Element | Document | JQuery | JQuery.Selector
  ): JQuery<TElement>;
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
  addClass(
    className_function:
      | JQuery.TypeOrArray<string>
      | ((this: TElement, index: number, currentClassName: string) => string)
  ): this;
  removeClass(
    className_function?:
      | JQuery.TypeOrArray<string>
      | ((this: TElement, index: number, className: string) => string)
  ): this;
  on<TType extends string>(
    events: TType,
    handler:
      | JQuery.TypeEventHandler<TElement, undefined, TElement, TElement, TType>
      | false
  ): this;
}
```

<br />

## axios의 타이핑

### index.d.ts

```ts
declare const axios: AxiosStatic;
export default axios;

export interface AxiosStatic extends AxiosInstance {
  create(config?: CreateAxiosDefaults): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  Axios: typeof Axios;
  AxiosError: typeof AxiosError;
  readonly VERSION: string;
  isCancel(value: any): value is Cancel;
  all<T>(values: Array<T | Promise<T>>): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
  isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>;
  toFormData(
    sourceObj: object,
    targetFormData?: GenericFormData,
    options?: FormSerializerOptions
  ): GenericFormData;
  formToJSON(form: GenericFormData | GenericHTMLFormElement): object;
}

export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): AxiosPromise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): AxiosPromise<R>;

  defaults: Omit<AxiosDefaults, "headers"> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
  };
}

export class Axios {
  constructor(config?: AxiosRequestConfig);
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;
  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  head<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  postForm<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  putForm<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patchForm<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}

export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}
```

<br />

## React의 타이핑

```ts
export = React;
export as namespace React;

declare namespace React {
```

```ts
declare global {
    namespace JSX {
```

```ts
import React = require("react");
import * as React from "react";
React.useEffect;
```

### return에 무엇이 들어갈 수 있을까? JSX, string, null...?

```ts
function App(): JSX.Element {
  ...
}

const App: FC<{}> = () => <div />;

interface Element extends React.ReactElement<any, any> { }

interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
}

type JSXElementConstructor<P> =
        | ((props: P) => ReactElement<any, any> | null)
        | (new (props: P) => Component<any, any>);

class Component<P, S> {
  render(): ReactNode;
}

interface FunctionComponent<P = {}> {
//    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null; // React17
    (props: P, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
}

type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
type ReactFragment = {} | Iterable<ReactNode>;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
}

type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
}

type VFC<P = {}> = VoidFunctionComponent<P>;

interface VoidFunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
}
```

### 훅 타이핑

```ts
function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
function useState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
];

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;

interface MutableRefObject<T> {
  current: T;
}
interface RefObject<T> {
  readonly current: T | null;
}

function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
function useEffect(effect: EffectCallback, deps?: DependencyList): void;

type EffectCallback = () => void | Destructor;
type DependencyList = ReadonlyArray<unknown>;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
```

### `tsconfig.json`이 `"jsx": "react"`로

```jsx
import * as React from "react";
import { useState, useCallback, useRef } from "react";

const WordRelay = () => {
  const [word, setWord] = useState("제로초");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef(null);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      const input = inputEl.current;
      if (word[word.length - 1] === value[0]) {
        setResult("딩동댕");
        setWord(value);
        setValue("");
        if (input) {
          input.focus();
        }
      } else {
        setResult("땡");
        setValue("");
        if (input) {
          input.focus();
        }
      }
    },
    [word, value]
  );

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input ref={inputEl} value={value} onChange={onChange} />
        <button>입력!</button>
      </form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
```

<br />

## Redux 타이핑

```ts
export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T, ...extraArgs: any[]): T;
}

export interface Action<T = any> {
  type: T;
}

export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export interface ActionCreator<A, P extends any[] = any[]> {
  (...args: P): A;
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D;
  getState(): S;
}

export interface Middleware<
  _DispatchExt = {}, // TODO: remove unused component (breaking change)
  S = any,
  D extends Dispatch = Dispatch
> {
  (api: MiddlewareAPI<D, S>): (
    next: D
  ) => (action: D extends Dispatch<infer A> ? A : never) => any;
}
```

<br />

## react-redux의 타이핑

```ts
export const useSelector = /*#__PURE__*/ createSelectorHook();

export function createSelectorHook(
  context = ReactReduxContext
): <TState = unknown, Selected = unknown>(
  selector: (state: TState) => Selected,
  equalityFn?: EqualityFn<Selected>
) => Selected {}

export const useDispatch = /*#__PURE__*/ createDispatchHook();

export function createDispatchHook<
  S = unknown,
  A extends Action = AnyAction
  // @ts-ignore
>(context?: Context<ReactReduxContextValue<S, A>> = ReactReduxContext) {
  const useStore =
    // @ts-ignore
    context === ReactReduxContext ? useDefaultStore : createStoreHook(context);

  return function useDispatch<
    AppDispatch extends Dispatch<A> = Dispatch<A>
  >(): AppDispatch {
    const store = useStore();
    // @ts-ignore
    return store.dispatch;
  };
}
```

<br />

## Node의 타이핑

`<reference path="..."`는 해당 파일의 타입들을 끌고 오는 것이다.<br />
요즘 할 필요 없다. `d.ts` 파일에 `declare module 'fs:promises'`로 `import 'fs:promises'` 할 때,<br />
어떤 타입이 될 지 작성할 수 있다.

```ts
function createServer(requestListener?: RequestListener): Server;
type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
```

```ts
function readFile(
  path: PathLike | number,
  options: { encoding?: null; flag?: string } | undefined | null,
  callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
): void;

function readFile(
  path: PathLike | FileHandle,
  options?: { encoding?: null; flag?: string | number } | null
): Promise<Buffer>;

type PathLike = string | Buffer | URL;

function join(...paths: string[]): string;
```

<br />

## Express 타이핑

```ts
export = e;
declare function e(): core.Express;
declare namespace e {
  var json: typeof bodyParser.json;
  var urlencoded: typeof bodyParser.urlencoded;
}

interface RequestHandler<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> extends core.RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {}

import * as core from "express-serve-static-core";
```

### 타입 확장을 위한 장치

```ts
// This extracts the core definitions from express to prevent a circular dependency between express and serve-static
declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    interface Request {} // ✅
    interface Response {} // ✅
    interface Application {} // ✅
  }
}

export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends http.IncomingMessage,
    Express.Request {}

import { ParsedQs } from "qs";

export {};

export type Query = ParsedQs;

export interface ParamsDictionary {
  [key: string]: string;
}
export interface RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2)
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ): void;
}

export interface NextFunction {
  (err?: any): void;
  /**
   * "Break-out" of a router by calling {next('router')};
   * @see {https://expressjs.com/en/guide/using-middleware.html#middleware.router}
   */
  (deferToNext: "router"): void;
  /**
   * "Break-out" of a route by calling {next('route')};
   * @see {https://expressjs.com/en/guide/using-middleware.html#middleware.application}
   */
  (deferToNext: "route"): void;
}

export interface Express extends Application {
  request: Request;
  response: Response;
}

export interface Application<
  Locals extends Record<string, any> = Record<string, any>
> extends EventEmitter,
    IRouter,
    Express.Application {
  use: ApplicationRequestHandler<this>;
}

export type ApplicationRequestHandler<T> = IRouterHandler<T> &
  IRouterMatcher<T> &
  ((...handlers: RequestHandlerParams[]) => T);

export type RequestHandlerParams<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> =
  | RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
  | ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
  | Array<RequestHandler<P> | ErrorRequestHandler<P>>;
```

### passport 타이핑

```ts
declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface AuthInfo {}
    // tslint:disable-next-line:no-empty-interface
    interface User {}

    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;

      // These declarations are merged into express's Request type
      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;

      logout(
        options: { keepSessionInfo?: boolean },
        done: (err: any) => void
      ): void;
      logout(done: (err: any) => void): void;
      logOut(
        options: { keepSessionInfo?: boolean },
        done: (err: any) => void
      ): void;
      logOut(done: (err: any) => void): void;

      isAuthenticated(): this is AuthenticatedRequest;
      isUnauthenticated(): this is UnauthenticatedRequest;
    }

    interface AuthenticatedRequest extends Request {
      user: User;
    }

    interface UnauthenticatedRequest extends Request {
      user?: undefined;
    }
  }
}
```

### passport-local 타이핑

```ts
import { Strategy as PassportStrategy } from "passport-strategy";
import express = require("express");

interface IStrategyOptions {
  usernameField?: string | undefined;
  passwordField?: string | undefined;
  session?: boolean | undefined;
  passReqToCallback?: false | undefined;
}

interface IStrategyOptionsWithRequest {
  usernameField?: string | undefined;
  passwordField?: string | undefined;
  session?: boolean | undefined;
  passReqToCallback: true;
}

interface IVerifyOptions {
  message: string;
}

interface VerifyFunctionWithRequest {
  (
    req: express.Request,
    username: string,
    password: string,
    done: (error: any, user?: any, options?: IVerifyOptions) => void
  ): void;
}

interface VerifyFunction {
  (
    username: string,
    password: string,
    done: (error: any, user?: any, options?: IVerifyOptions) => void
  ): void;
}

declare class Strategy extends PassportStrategy {
  constructor(
    options: IStrategyOptionsWithRequest,
    verify: VerifyFunctionWithRequest
  );
  constructor(options: IStrategyOptions, verify: VerifyFunction);
  constructor(verify: VerifyFunction);

  name: string;
}
```

<br />

## `d.ts` 사용하기

- 그냥 일반 `ts`파일에 타입을 선언해도 된다.
- 하지만, import 한 것과 인터페이스의 이름이 겹치면 에러가 발생한다.
- 이럴 경우 `d.ts`로 분리한다. (`d.ts`는 타입만 있고 구현은 없는 파일)
- 우선, `declare global`, `declare module`, `declare namespace` 없이 타이핑한다.
- 확장하고 싶은 인터페이스가 저렇게 되어있다면 `declare`를 추가한다.
- 한 번 `declare` 쓴 블럭 안에서는 추가적으로 `declare`를 할 필요가 없다.

<br />

## 직접 타이핑하기

`types/모듈명.d.ts` (※ 꼭 types 폴더 안에 있을 필요는 없다.)

```ts
declare module "모듈명" {
  // import나 export 하나 필수
}
```
