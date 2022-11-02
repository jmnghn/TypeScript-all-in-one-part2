// 1
const $p = $("p");
$p.removeClass("myClass noClass").addClass("yourClass");

// 2
$(["p", "t"]).text("hello");
const $a = $(["p", "t"]);

// 3
const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});

// 4
$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
