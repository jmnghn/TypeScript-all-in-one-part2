## 제네릭을 활용한 Response 타이핑

<br />

response도 잘 받아오는 것 같고 잘 동작하는 것 같다. 이러면 된걸까?<br />
받아온 데이터들의 타입을 살펴보자.

```ts
import axios from "axios";

(async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    // response.data;
    console.log(response.data);
    console.log(response.data.userId); // any
    console.log(response.data.id); // any
    console.log(response.data.title); // any
    console.log(response.data.completed); // any
  } catch (error) {
    console.log(error);
  }
})();
```

> 데이터 타입이 모두 any이다. 이러면 타입스크립트를 사용하는 의미가 없다.

<br />

### get. 타이핑.

그러면 어떡해야 할까?<br />
get의 첫번째 제네릭(`T = any`)에 타이핑을 해주어야 한다.

```ts
get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

샘플코드를 수정해보자.

```ts
type Todo = {
  userId: number;
  id: number;
  title: string;
  body: string;
  completed: boolean;
};
...
const response = await axios.get<Todo>(
  "https://jsonplaceholder.typicode.com/todos/1"
);
```

이제는 각 속성의 타입들을 확인할 수 있다.

```ts
(async () => {
  try {
    const response = await axios.get<Todo>(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    // response.data;
    console.log(response.data); //(property) AxiosResponse<Post, any>.data: Post
    console.log(response.data.userId); // number
    console.log(response.data.id); // number
    console.log(response.data.title); // string
    console.log(response.data.completed); // boolean
  } catch (error) {
    console.log(error);
  }
})();
```

<br />

※ `.post()`

> 📹 3:00 부터 설명 시작

```ts
import axios, { AxiosResponse } from "axios";

type Todo = {
  userId: number;
  id: number;
  title: string;
  body: string;
  completed: boolean;
};
interface Created {}
type Data = {
  title: string;
  body: string;
  userId: number;
};

(async () => {
  try {
    const response = await axios.get<Todo, AxiosResponse<Todo>>(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    // response.data;
    console.log(response.data); //(property) AxiosResponse<Post, any>.data: Post
    console.log(response.data.userId); // number
    console.log(response.data.id); // number
    console.log(response.data.title); // string
    console.log(response.data.completed); // boolean

    // response2의 반환타입이 any인걸 없애보려고 제네릭 넣어봄
    // (하는 역할은 크게 보이지 않음.)
    // 제네릭 세번째 매개변수로 넣은 `Data`가 쓰이는 곳도 딱히 보이지는 않는다.
    const response2 = await axios.post<Created, AxiosResponse<Created>, Data>(
      "https://jsonplaceholder.typicode.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );

    // [axios({...})의 타입]
    // export interface AxiosInstance extends Axios {
    //   <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>; // ✅
    //   <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    //   defaults: Omit<AxiosDefaults, 'headers'> & {
    //     headers: HeadersDefaults & {
    //       [key: string]: AxiosHeaderValue
    //     }
    //   };
    const response3 = await axios({
      method: "post",
      url: "https://jsonplaceholder.typicode.com/posts",
      data: {
        title: "foo",
        body: "bar",
        userId: 1,
      },
    });
  } catch (error) {
    console.log(error);
  }
})();
```

<br />

axios는 그 활용방법이 다양해 그에 맞는 타입을 지정해서 사용하는 것이 좋다.<br />
`.get()`에 타이핑하는 것 말고는 실용적으로는 어떤 이점이 있을지는... 잘 모르겠다. 감이 오질 않는다.
