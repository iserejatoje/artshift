let observerOptions = {
    threshold: .65
}

if ('IntersectionObserver' in window) {
    let observer = new IntersectionObserver(observerCallback, observerOptions);

    function observerCallback(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !$(entry.target).hasClass('completed')) {
                $(entry.target).addClass('completed')
            }
        });
    }

    document.querySelectorAll('.animated').forEach((el) => {
        if (el) {
            observer.observe(el)
        }
    })

}  else {
    document.querySelectorAll('.animated').forEach((el) => {
        $(el.target).addClass('completed')
    })
}