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

function Product(name, prices){
    this.name = name;
    this.prices = prices;
}

function shop() {
    
    connection.query("SELECT * FROM products", function (err, res) {
        var stock = {};
        for(i=0; i < res.length; i++){
            var id = res[i].id
            var name = res[i].product_name
            var price = res[i].price
            stock[id] = new Product(name, price);
        }
        console.table(stock)
    });

};

shop()
// prompt user for id of product they would like to buy
// ask for the number of units
// If there are enough in stock, complete purchase message
// otherwise not enough in stock message
// update sql database and print original message