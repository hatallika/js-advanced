const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];
// 1 функция возвращает разметку для конкретного товара подставляя название и цену
// 2 функция собирает все товары и записывает в конетйнер .goods-list

const $goodsList = document.querySelector('.goods-list');

const renderGoodsItem = ({title, price}) =>  //сделали деструктуризацию объекта
    `<div class="goods-item"><div class="goods-item__img"></div><h3 class="goods-item__title">${title}
    </h3><p class="goods-item__price">Цена: ${price} у.е.</p><button class="goods-item__button">Добавить</button></div>`;
;

// const renderGoodsList = (list=goods) => {
//     let goodsList = list.map(item => renderGoodsItem(item.title, item.price)).join("\n"); // убрали запятую в выводе товара переведя массив элементов в строку
//     document.querySelector('.goods-list').innerHTML = goodsList;
//     console.log(goodsList);
// }

const renderGoodsList = (list=[]) => {
    // let goodsList = list.map(item => renderGoodsItem(item)).join('\n');
    let goodsList = list.map(renderGoodsItem).join('\n');
    
    $goodsList.insertAdjacentHTML('beforeend', goodsList);
}



renderGoodsList(goods);
