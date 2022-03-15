import IMask from 'imask'

const phone_inputs = document.querySelectorAll('[type="tel"]')
Array.prototype.forEach.call(phone_inputs, function (element) {
    new IMask(element, {
        mask: '+{7} (000) 000-00-00',
    })
})