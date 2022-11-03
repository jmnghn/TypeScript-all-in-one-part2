import axios, { AxiosError, AxiosResponse } from "axios";

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
    const response = await axios.get<Todo>(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    // response.data;
    console.log(response.data); //(property) AxiosResponse<Post, any>.data: Post
    console.log(response.data.userId); // number
    console.log(response.data.id); // number
    console.log(response.data.title); // string
    console.log(response.data.completed); // boolean

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
    // 이전에도 설명했지만, 그냥 error.response.data를 쓰면 error로 어떤 타입이 들어올지 모르기 때문에 에러가 발생한다.
    // Object is of type 'unknown'.ts(2571)
    // console.log(error.response.data);

    // 그래서 다음과 같이 사용해야 하며
    console.log((error as AxiosError).response?.data);
    // AxiosError 클래스의 response?: AxiosResponse<T, D>; (※ response? - response가 없을수도 있다.)

    // 변수에 담아서 사용할 수 있다고도 설명했다.
    const errorResponse = (error as AxiosError).response;
    console.error(errorResponse?.data);
    // 하지만 이 역시 좋은 방식은 아니다. error가 AxiosError가 아니면 catch문에서 고장나버리기 때문이다. (노답 😳)

    // [타입가드]
    // AxiosError가 class기 때문에 instanceof를 사용할 수 있다.
    if (error instanceof AxiosError) {
      error.response;
    }

    // [또 다른 방식]
    // isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>;
    // 형식 조건자 is가 보이는 걸 보니 if에 쓸 수 있을 것 같다.
    if (axios.isAxiosError(error)) {
      // { message: '서버 장애입니다. 다시 시도해주세요.' }

      // [타입추론] message: any
      console.error(error.response?.data.message);

      console.error(
        (error.response as AxiosResponse<{ message: string }>)?.data.message
      );
    }

    // 강의와 다른 부분은 isAxiosError에 제네릭이 생겼다. 😳
    // [강의] isAxiosError(payload: any): payload as AxiosError;
    // [index.d.ts] isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>;
    if (axios.isAxiosError<{ message: string }>(error)) {
      // { message: '서버 장애입니다. 다시 시도해주세요.' }
      console.error(error.response?.data.message); // message가 'string | undefined' 로 되는 것 같다.
    }
  }
})();
