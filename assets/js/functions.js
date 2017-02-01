$(function() {
  navbarScroll();
});

function navbarScroll() {
  $(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
      $("nav.navbar").removeClass("top");
    }
    else {
      $("nav.navbar").addClass("top");
    }
  });
}
