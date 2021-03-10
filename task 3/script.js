/* Некая сеть фастфуда предлагает несколько видов гамбургеров:
Маленький (50 рублей, 20 калорий).
Большой (100 рублей, 40 калорий).
Гамбургер может быть с одним из нескольких видов начинок (обязательно):
С сыром (+10 рублей, +20 калорий).
С салатом (+20 рублей, +5 калорий).
С картофелем (+15 рублей, +10 калорий).
Дополнительно гамбургер можно посыпать приправой (+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий). 
Напишите программу, рассчитывающую стоимость и калорийность гамбургера.
Можно использовать примерную архитектуру класса со следующей страницы, но можно использовать и свою.*/

const components = { // вводные данные	

	small: {
		price: 50,
		calories: 20
	},

	large: {
		price: 100,
		calories: 40
	},

	cheese: {
		price: 10,
		calories: 20
	},

	salad: {
		price: 20,
		calories: 5
	},

	potato: {
		price: 15,
		calories: 10
	},

	spice: {
		price: 15,
		calories: 0
	},

	sous: {
		price: 20,
		calories: 5
	},
};


class Hamburger { 
	constructor () { //size, filling, topping
	this.allcomponents = components; //получаем список вводных данных
	this.myburger = []; // массив составляющих бургера
	}	
// добавить выбранную начинку с массив
	addFill(){
		let n = document.getElementById("stuffing").options.selectedIndex;
		let fill = document.getElementById("stuffing").options[n].value;		
		this.myburger.push(this.allcomponents[fill]);		
	}

	// добавить выбранную приправу/специю
	addTopping(){ 
		let toppings = document.querySelectorAll('input[name=add]:checked');		
			for(let i = 0; i < toppings.length; i++){
					this.myburger.push(this.allcomponents[toppings[i].value]);														
			}
			
	}
	//получить выбранный размер
	getSize() {
		let size = document.querySelector('input[name=size]:checked').value;
		this.myburger.push(this.allcomponents[size]);		
	}
	
	//посчитать каллории и стоимость
	calc() {
		var price = 0, calories = 0;		
		this.myburger.forEach( ({price:price1, calories: calories1})  => { 
			price += parseInt(price1);
			calories += parseInt(calories1);
		});				
			this.result(price, calories);
	};	

	result(price, calories) {
		document.getElementById('price').innerHTML = price;
		document.getElementById('calories').innerHTML = calories;
	};

	isOrder(){

	}
		
}
	
	myHamburger = function(){
		let hamburger = new Hamburger;		
		hamburger.addFill(); // начинка только одна на выбор
		hamburger.addTopping(); // приправа и соус
		hamburger.getSize(); // размер
		hamburger.calc(); //считаем калории и стоимость
		
	}
	document.getElementById('order').addEventListener('click', myHamburger);	

