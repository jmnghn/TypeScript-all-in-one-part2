## ts-node 사용하기

<br />

### `get` 더 살펴보기. GTD.

```ts
get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

매개변수타입과 리턴타입을 찾기가 너무 어렵다면, '제네릭'을 지우고 보는 편이 파악이 빠르다.

```ts
// 보기가 편해졌다. :)
// url이 첫번째 매개변수고, config가 옵셔널인걸 확인할 수 있다.
// Promise 타입을 반환하는 함수라는 것을 알 수 있다.
get(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

```ts
// 매개변수와 리턴타입이 확인됐으면 다시 되살려서(!)
// R은 AxiosResponse라는 것을 확인할 수 있다.
// AxiosResponse<T>의 T는 아직 여기만 봐서는 파악이 어렵다.
get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

#### `AxiosResponse<T>`, GTD.

```ts
export interface AxiosResponse<T = any, D = any> {
  data: T; // data의 타입을 T로 넣어주고 있다는 것을 확인할 수 있다.
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}
```

샘플 코드를 살펴보면,

```ts
import axios from "axios";

(async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    // [타입추론] (property) AxiosResponse<any, any>.data: any
    response.data; // data가 any인걸 확인할 수 있는데, get<T = any, ...>의 T에 아무것도 넣어주지 않아서 그렇다. (AxiosResponse<T>에서도 data가 any가 된다)
    console.log(response);
  } catch (error) {
    console.log(error);
  }
})();
```

이를 `tsc`로 js로 변환하고, node로 실행해보자.

```js
"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const response = yield axios_1.default.get(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      // response.data;
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }))();
```

> 복잡해보이는 import 구문과 axios로 작성했던 코드가 보인다.

```
$ node axios.js
{
  status: 200,
  statusText: 'OK',
  headers: AxiosHeaders {
  ...
```

> 통신이 되고있는걸 확인할 수 있고, 위에서 살펴본 `AxiosResponse` 객체와 같은 모양으로 온다는 걸 확인할 수 있다.

<br />

### `ts-node`

이렇게 코드를 확인하기 위해 매번 `tsc`명령어로 일일히 변환하는건 번거롭다.<br />
`ts-node`를 사용하면 이와같은 불편을 덜 수 있다.

```
$ npm i -g ts-node
```

이제 타입스크립트 파일을 조금 수정하고, `ts-node`로 실행해보자.

```ts
...
try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    console.log(response.data); // response → response.data
  } catch (error) {
    console.log(error);
  }
...
```

```
$ ts-node axios.ts
{ userId: 1, id: 1, title: 'delectus aut autem', completed: false }
```

> 😲<br />
> 윈도우에서는 추가적인 설정이 더 필요하다. (`npx ts-node axios`)
