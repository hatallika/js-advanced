/*Задание:
1. Добавьте пустые классы для корзины товаров и элемента корзины товаров. Продумайте, какие методы понадобятся для работы с этими сущностями.
2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
*/


class ApiMock { // класс получения товара из api (из лекции lesson-2)
    constructor() {

    }

    fetch() {
        return [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 }            
        ]; //предположим что обращаемся к серверу, получаем массив товаров
    }
}

// класс товара
class GoodsItem { 
    constructor (title, price) {
        this.title = title;
        this.price = price; 
    }

    getHtml () { // метод возвращает html разметку
        return `<div class="goods-item"><div class="goods-item__img"></div><h3 class="goods-item__title">${this.title}
    </h3><p class="goods-item__price">Цена: ${this.price} у.е.</p><button class="goods-item__button">Добавить</button></div>`;
    } 
} 

// класс товара корзины. Наследуем его от класса товара. К прежним свойствам добавим свойство количество товаров
// и переопределим вывод товара .
class CartItem extends GoodsItem { 
    constructor (title, price) {
        super(title, price);
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

// список товаров. Задание 2. Добавили свойство суммы всех товаров
class GoodsList { 
    constructor() {
        this.api = new ApiMock(); // откуда получаем товары
        this.$goodsList = document.querySelector('.goods-list'), // куда вставляем витрину
        this.goods = []; // массив со списком товаров пока пустой
    }

    fetchGoods() {
        this.goods = this.api.fetch().map(({title, price}) => new GoodsItem(title, price));
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
// Класс корзины с предполагаемыми методами (Задание 1)
class CartList {
    constructor() {
        this.addCartItems = [];
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

const goodsList = new GoodsList();

goodsList.fetchGoods(); // чтобы записать список товаров в свойство goods
goodsList.render(); //вывод витрины товаров 
goodsList.sumGoods(); // вывод суммы товаров

