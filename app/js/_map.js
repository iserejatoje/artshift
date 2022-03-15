let mapInit = false

function elementInViewport(el) {
    let top = el.offsetTop
    let left = el.offsetLeft
    let width = el.offsetWidth
    let height = el.offsetHeight
    while (el.offsetParent) {
        el = el.offsetParent
        top += el.offsetTop
        left += el.offsetLeft
    }
    return (
        top < (window.scrollY + window.innerHeight) &&
        left < (window.scrollX + window.innerWidth) &&
        (top + height) > window.scrollY &&
        (left + width) > window.scrollX
    )
}

function initMap() {
    if (elementInViewport(document.getElementById('map')) && !mapInit) {
        mapInit = true
        let script = document.createElement("script")
        script.src = "https://api-maps.yandex.ru/2.0/?load=package.standard&apikey=ace3bdd3-03b0-4c09-9d9e-3b3783391501&lang=ru-RU"
        document.getElementsByTagName("body")[0].appendChild(script)
        script.onload = function () {
            ymaps.ready(function () {
                let map_element = document.getElementById('map')
                let map = new ymaps.Map('map', {
                        center: [map_element.getAttribute('data-lat'), map_element.getAttribute('data-lng')],
                        zoom: 17
                    }, {
                        suppressMapOpenBlock: true
                    }
                );
                let icon_layout = ymaps.templateLayoutFactory.createClass([

                    '<svg width="30" height="37" viewBox="0 0 30 37" fill="none" xmlns="http://www.w3.org/2000/svg">',
                        '<path d="M25.6067 25.94L15 36.5466L4.39334 25.94C2.29557 23.8422 0.866978 21.1694 0.288214 18.2597C-0.290549 15.35 0.00651141 12.334 1.14183 9.59314C2.27715 6.85226 4.19974 4.50959 6.66647 2.86138C9.13321 1.21317 12.0333 0.333435 15 0.333435C17.9667 0.333435 20.8668 1.21317 23.3335 2.86138C25.8003 4.50959 27.7229 6.85226 28.8582 9.59314C29.9935 12.334 30.2906 15.35 29.7118 18.2597C29.133 21.1694 27.7044 23.8422 25.6067 25.94V25.94ZM15 22C16.7681 22 18.4638 21.2976 19.7141 20.0473C20.9643 18.7971 21.6667 17.1014 21.6667 15.3333C21.6667 13.5652 20.9643 11.8695 19.7141 10.6193C18.4638 9.36902 16.7681 8.66664 15 8.66664C13.2319 8.66664 11.5362 9.36902 10.286 10.6193C9.03572 11.8695 8.33334 13.5652 8.33334 15.3333C8.33334 17.1014 9.03572 18.7971 10.286 20.0473C11.5362 21.2976 13.2319 22 15 22V22ZM15 18.6666C14.116 18.6666 13.2681 18.3154 12.643 17.6903C12.0179 17.0652 11.6667 16.2174 11.6667 15.3333C11.6667 14.4492 12.0179 13.6014 12.643 12.9763C13.2681 12.3512 14.116 12 15 12C15.8841 12 16.7319 12.3512 17.357 12.9763C17.9821 13.6014 18.3333 14.4492 18.3333 15.3333C18.3333 16.2174 17.9821 17.0652 17.357 17.6903C16.7319 18.3154 15.8841 18.6666 15 18.6666Z" fill="#CB8964"/>',
                    '</svg>'

                ].join(''))

                let placemark = new ymaps.Placemark(map.getCenter(), {}, {
                    iconLayout: icon_layout,
                    iconImageSize: [30, 37],
                });

                map.geoObjects.add(placemark);

            })
        }
    }
}

if (document.getElementById('map')) {
    initMap()

    window.addEventListener('scroll', () => {
        initMap()
    })
}