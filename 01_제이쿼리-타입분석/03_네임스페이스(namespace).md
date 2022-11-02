## 네임스페이스(namespace)

<br />

### JQueryStatic

```ts
// jquery - index.d.ts

// [jQuery에 마우스 오버] const jQuery: JQueryStatic
export = jQuery;
```

#### jQuery, Go to Definition

```ts
// misc.d.ts
// ※ misc → miscellaneous (여러 가지 잡다한, 기타)

// ...
declare const jQuery: JQueryStatic;
declare const $: JQueryStatic;
// ...
```

> ※ 짧막 복습: `declare` 실제 구현 다른 파일 어딘가에 있다고 가정해놓고 타입만 선언해놓는 문법.<br />
> 'ambient 선언'이라고 한다.

그래서 샘플 코드를 다음과 같이 `$`를 `jQuery`로 변경해도 동작한다는 것을 알수도 있다.

```ts
// $
$("p").removeClass("myClass noClass").addClass("yourClass");
$(["p", "t"]).text("hello");
const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});
$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});

// jQuery
jQuery("p").removeClass("myClass noClass").addClass("yourClass");
jQuery(["p", "t"]).text("hello");
const tag = jQuery("ul li").addClass(function (index) {
  return "item-" + index;
});
jQuery(tag).html(function (i: number) {
  console.log(this);
  return jQuery(this).data("name") + "입니다";
});
```

<br />

#### JQueryStatic, Go to Definition

> 사실 샘플코드의 `$`에서 Go to Definition으로 `JQueryStatic.d.ts`에 바로 진입할 수 있지만, 지금까지 `index.d.ts`부터 찾아들어와 이 흐름을 파악할 수 있었다.

```ts
// 샘플코드
$("p").removeClass("myClass noClass").addClass("yourClass");
```

```ts
// [샘플코드 첫번째 $로 'Go to Definition']

// JQueryStatic.d.ts
<TElement extends HTMLElement = HTMLElement>(html: JQuery.htmlString, ownerDocument_attributes?: Document | JQuery.PlainObject): JQuery<TElement>;
```

```ts
// [html: JQuery.htmlString로 Go to Definition]

// misc.d.ts
type htmlString = string;
```

그렇다면 JQuery`.`은 어디서 왔을까?<br />
아까의 `type htmlString = string;`에서 조금 더 위를 보면,<br />
`declare namespace JQuery`를 볼 수 있다.

```ts
declare namespace JQuery {
    type TypeOrArray<T> = T | T[];
    type Node = Element | Text | Comment | Document | DocumentFragment;

    /**
     * A string is designated htmlString in jQuery documentation when it is used to represent one or more DOM elements, typically to be created and inserted in the document. When passed as an argument of the jQuery() function, the string is identified as HTML if it starts with <tag ... >) and is parsed as such until the final > character. Prior to jQuery 1.9, a string was considered to be HTML if it contained <tag ... > anywhere within the string.
     */
    type htmlString = string;
    //...
```

> 네임스페이스는 script src로 불러오는 라이브러리에서 주로 쓴다.(전역)

`namespace`는 `htmlString`외에도 다른 타입들을 하나로 묶어주는 역할을 한다.<br />
타입을 묶어주는 건 왜 필요할까? <br />
다음과 같이 선언한 타입들이 있다고 했을 때,

```ts
declare const a: string;
declare const b: string;
declare const c: string;
```

다른 코드(또는 라이브러리)에서도 같은 이름의 타입이 존재한다면 충돌이 일어날 것이다.<br />
하지만 이 이름이 너무 적절하다고 생각했고, 그래서 이를 하나로 묶어줌으로써 충돌 문제를 해결한다. (그룹핑)

```ts
declare namespace A {
  const a: string;
  const b: string;
  const c: string;
}

A.a;
```

그래서 `jQuery.htmlString`을 다시 살펴보면,<br />
`htmlString`이 다른 라이브러리에서도 충분히 쓸 수 있는 타입명이기 때문에 `declare namespace JQuery {...}`로 그룹핑 하였다.<br />
`namespace`가 다른 기능적인 특성을 갖고 있는 문법은 아니라는 것이며 `jQuery.htmlString`은 결국 `string` 타입을 뜻하는거라 볼 수 있다.

<br />

#### `JQuery<TElement>`

다시 `$`의 타입을 살펴보면,

```ts
<TElement extends HTMLElement = HTMLElement>(html: JQuery.htmlString, ownerDocument_attributes?: Document | JQuery.PlainObject): JQuery<TElement>;
```

`ownerDocument_attributes?: Document | JQuery.PlainObject`는 사용하지 않으니까 넘어가고, `JQuery<TElement>`가 보이는데 이게 중요하다.

#### TElement, Go to Definition

```ts
// JQueryStatic.d.ts
<TElement extends HTMLElement = HTMLElement>(html: JQuery.htmlString, ownerDocument_attributes?: Document | JQuery.PlainObject): JQuery<TElement>;
```

`TElement`를 `HTMLElement`로 제한해놓은 것을 확인할 수 있다.<br />

#### HTMLElement, Go to Definition

```ts
// global.d.ts

// ...
interface HTMLElement extends Element {}
// ...
```

그래서 결국 `JQuery<TElement>`는 `JQuery<HTMLElement>`로 볼 수 있다.<br />
이제 `TElement`가 `HTMLElement`(html 태그)인 것은 이해를 했고, 그렇다면 JQuery는 뭘까?<br />

```ts
// [리턴타입에 마우스오버]
// interface JQuery<TElement = HTMLElement>
// namespace JQuery
: JQuery<TElement>;
// ...?? interface와 namespace가 동시에 나온다.
// Tip - jQuery는 interface일까 namespace일까? 이럴 때는 뒤의 제네릭까지 정확하게 일치하는지를 보면된다.
// 그래서 여기에서의 JQuery는 interface가 아니라 namespace겠구나라는 것을 알 수 있다.
```

#### JQuery, Go to Definition

```ts
// JQuery.d.ts

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
  //...
```

#### ...지금까지

```ts
// [타입추론] const $p: JQuery<HTMLElement> // 이걸 찾아내는 여정이었다. 😅
const $p = $("p");
$p.removeClass("myClass noClass").addClass("yourClass");
```
