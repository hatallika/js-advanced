export default function serverError() {
    Vue.component('server-error', {
        template: `<h3 class="goods-null" v-if="iserror">Ошибка сервера</h3>`,
        props: ['iserror'],
    });

}
