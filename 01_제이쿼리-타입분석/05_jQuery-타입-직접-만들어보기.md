## jQuery 타입 직접 만들어보기

<br />

### 타입을 직접 만들어보자.

```ts
interface zQuery {
  text(): void;
  html(): void;
}

const $tag: zQuery = $(["p", "q"]);

// 1 - string
$tag.text("123");

// 2 - number
$tag.text(123);

// 3 - function
$tag.text(function (index) {
  console.log(this, index);
  return true;
});

// 4 - method chaining
$tag.text().html(document);
```

#### 1, 2 타입 지정

```ts
interface zQuery {
  text(param: number | string): void;
  html(param: string): void;
}
```

#### 빈 값도 허용

```ts
interface zQuery {
  text(param?: number | string): void;
  html(param: string): void;
}
```

#### 3 타입 지정 - 1

```ts
interface zQuery {
  text(param?: number | string | boolean | (this: any, index: number) => boolean | string | number): void; // ❌ Function type notation must be parenthesized when used in a union type.ts(1385)
  html(param: string): void;
}
```

#### 3 타입 지정 - 2(에러메시지 안내에 따라 함수를 괄호로 묶음)

```ts
interface zQuery {
  text(
    param?:
      | number
      | string
      | boolean
      | ((this: any, index: number) => boolean | string | number)
  ): this; // 그리고 메서드 체이닝을 위해 반환타입을 this로.
  html(param: string): void;
}
```

#### 4를 위한 타입 지정 (완성✨)

```ts
interface zQuery {
  text(
    param?:
      | number
      | string
      | boolean
      | ((this: this, index: number) => boolean | string | number)
  ): this;
  html(param: string | Document | DocumentFragment): void;
}
```

> 그리고 this의 타입을 this로.(여기에서는 zQuery를 가리킴)<br /><br />
> ※ jQuery에서 `this` 타입을 `TElement`로 지정한 이유가 여기에서 나온다.<br />
> this로 스스로를 다시 가리키는게 아닌, `document.querySelector('h1')`과 같은 경우에는 dom의 타입으로 지정하게하기 위해서...

또 필요할 때 추가적으로 수정해나가면 되는 것이기에 여기까지만 해줘도 아주 훌륭한 것.

<br />

### 마지막. `jquery로 감싼 jquery`의 타입

```ts
// [$에 마우스를 올려보면...]
//
// const $: JQueryStatic
// <HTMLElement>(element_elementArray: HTMLElement | ArrayLike<HTMLElement>) => JQuery<HTMLElement> (+8 overloads)
//
// 여러 타입 가운데(+8 overloads) 걸리는 타입을 알려주고 있다.
const tag = $("ul li")
  .addClass("hello")
  .addClass(function (index) {
    return "item-" + index;
  });

$(tag).html(document);
```

#### `$`, GTD.

```ts
// Element와 ArrayLike(유사배열)
<T extends Element>(element_elementArray: T | ArrayLike<T>): JQuery<T>;
```

```ts
// ArrayLike
interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}
```

<br />

Tip - 분석할 때, 제네릭 자리에 타입 대입해봐가면서 읽으면 더 편함. :)
