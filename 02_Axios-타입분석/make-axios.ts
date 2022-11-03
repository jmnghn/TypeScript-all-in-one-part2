import axios, { AxiosError, AxiosResponse } from "axios";

interface Config<D = any> {
  method?: "post" | "get" | "put" | "patch" | "delete" | "head" | "options";
  url?: string;
  data?: D;
}

// interface의 같은 타입명 주의. (오버로딩)
interface AX {
  // await을 사용했으니까 반환타입 Promise
  // 제네릭자리에서는 변수 사용하기. R = AxiosResponse<T>
  get: <T = any, R = AxiosResponse<T>>(url: string) => Promise<R>;
  // Required type parameters may not follow optional type parameters.ts(2706)
  // → 필수 형식 매개 변수는 선택적 형식 매개 변수를 따르지 않을 수 있습니다. ts(2706)
  // → D = any (any 분명 안좋은 타입이라고 했는데, 직접 타이핑을 해보니 이유를 알 수 있었다. 안쓰고 싶은 사람들은 안쓸 수 있게)
  // → T도 안쓰고 싶은 사람들은 안쓸 수 있게 any로 변경해준다.
  post: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: D
  ) => Promise<R>;
  (config: Config): void;
  (url: string, config: Config): void;
  // isAxiosError: <T>(error: T) => error is T;
  isAxiosError: (error: unknown) => error is AxiosError;
}

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

const ax: AX = axios;

(async () => {
  try {
    const response = await ax.get<Todo, AxiosResponse<Todo>>(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    // response.data;
    console.log(response.data); //(property) AxiosResponse<Post, any>.data: Post
    console.log(response.data.userId); // number
    console.log(response.data.id); // number
    console.log(response.data.title); // string
    console.log(response.data.completed); // boolean

    const response2 = await ax.post<Created, AxiosResponse<Created>, Data>(
      "https://jsonplaceholder.typicode.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );

    // [객체를 넣어 함수로 사용하는 axios]
    const response3 = await ax({
      method: "post",
      url: "https://jsonplaceholder.typicode.com/posts",
      data: {
        title: "foo",
        body: "bar",
        userId: 1,
      },
    });

    // [주소와 객체를 함께 넣는 함수]
    const response4 = await axios(
      "https://jsonplaceholder.typicode.com/posts",
      {
        method: "post",
        data: {
          title: "foo",
          body: "bar",
          userId: 1,
        },
      }
    );
  } catch (error) {
    if (ax.isAxiosError(error)) {
      // { message: '서버 장애입니다. 다시 시도해주세요.' }
      console.error(
        (error as AxiosError<{ message: string }>).response?.data.message
      );
    }
  }
})();
