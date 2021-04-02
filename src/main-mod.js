export default function mainModule() {
    const API_URL = ".";
    const vue = new Vue({
        el: "#app",
        data: {
            //url: `${API_URL}/catalogData.json`,
            urlGet: `catalogData`,
            urlPostAdd: `addToCart`,
            urlPostDelete: `deleteToCart`,
            urladdQnt: `addQntToCart`,
            urlDelQnt: `deleteQntToCart`,
            urlGetCart: `cartData`,
            goods: [],
            filteredGoods: [],
            cartItems: [],
            isVisibleCart: false,
            isError: false,
            cartApi: [],
        },

        computed: {
            //считает количество товаров в корзине
            summCartItemsquant() {
                let summQnt = 0;
                this.cartItems.forEach(({
                    qnt
                }) => {
                    summQnt += qnt
                });
                return summQnt;
            },
            //сумма товаров
            totalPrice() {
                let summ = 0;
                this.cartItems.forEach(({
                    price,
                    qnt
                }) => {
                    summ += (qnt * price)
                });
                return summ;
            }
        },

        methods: {
            //поиск по названию
            searchHandler(searchLine) {
                if (searchLine === '') {
                    this.filteredGoods = this.goods;
                }
                const regexp = new RegExp(searchLine, 'gi');
                this.filteredGoods = this.goods.filter((good) => regexp.test(good.product_name));
            },
            //добавить товар в корзину
            addToCartHandler(e) {
                const id = e.target.id;
                let indexCart = this.cartItems.findIndex((item) => item.id_product == id);
                //если такого товара еще нет в корзине, добавляем к массиву корзины     
                if (indexCart == -1) {
                    const good = this.goods.find((item) => item.id_product == id);
                    let {
                        product_name,
                        price
                    } = good;
                    let item = {
                        product_name: product_name,
                        price: price,
                        id_product: id,
                        qnt: 1
                    }
                    this.cartItems.push(item);
                    this.fetchPromisePOST(this.urlPostAdd, item); // добавляем в API
                } else {
                    // если товар уже был в корзине увеличиваем количество на 1
                    this.cartItems[indexCart].qnt = parseInt(this.cartItems[indexCart].qnt) + 1;

                    let itemForApi = {
                        id_product: id,
                        addQnt: 1
                    } // передаем в API индекс товара и на какое количество его надо увеличить
                    //в интерфейсе у нас на 1, но заложим возможность увеличить в API на любое значение (введенное, выбранное)
                    this.fetchPromisePOST(this.urladdQnt, itemForApi);
                };

                this.isVisibleCart = true; // делаем корзину видимой при любой покупке
            },
            // удалить товар из корзины
            deleteFromCartHandler(e) {
                const id = e.target.dataset.id;
                let ind = this.cartItems.findIndex((item) => item.id_product == id);
                this.fetchPromisePOST(this.urlPostDelete, this.cartItems[ind]); // удаление из API
                this.cartItems.splice(ind, 1); // удалление из массива данных
            },

            // показать корзину
            showCart() {
                this.isVisibleCart = !this.isVisibleCart;
            },

            //уменьшить количество товара в корзине на 1
            deleteQuantity(e) {
                const id = e.target.dataset.qntid;
                this.fetchPromisePOST(this.urlDelQnt, {
                    id_product: id
                });
                let indexCart = this.cartItems.findIndex((item) => item.id_product == id);
                if (this.cartItems[indexCart].qnt > 1) {
                    this.cartItems[indexCart].qnt = parseInt(this.cartItems[indexCart].qnt) - 1;
                } else {
                    this.cartItems.splice(indexCart, 1);
                }
            },

            //увеличить количество товара в корзине
            addQuantity(e) {
                const id = e.target.dataset.qntid;
                let indexCart = this.cartItems.findIndex((item) => item.id_product == id);
                this.cartItems[indexCart].qnt = parseInt(this.cartItems[indexCart].qnt) + 1;
                let itemForApi = {
                    id_product: id,
                    addQnt: 1
                } // передаем в API индекс товара и на какое количество его надо увеличить
                //в интерфейсе у нас на 1, но заложим возможность увеличить в API на любое значение (введенное, выбранное)
                this.fetchPromisePOST(this.urladdQnt, itemForApi);
            },

            fetchGET(error, success, url) {
                let xhr;

                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            success(JSON.parse(xhr.responseText));
                        } else if (xhr.status > 400) {
                            error('все пропало');
                        }
                    }
                }

                xhr.open('GET', `${API_URL}/${url}`, true);
                xhr.send();
            },

            fetchPOST(error, success, url, data) {
                let xhr;

                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            success(xhr.responseText);
                        } else if (xhr.status > 400) {
                            error('все пропало');
                        }
                    }
                }

                xhr.open('POST', `${API_URL}/${url}`, true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                xhr.send(JSON.stringify(data));
            },

            fetchPromiseGET(url) {
                return new Promise((resolve, reject) => {
                    this.fetchGET(reject, resolve, url)
                })
            },

            fetchPromisePOST(url, data) {
                return new Promise((resolve, reject) => {
                    this.fetchPOST(reject, resolve, url, data)
                })
            }
        },
        mounted() {
            this.fetchPromiseGET(this.urlGet)
                .then(data => {
                    this.goods = data;
                    this.filteredGoods = data;
                    this.fetchPromiseGET(this.urlGetCart).then(data => {
                        this.cartItems = data;
                        console.log(this.cartItems);
                    })
                })
                .catch(err => {
                    this.isError = true;
                    console.log(this.isError);
                })
        }
    })
}
