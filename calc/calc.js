
const calc =  {

    sum(a, b) {
        // сложение
        if (a == null||b == null|| a == undefined || b == undefined||
            !(typeof a === "number") || !(typeof b === "number")) {
            return "Аргумент должен быть числом";
        }
        return a + b;
    },

    difference(a, b) {
        if (a == null||b == null|| a == undefined || b == undefined||
            !(typeof a === "number") || !(typeof b === "number")) {
            return "Аргумент должен быть числом";
        }
        return a - b;
    },

    multiplication(a, b) {
        if (a == null||b == null|| a == undefined || b == undefined||
            !(typeof a === "number") || !(typeof b === "number")) {
            return "Аргумент должен быть числом";
        }
        return a * b;
    },

    division(a, b) {
        if (a == null||b == null|| a == undefined || b == undefined||
            !(typeof a === "number") || !(typeof b === "number")) {
            return "Аргумент должен быть числом";
        }

        if (b == 0) { 
            return "На ноль делить нельзя"}        
        return a / b; 
    }
}


console.log(calc.sum(2,3));


module.exports = {
    calc: calc,
}  