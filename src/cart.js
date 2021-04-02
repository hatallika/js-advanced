export default function cartComponent() {
    Vue.component('cart', { // вывод корзины в main. Кнопка вызывающая  козину здесь отдельно в header
        template: `
            <div v-if="visible" class="cart-list" >
                <div class="cart-list__price">Сумма товаров: {{price}}</div>
                <div class="cart-item" v-for="item in cart">
                <div class="cart-item__img"></div>
                <h3 class="cart-item__title">{{item.product_name}}</h3>
                <p class="cart-item__price">Цена: {{item.price}} у.е.</p>
                <button type="button"  name="delete" class="cart-item__qnt" v-bind:data-qntid="item.id_product" v-on:click="deleteQuantity">-</button>
                <span class="cart-item__quantity">Количество: <b>{{item.qnt}}</b></span>
                <button type="button"  name="add" class="cart-item__qnt" v-bind:data-qntid="item.id_product" v-on:click="addQuantity">+</button>
                        <div class="cart-item__delete">
                            <button class="cart-item__button" v-bind:data-id="item.id_product" v-on:click="deleteFromCartHandler">Удалить из корзины</button>
                        </div>
                </div>                  
            </div>
        `,
        props: ['visible', 'price', 'cart'],
        methods: {
            deleteQuantity(e) {
                this.$emit('delete-qnt', e);
            },

            addQuantity(e) {
                this.$emit('add-qnt', e);
            },

            deleteFromCartHandler(e) {
                this.$emit('delete-from-cart', e);
            },

        },
    });

}
