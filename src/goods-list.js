export default function goodsListModule() {
    Vue.component('goods-list', {
        template: `<div class="goods-list">
                        <h3 class="goods-null" v-if="goods.length == 0">Нет данных / Товары не найдены</h3>
                        <goods-item v-for="good in goods" :good="good" v-bind:key="good.id_product" v-on:add-to-cart="addToCartHandler">
                        </goods-item>
                    </div>`,
        props: ['goods'], // goods = filteredgood
        methods: {
            addToCartHandler(e) {
                this.$emit('add-to-cart2', e) // Генерируем пользовательское событие
            }
        }
    });
}
