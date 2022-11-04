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

### 모듈 시스템

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

### jQuery의 타이핑

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

### axios의 타이핑

#### index.d.ts

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
