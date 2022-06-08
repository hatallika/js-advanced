export default function goodsItem() {
    Vue.component('goods-item', {
        template: `<div class="goods-item">
                        <div class="goods-item__img"></div>
                        <h3 class="goods-item__title">{{ good.product_name }}
                        </h3><p class="goods-item__price">Цена:{{ good.price }} у.е.</p>
                        <button class="goods-item-button" v-on:click="addToCartHandler" v-bind:id="good.id_product">Добавить</button>   
                    </div>
        `,
        props: ['good'],
        methods: {
            addToCartHandler(e) {
          this.$emit('add-to-cart', e) // Генерируем пользовательское событие
            }
        }
    });
}

