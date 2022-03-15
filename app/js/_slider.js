if (document.getElementsByClassName('swiper-container').length > 0) {
    let element = document.createElement('script');

    let script = document.currentScript,
        fullUrl = script.src,
        updatedString = fullUrl.replace("app.min.js", "")
    element.src = updatedString + '_swiper.min.js';

    element.async = true;
    document.getElementsByTagName('body')[0].appendChild(element);
    element.onload = function () {
        if (document.getElementsByClassName('exclusive-projects-slider').length > 0) {
            new Swiper('.exclusive-projects-slider', {
                speed: 600,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    860: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1366: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    }
                },
            });
        }
        if (document.getElementsByClassName('premier-slider').length > 0) {
            new Swiper('.premier-slider', {
                speed: 1000,
                loop: true,
                slidesPerView: 1,
                navigation: {
                    nextEl: '.premier .next',
                    prevEl: '.premier .prev',
                },
            });
        }
    }
}