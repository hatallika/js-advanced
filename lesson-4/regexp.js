// Задание 1.
// Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки.
// Придумать шаблон, который заменяет одинарные кавычки на двойные.

const str =`Смотрю вслед ему и думаю: 'Зачем живут такие люди?' (М.Горький);
'Что-то в ней есть жалкое всё-таки', — подумал я (А.П. Чехов).`;

let regexp = /'/g;
console.log(str.replace(regexp,'"'));

// Задание 2.
// Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.

const str2 = `- 'I’m really sorry about the coffee'.
                - 'That’s OK. It’s late.'
                - 'Our meeting’s at twelve thirty.'
                - 'We can take a taxi.'`
regexp = /(\s'|'\s)/g;
console.log(str2.replace(regexp,'"'));

// Задание 3.+7(000)000-0000
// 3. *Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить. При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
// a. Имя содержит только буквы.
// b. Телефон имеет вид .
// c. E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
// d. Текст произвольный.
// e. Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой и сообщить пользователю об ошибке.

const $form = document.querySelector('form');
const $inputName = document.querySelector('#name');
const $inputTel = document.querySelector('#tel');
const $inputEmail = document.querySelector('#email');

const regexpName = /^[a-zа-яё]+$/i,
regexpTel = /\+7\(\d{3}\)-\d{3}-\d{4}/,
regexpEmail = /[a-zA-Z\d\.\_\-]+@[a-zA-z]+\.(ru|com)/i; // имя/ телефон/ почта

function chekName(input, regexp) {
    
    input.addEventListener('change',()=> {
            if (regexp.test(input.value)) { 
                input.setAttribute('class','access');
            console.log ('Введено верное значение');
            } else {
                input.setAttribute('class','error');
                console.log ('Введено не верное значение');
            }
        })
}

// Проверка во время ввода значений
chekName($inputName, regexpName);
chekName($inputTel, regexpTel);
chekName($inputEmail, regexpEmail);

// Проверка во время нажатия на Submit
$form.addEventListener('submit',(e)=>{
    
    if( regexpName.test($inputName.value)){
        console.log('Name ОК');
        $inputName.classList.add('access');
    } else {
        console.log('Name error');
        $inputName.value = ''; 
        $inputName.placeholder = 'Допустимы только буквы'; 
        e.preventDefault();        
    };
    
    if( regexpTel.test($inputTel.value)){
        console.log('Tel OK');
    } else {
        console.log('Tel error');
        $inputTel.value = ''; 
        $inputTel.placeholder = 'Допустимый формат +7(000)-000-0000';
        e.preventDefault();
    }
    if( regexpEmail.test($inputEmail.value)){
        console.log('Email OK');        
    } else {
        console.log('e-mail error');
        $inputEmail.value = ''; 
        $inputEmail.placeholder = 'Такой почты не существует';
        e.preventDefault();
    }
    
});