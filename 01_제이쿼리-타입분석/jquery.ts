/**
 * 타입 분석
 */
// // 1
// const $p = $("p");
// $p.removeClass("myClass noClass").addClass("yourClass");

// // 2
// $(["p", "t"]).text("hello");
// const $a = $(["p", "t"]);

// // 3
// const tag = $("ul li").addClass(function (index) {
//   return "item-" + index;
// });

// // 4
// $(tag).html(function (i: number) {
//   console.log(this);
//   return $(this).data("name") + "입니다";
// });

/**
 * 타입 만들기
 */
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

const $tag: zQuery = $(["p", "q"]) as unknown as zQuery;

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

// 5 - jquery로 감싼 jquery
const tag = $("ul li")
  .addClass("hello")
  .addClass(function (index) {
    return "item-" + index;
  });

$(tag).html(document);
