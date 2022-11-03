"use strict";
/**
 * 타입 분석
 */
// // 1
// const $p = $("p");
// $p.removeClass("myClass noClass").addClass("yourClass");
const $tag = $(["p", "q"]);
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
