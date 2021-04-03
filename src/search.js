export default function searchModule() {
    Vue.component('searching',{
        template: '<div><input id="search" v-model="searchLine" v-on:input="isSearchHandler" placeholder="Фильтр товаров.."> </div>',
        data() {
            return {
            searchLine: '',
        }
        },
        methods: {
            isSearchHandler(e) {
            this.$emit('searchitem', this.searchLine) // Генерируем пользовательское событие
            }
        }
    });
}
