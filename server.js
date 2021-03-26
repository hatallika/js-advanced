const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json()); // Указываем, что содержимое - JSON

app.use(express.static('.'));

app.get('/catalogData', (req, res) => {
    fs.readFile('catalog.json', 'utf8', (err, data) => {
        res.send(data);
    });
});


app.post('/addToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
            const cart = JSON.parse(data);
            const item = req.body;

            cart.push(item);

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

app.post('/deleteToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
                const cart = JSON.parse(data);
                const item = req.body;

                const id = item.id_product;
                console.log(id);
                let ind = cart.findIndex((item) => item.id_product == id);
                cart.splice(ind, 1); 

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

app.post('/addQntToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
                const cart = JSON.parse(data);
                const itemBody = req.body; //{id_product, addQnt} // передаем id и количество товара на которое надо увеличить из интерфейса приложения
                
                let ind = cart.findIndex((item) => item.id_product == itemBody.id_product);                
                cart[ind].qnt = cart[ind].qnt + itemBody.addQnt; // меняем количество на указанное в приложении
            // переписываем корзину
            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

app.post('/deleteQntToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
                const cart = JSON.parse(data);
                const itemBody = req.body; //{id_product} // передаем id товара у которого уменьшим количество.
                let ind = cart.findIndex((item) => item.id_product == itemBody.id_product);  
                
                if (cart[ind].qnt >1){
                    cart[ind].qnt = parseInt(cart[ind].qnt) - 1;
                } else {
                    cart.splice(ind, 1); // удаляем товар если он был 1
                }
                
            // переписываем корзину
            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    });
});


app.listen(3000, function () {
    console.log('server is running on port 3000!');
});