var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Connected as Id: " + connection.threadId);
});
// Include id name and prices within a table printed to the console.

function Product(id, name, prices) {
    this.id = id;
    this.name = name;
    this.prices = prices;
}

function shop() {
    var stock = [];
    connection.query("SELECT * FROM products", function (err, res) {
        
        for (i = 0; i < res.length; i++) {
            var id = res[i].id
            var name = res[i].product_name
            var price = res[i].price
            var prod = new Product(id, name, price);
            stock.push(prod);
        }
        console.table(stock)


    });
    
    inquirer.prompt([{
        name: "purchase",
        type: "input",
        message: "Enter the id number of the product you wish to purchase.",
        validate: function (input) {
            if (isNaN(input) === true) {
                console.log(`
                please insert a number`)
                return false;
            }return true;
        }
    },
        {
            name: "quantity",
            type: "input",
            message: "Enter desired quantity.",
            validate: function (input) {
                if (isNaN(input) === true) {
                    console.log(`
                please insert a number`)
                    return false;
                } return true
            }
        }]).then(function (answer) {
            
            var query = "SELECT product_name, stock_quantity FROM products WHERE ?"
            var id = answer.purchase;
            var quantity; 
            var stock;
            connection.query(query, {id: id}, function (err, res) {
                quantity = answer.quantity;
                
                stock = res[0].stock_quantity
                if(stock > quantity){
                    console.log("Ordering...");
                    stock -= quantity;
                }else{
                    console.log("insufficient stock.");
                    shop();
                }

            });
        });
};

shop()
// prompt user for id of product they would like to buy
// ask for the number of units
// If there are enough in stock, complete purchase message
// otherwise not enough in stock message
// update sql database and print original message