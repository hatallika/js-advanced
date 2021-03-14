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
    constructor (product_name, price, id_product) {
        this.product_name = product_name;
        this.price = price;        
        this.id_product = id_product;
    }

    getHtml () { // метод возвращает html разметку
        return `<div class="goods-item"><div class="goods-item__img"></div><h3 class="goods-item__title">${this.product_name}
    </h3><p class="goods-item__price">Цена: ${this.price} у.е.</p><button class="goods-item__button" id="${this.id_product}">Добавить</button></div>`;
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
    constructor(isClass) {
        this.api = new Api(); // откуда получаем товары
        this.$goodsList = document.querySelector('.'+ isClass), 
        this.goods = [];
        this.header = new Header; 
        

        //this.api.fetch(this.onFetchError.bind(this), this.onFetchSuccess.bind(this)); // проверить
        this.api.fetchPromise()
            .then((response) => this.api.fromJSON(response))
            .then((data) => {this.onFetchSuccess(data) })
            .catch((err) => {this.onFetchError(err) })
    }

    
    onFetchSuccess(data) {
        this.goods = data.map(({product_name, price, id_product}) => new GoodsItem(product_name, price, id_product)); // 
        this.render();
        //this.header.setButtonHandler(cartList.renderCart); // вызывать корзину по кнопке / пока вызываем на той же странице
    }

    onFetchError(err) {
        this.$goodsList.insertAdjacentHTML('beforeend', `<h3>${err}</h3>`)
    }
    

    createdCart(){}   
    
    // fetchGoods() {
    //     this.goods = this.api.fetch().map(({product_name, price}) => new GoodsItem(product_name, price));
    // }    
    
    //метод добавления события на кнопки в витрине
    addbuttonHandler(callback){ 
        let $buttons = document.querySelectorAll(".goods-item__button");
        console.log($buttons);
        $buttons.forEach(element => {
            element.addEventListener('click', callback)          
        });
    };


    render() {             // выводим витрину посредством "интерфейса" getHtml
            this.$goodsList.textContent = '';
            this.goods.forEach(
                item => this.$goodsList.insertAdjacentHTML('beforeend', item.getHtml())                
            );
            this.addbuttonHandler(cartList.addCartItem);           
    }
    sumGoods() { // сумма всех товаров
        let totalPrice = 0;
        this.goods.forEach( ({price}) =>  { totalPrice += price;} );
        return totalPrice;         
    }  
    
    
}

// класс товара корзины. Наследуем его от класса товара. К прежним свойствам добавим свойство количество товаров
// и переопределим вывод товара .
class CartItem extends GoodsItem { 
    constructor (product_name, price, id, quantity) {
        super(product_name, price, id);
        this.quantity = quantity; //по умолчанию количество товаров добавленных в корзину 1. Если полльзователь ничего не указывал.
    }

    addQuantity(a){ // присваиваем this.quantity количество товаров указанных пользователем желающим изменить количество товаров в корзине.
        this.quantity = a; 
    }; 

    getHtml () { // переопределяем вывод товара в корзине. изменим стили, добавим количество и добавим кнопку удалить товар.
        return `<div class="cart-item"><div class="cart-item__img"></div><h3 class="cart-item__title">${this.product_name}
    </h3><p class="cart-item__price">Цена: ${this.price} у.е.</p>
    <div class="cart-item__qty">
    <label for="qty-id">
        <span class="cart-item__label">Выбрать количество</span>
        <select name="qty-id" class="select js-qty-select">                                                                                                                                                   <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>                           
        </select>
    </label>
    </div><p class="cart-item__quantity">Количество:${this.quantity}</p><button class="cart-item__button" id="${this.id_product}">Удалить из корзины</button></div>`;
    }
    
    
}

// Класс корзины
class CartList {
    constructor(isClass) {
        
        this.$container = document.querySelector(`.${isClass}`); //'.cart-list' 
        this.arr = [];          
    }
    

    addCartItem(e){

        // узнакть как передавать ссылку на this.arr тут это не работает так как this это (e)
        let id = e.target.id;
        let ind = goodsList.goods.findIndex( obj => {
            return obj.id_product == id
        });
        let {product_name, price} = goodsList.goods[ind];
        
        // проверка на наличие выбранного товара в корзине
            ind = cartList.arr.findIndex( obj => {
            return obj.id_product == id
        });        
         // добавляем если не было, если был, увеличивоем количество.
        if (ind == -1) {
            cartList.arr.push(new CartItem(product_name, price, id, 1));
            console.log(cartList.arr);
        } else {
            cartList.arr[ind].quantity = parseInt(cartList.arr[ind].quantity) + 1;
            console.log(cartList.arr);
        }       
        cartList.renderCart();  
    }

    deleteCartItem(e){
        let id = e.target.id;
        let ind = cartList.arr.findIndex( obj => {
            return obj.id_product == id
        });
        cartList.arr.splice(ind, 1);
        console.log(cartList.arr)
        cartList.renderCart(); 
    };

    renderCart() {             // выводим корзину посредством "интерфейса" getHtml
    cartList.$container.textContent = '';
    cartList.arr.forEach(
        item => cartList.$container.insertAdjacentHTML('beforeend', item.getHtml())                
    ); 
    cartList.addbuttonHandler(cartList.deleteCartItem);
    console.log(this.sumGoods());   
    }

    addbuttonHandler(callback){ 
        let $buttons = document.querySelectorAll(".cart-item__button");
        console.log($buttons);
        $buttons.forEach(element => {
            element.addEventListener('click', callback)          
        });
    };


    openCart(){
        console.log('корзина появилась в консоли');
        
    }

    sumGoods() { // сумма всех товаров
        let totalPrice = 0;
        this.arr.forEach( ({price,quantity}) =>  { totalPrice = totalPrice + (price * quantity);} );
        return totalPrice;         
    }  

    // добавление товара в корзину после действия пользователя (нажать добавить)
    addToCart(){} 
    
    // удаление товара из корзины после действия пользователя (нажать удалить)
    deleteFromCard(){}
    
    // сумма товаров в корзине
    orderSummary(){} // вывод сводки по заказу и кнопки оформления заказа( кнопки регистрация, быстрый заказ)
    

}
//const header = new Header();
const goodsList = new GoodsList('goods-list');
const cartList = new CartList('cart-list');
//header.setButtonHandler(cartList.openCart);



