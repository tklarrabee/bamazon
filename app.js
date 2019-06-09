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
    shop();
});
// Include id name and prices within a table printed to the console.

function Product(id, name, prices, stock) {
    this.id = id;
    this.name = name;
    this.prices = prices;
    this.stock = stock
}

function shop() {
    var store = [];
    connection.query("SELECT * FROM products", function (err, res) {
        
        for (i = 0; i < res.length; i++) {
            var id = res[i].id
            var name = res[i].product_name
            var price = res[i].price
            var stock = res[i].stock_quantity
            var prod = new Product(id, name, price, stock);
            store.push(prod);
        }
        console.log(`
        `)
        console.table(store);


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
            var update = "UPDATE products SET ? WHERE ?"
            var id = answer.purchase;
            var quantity; 
            var stock;
            connection.query(query, {id: id}, function (err, res) {
                quantity = answer.quantity;
                
                stock = res[0].stock_quantity
                if(stock > quantity){
                    stock -= quantity;
                    connection.query(update, [{stock_quantity: stock},{id: id}], function(err, res){
                        console.log("Order Complete!")
                        shop();
                    })
                    
                }else{
                    console.log("insufficient stock.");
                    shop();
                }
                
            });

        });
};