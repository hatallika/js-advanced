const time1 = new Date();
const express = require('express');

const bodyParser = require('body-parser');
const fs = require('fs');
const { json } = require('express');

const app = express();

app.use(bodyParser.json()); // Указываем, что содержимое - JSON

app.use(express.static('.'));

app.get('/catalogData', (req, res) => {
    fs.readFile('catalog.json', 'utf8', (err, data) => {
        res.send(data);
    });
});

app.get('/cartData', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
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
                    writeLog(item, 'add to cart');
                }
            });
        }
    });
});

//запись лога
function writeLog(item, isAction) {
    let itemLog = {action: isAction, data: time1, good: item };
    fs.readFile("stats.json", "utf8", function(error,data){
        if (error) throw error;        
        let log = JSON.parse(data);
        log.push(itemLog);
        
        fs.writeFile('stats.json', JSON.stringify(log), (err) => {
            if (err) {
                console.log('ошибка записи файла stats.json');
            }     
        });
    });
    
}    

app.post('/deleteToCart', (req, res) => {
    fs.readFile('cart.json', 'utf8', (err, data) => {
        if (err) {
            res.send('{"result": 0}');
        } else {
                const cart = JSON.parse(data);
                const item = req.body;

                const id = item.id_product;
                
                let ind = cart.findIndex((item) => item.id_product == id);
                cart.splice(ind, 1); 

            fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                    writeLog(item, 'delete');

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
                    writeLog(cart[ind], 'addQnt');
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
                var cartLog = cart[ind]; // запишем данные для лога пока не удалили
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
                    writeLog(cartLog, 'delete qnt'); // log
                }
            });
        }
    });
});


app.listen(3000, function () {
    console.log('server is running on port 3000!');
});