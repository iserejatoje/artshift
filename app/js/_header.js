$(function () {
    let $header = $('header')
    function initScroll() {
        if ($(window).scrollTop() > 0) {
            $header.addClass('header-styled')
        } else {
            $header.removeClass('header-styled')
        }
    }
    $(window).scroll(function () {
        initScroll()
    })
    initScroll()
})