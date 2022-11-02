## 메서드와 this 타이핑

<br />

### removeClass의 타입을 찾아보자.

> JQuery의 Go to Definition에 이어서...

```ts
// JQuery.d.ts

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
  //...
}
```

> `interface JQuery` 코드를 살펴보면, 익숙한 jquery 메서드들이 많이 보인다. (`add`, `addClass`, ...)

#### removeClass

```ts
removeClass(className_function?: JQuery.TypeOrArray<string> | ((this: TElement, index: number, className: string) => string)): this;
```

```ts
// removeClass(className_function?: JQuery.TypeOrArray<string> | ((this: TElement, index: number, className: string) => string)): this;
$p.removeClass("myClass noClass").addClass("yourClass");
```

> Tip. 타입을 분석할 때, 타입이 선언된 파일로 왔다갔다하며 보기 힘들 수 있으므로 복사해서 분석하는 것을 추천한다.

`removeClass`의 문자열 인자가 `className_function?` 이라는 것을 볼 수 있다.<br />
이 타입이 `: JQuery.TypeOrArray<string>` 인 것을 확인할 수 있는데, `JQuery`가 namespace 였던 것은 확인했고 `TypeOrArray`살펴보자.

```ts
declare namespace JQuery {
    type TypeOrArray<T> = T | T[];
    ...
```

`TypeOrArray<T>`는 `T | T[];`라는 것을 알 수 있다. 위 코드에서는 타입 인자가 `<string>`이였으므로, `JQuery.TypeOrArray<string>`의 타입은 `string | string[]`라는 것을 알 수 있다. 아까 복사해 온 타입에서 알아낸 부분의 타입을 변경해보자.

```ts
// removeClass(className_function?: string | string[] | ((this: TElement, index: number, className: string) => string)): this;
$p.removeClass("myClass noClass").addClass("yourClass"); // string | string[] 이기 때문에 "myClass noClass"가 된다는 걸 확인할 수 있다.
```

그렇다면 `removeClass`를 다음과 같이도 사용할 수 있을 것이다. (문자열 배열)

```ts
$p.removeClass(["myClass", "noClass"]).addClass("yourClass");
```

> 이처럼 타입이라는 것 자체가 함수를 쓰는데 엄청난 힌트가 된다.

<br />

그럼 이제 removeClass의 인자에 `string | string[] | ((this: TElement, index: number, className: string) => string)`라는 것을 알았는데, `((this: TElement, index: number, className: string) => string`를 살펴보니 함수가 된다는 것을 알 수 있다.

```ts
$p.removeClass((index, className) => {
  return "myClass";
}).addClass("yourClass");
```

> 여기서, 반드시 기억해야 할 한가지.<br />
> 함수꼴 타입에서 첫번째 매개변수가 this면, 이건 아주 특수한 경우로 쉽게 생각하면 없다고 보면 된다.

#### this

```ts
document.querySelector("h1").addEventListener("click", function () {
  // [타입추론] this: HTMLHeadingElement
  console.log(this);
});
```

이 this를 타입스크립트는 어떻게 알아냈을까?

```ts
// lib.dom.d.ts의 addEventListener 타입

addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLHeadingElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
// listener 매개변수의 첫번째 위치에 this가 있는 걸 확인할 수 있다.
// 그래서 실제 매개변수가 아니라 this를 타이핑했다는 것.(그래서 추론할 수 있다는 것)
// ev부터가 진짜 매개변수라는 것.
```

<br />

다시 `removeClass`로 돌아가보면, 이와 같은 매개변수 타입상의 this의 특징으로 다음과 같이 쓸 수 있다.

```ts
$p.removeClass((index: number, className: string) => {
  return "myClass";
}).addClass("yourClass");
```

<br />

#### removeClass는 어떻게 addClass를 체이닝할 수 있었을까?

이것을 살펴보기 위해서는 `removeClass`의 리턴타입을 살펴봐야 한다.

```ts
// removeClass(className_function?: string | string[] | ((this: TElement, index: number, className: string) => string)): this;
$p.removeClass("myClass noClass").addClass("yourClass");
```

> 리턴타입이 `:this` 이므로<br />
> $p.addClass('yourClass'); 와 같다는 걸 확인할 수 있다.

<br />

### 다른 jQuery 코드 타입 분석 - 1

```ts
$(["p", "t"]).text("hello");
```

#### `$`, GTD

```ts
<T extends JQuery.PlainObject>(object: T): JQuery<T>;
```

#### `JQuery.PlainObject`, GTD.

```ts
interface PlainObject<T = any> {
  [key: string]: T;
}
```

> 사실상 아무거나(!) 다 되는 객체라고 나와있다.

그리고 결국 반환타입이 `JQuery<T>`기 때문에, jQuery 메소드들을 사용할 수 있다. (`.text()`)

#### `.text()`, GTD.

```ts
// 매개변수(text_function)로 string | number | boolean이 올 수 있고,
// 첫 번째 매개변수 this는 실제 매개변수가 아니니까 없다고 보면되고
// 실행부 역시 string | number | boolean
// 반환타입에는 this 가 있다는 것을 볼 수 있다.
text(text_function: string | number | boolean | ((this: TElement, index: number, text: string) => string | number | boolean)): this;
```

```ts
$(["p", "t"]).text(() => {
  console.log(this);
  return "hello";
  return true;
});
```

<br />

### 다른 jQuery 코드 타입 분석 - 2

```ts
const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});
```

#### `.addClass()`, GTD.

```ts
addClass(className_function: JQuery.TypeOrArray<string> | ((this: TElement, index: number, currentClassName: string) => string)): this;
```

removeClass와 마찬가지로 `((this: TElement, index: number, currentClassName: string) => string)`가 있기 때문에 함수를 넣을 수 있다.

<br />

### 다른 jQuery 코드 타입 분석 - 3

```ts
$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
```

#### `.html()`, GTD.

```ts
html(htmlString_function: JQuery.htmlString |
                              JQuery.Node |
                              ((this: TElement, index: number, oldhtml: JQuery.htmlString) => JQuery.htmlString | JQuery.Node)): this;
```

지금까지 알아봤던 대로 재구성해보자면, `JQuery.htmlString`는 string이고,

```ts
html(htmlString_function: string |
                              JQuery.Node |
                              ((this: TElement, index: number, oldhtml: JQuery.htmlString) => JQuery.htmlString | JQuery.Node)): this;
```

#### `JQuery.Node`, GTD.

```ts
type Node = Element | Text | Comment | Document | DocumentFragment;
```

> 각각 세부적으로 까지 정확히는 모르겠지만, dom api에 있는 일부라는 것 정도...

또 재구성해보자면...

```ts
html(htmlString_function: string |
                              JQuery.Node |
                              ((this: TElement, index: number, oldhtml: string) => JQuery.htmlString | JQuery.Node)): this; // 리턴타입으로 this가 있으니 메서드 체이닝이 가능하다는 것도 알 수 있다.
```

> :)

위 분석한 타입을 통해 알 수 있는 건

```ts
const div = document.createElement("div");
div.innerHTML = "hello";
$(tag).html(div);
```

> 이와 같은 작성도 가능하다는 것.<br />
> ※ div의 타입은 Element(Jquery.Node)보다 좁은 타입이므로

```ts
const div = document.createDocumentFragment();
$(tag).html(div);
```

> 또, 이와 같은 작성도 가능하다는 것 <br />

```ts
$(tag).html(document);
```

> 그리고 Document도 가능하다고 했으므로, 이와같이도 작성할 수 있다.

이런 것들을 우리가 알아낸 것이다.
