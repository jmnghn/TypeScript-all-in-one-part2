## 다양한 방식으로 사용 가능한 axios

axios. javascript에서는 널리 쓰이는 http 라이브러리.<br />
요즘은 ky나 got을 사용하는 경향을 보인다.

- 브라우저 [ky](https://github.com/sindresorhus/ky)
- 노드 [got](https://github.com/sindresorhus/got)

```
브라우저 fetch
노드 fetch
axios = fetch + 여러 기능 (물론, axios는 fetch는 아니고, XMLHttpRequest를 사용한다.)
```

> 리액트네이티브까지 멀티플랫폼을 지원해 편하다. :)

<br />

이전에 살펴봤을 때, axios에서는 `TS`가 있었다. `@types/axios`같은 걸 설치하지 않아도 된다는 이야기다.<br />

`package.json`을 살펴보니 `"types": "index.d.ts",`로 되어있다.<br />
타입스크립트는 밑에서부터 살펴보는 것이 좋으므로(모듈 시스템 확인) 밑에서 부터 살펴보면,<br />

```ts
// index.d.ts

// ...
declare const axios: AxiosStatic;

export default axios; // ESM인걸 확인할 수 있다.
```

```ts
import axios from "axios";
```

> ※ 짧막 복습.<br />
> commonjs 모듈이었다면, `import axios = require('axios');` 나 `import * as axios from 'axios'`로 가져왔어야 했을 것이다. (물론 esModuleInterop이 true면, 결국 동일해지지만 ☺️)

<br />

### axios의 타입을 분석해보자. (`AxiosStatic`)

#### 샘플코드

```ts
import axios from "axios";

async () => {
  try {
    await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  } catch (error) {
    console.log(error);
  }
};
```

#### axios, DTF.

```ts
declare const axios: AxiosStatic;

export default axios; // 이 라인을 통해 import axios from 'axios';로 쓸수있다는 것은 알았다.
```

#### `AxiosStatic`, DTF.

```ts
// 객체인 interface AxiosStatic
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
```

#### `AxiosInstance`, DTF.

```ts
// 함수인 interface AxiosInstance
// 매개변수가 config인 함수와
// url, config인 함수
// default속성에 대한 타입 등이 보인다.
export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  defaults: Omit<AxiosDefaults, "headers"> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
  };
}
```

#### 객체인 interface는 어떻게 함수인 interface를 extends할 수 있었을까?

```ts
// 자바스크립트에서는 다음과 같이 함수에 멤버변수를 넣어줄 수 있다.
const a = () => {};
a.b = "c";
a.e = "f";
a.g = "h";

// 이런 원리와 같이 AxiosInstance를 AxiosStatic에 넣어줄 수 있다.
const b = () => {};
b.create = () => {};
b.isAxiosError = () => {};

b();
b.create();
b.isAxiosError();
```

또 `Axios`를 살펴보면 이번에는 class다.

#### `Axios`, DTF.

```ts
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
```

axios는 결국, 클래스면서 함수면서 객체인 것. 😵<br />
그래서 실제로 사용방법도 3개다.

```ts
new axios();
axios();
axios.get();
```

> 3가지 사용 모두 사용이 가능한 것을 (객체 extends 함수 extends 클래스 로... ^^;)<br />
> 좋은 라이브러리의 조건 중에 다양한 쓰임을 제공하라는 것에 충실한 것 같다.

우리가 원하는 `get`, `delete`, `put`, `patch`와 같은 애들은 class에 들어있다.
