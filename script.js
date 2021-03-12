/*Задание:
1. Добавьте пустые классы для корзины товаров и элемента корзины товаров. Продумайте, какие методы понадобятся для работы с этими сущностями.
2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
*/
const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

class Api { // класс получения товара из api (из лекции lesson-2)
    constructor() {
        this.url = `${API_URL}/catalogData.json`;
    }

    fetch(error, success) {        
        let xhr;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { 
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    success(xhr.responseText);
                } else if (xhr.status > 400) {
                    error('Все пропало');
                }            
            }
        }
        
        xhr.open('GET', this.url, true);
        xhr.send();
                
    }

    fromJSON(data){ // пример из лекции 3 добавление в цепочку промисов
        return new Promise((resolve) => {
            resolve(JSON.parse(data))
        })
    }

    fetchPromise(){
        return new Promise((resolve, reject) => {
            this.fetch(reject,resolve)
        } )
    }
}

// класс товара
class GoodsItem { 
    constructor (product_name, price) {
        this.product_name = product_name;
        this.price = price; 
    }

    getHtml () { // метод возвращает html разметку
        return `<div class="goods-item"><div class="goods-item__img"></div><h3 class="goods-item__title">${this.product_name}
    </h3><p class="goods-item__price">Цена: ${this.price} у.е.</p><button class="goods-item__button">Добавить</button></div>`;
    } 
} 

class Header {
    constructor(){
        this.$container = document.querySelector('header');
        this.$button = this.$container.querySelector('.cart-button') 
    }
    setButtonHandler(callback){ //берет калбек и устанавливает как обработчик
        this.$button.addEventListener('click', callback)
    }
}

// список товаров. Задание 2. Добавили свойство суммы всех товаров
class GoodsList { 
    constructor() {
        this.api = new Api(); // откуда получаем товары
        this.$goodsList = document.querySelector('.goods-list'), 
        this.goods = []; 

        //this.api.fetch(this.onFetchError.bind(this), this.onFetchSuccess.bind(this)); // проверить
        this.api.fetchPromise()
            .then((response) => this.api.fromJSON(response))
            .then((data) => {this.onFetchSuccess(data) })
            .catch((err) => {this.onFetchError(err) })
    }

    
    onFetchSuccess(data) {
        this.goods = data.map(({product_name, price}) => new GoodsItem(product_name, price)); // 
        this.render();
    }

    onFetchError(err) {
        this.$goodsList.insertAdjacentHTML('beforeend', `<h3>${err}</h3>`)
    }
    
    fetchGoods() {
        this.goods = this.api.fetch().map(({product_name, price}) => new GoodsItem(product_name, price));
    }

    render() {             // выводим витрину посредством "интерфейса" getHtml
            this.$goodsList.textContent = '';
            this.goods.forEach(
                item => this.$goodsList.insertAdjacentHTML('beforeend', item.getHtml())
            ); 
    }
    sumGoods() {
        let totalPrice = 0;
        this.goods.forEach( ({price}) =>  { totalPrice += price;} );
        let $totalPriceAnswer = `<div class="goods-item__total-price">Стоимость всех товаров: ${totalPrice}</div>`;
        console.log(totalPrice);
        this.$goodsList.insertAdjacentHTML('afterend', $totalPriceAnswer);
    }    
}

// класс товара корзины. Наследуем его от класса товара. К прежним свойствам добавим свойство количество товаров
// и переопределим вывод товара .
class CartItem extends GoodsItem { 
    constructor (product_name, price) {
        super(product_name, price);
        this.quantity = 1; //по умолчанию количество товаров добавленных в корзину 1. Если полльзователь ничего не указывал.
    }

    getQuantity(){ // присваиваем this.quantity количество товаров указанных пользователем.
    }; 

    getHtml () { // переопределяем вывод товара в корзине изменим стили, добавим количество и добавим кнопку удалить товар.
        return `<div class="cart-item"><div class="cart-item__img"></div><h3 class="cart-item__title">${this.title}
    </h3><p class="cart-item__price">Цена: ${this.price} у.е.</p>
    <div class="cart-item__qty">
    <label for="qty-id">
        <span class="cart-item__label">Выбрать количество</span>
        <select name="qty-id" class="select js-qty-select">                                                                                                                                                   <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>                           
        </select>
    </label>
    </div><p class="cart-item__quantity">Количество:${this.quantity}</p><button class="cart-item__button">Удалить из корзины</button></div>`;
    } 
}

// Класс корзины с предполагаемыми методами (Задание 1)
class CartList {
    constructor() {
        this.addCartItems = [];
    }

    openCart(){
        console.log('корзина появилась в консоли')
    }


    // добавление товара в корзину после действия пользователя (нажать добавить)
    addToCart(){} 
    
    // удаление товара из корзины после действия пользователя (нажать удалить)
    deleteFromCard(){}
    
    // сумма товаров в корзине
    orderSummary(){} // вывод сводки по заказу и кнопки оформления заказа( кнопки регистрация, быстрый заказ)
    
    //вывод товаров 
    render(){}
}
const header = new Header();
const cartList = new CartList();
header.setButtonHandler(cartList.openCart);
const goodsList = new GoodsList();

// goodsList.fetchGoods(); // чтобы записать список товаров в свойство goods
// goodsList.render(); //вывод витрины товаров 
// goodsList.sumGoods(); // вывод суммы товаров

