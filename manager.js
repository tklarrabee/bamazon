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
function table(res){
    var store = [];
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

}
function forSale(){
    
    connection.query("SELECT * FROM products", function (err, res) {
        table(res);
        shop();
    });
}

function lowStock(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res){
        table(res);
        shop();
    });
}

function addThing(){
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: "Product Name: "
    },{
        name: "department_name",
        type: "input",
        message: "Department Name: "
    },{
        name: "price",
        type: "input",
        message: "Price: ",
        validate: function (input) {
            if (isNaN(input) === true) {
                console.log(`
                please insert a number`)
                return false;
            } return true
        }
    },{
        name: "stock_quantity",
        type: "input",
        message: "Stock Quantity: ",
        validate: function (input) {
            if (isNaN(input) === true) {
                console.log(`
                please insert a number`)
                return false;
            } return true
        }
    }]).then(function(answer){
        query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ( ? , ? , ? , ?)"
        connection.query(query, [answer.product_name, answer.department_name, answer.price, answer.stock_quantity], function(err, res){
            console.log("Product Successfully added");
            shop();
        });
    });

}

function moreStuff(){
    connection.query("SELECT * FROM products", function (err, res) {
        table(res);

        inquirer.prompt([{
            name: "product_select",
            type: "input",
            message: "Enter Product Id"
        },{
            name: "additional",
            type: "input",
            message: "Enter Additional Amount",
            validate: function (input) {
                if (isNaN(input) === true) {
                    console.log(`
                    please insert a number`)
                    return false;
                } return true
            }
        }]).then(function (answer) {
            var id = answer.product_select;
            var stock = answer.additional;
                var query = "UPDATE products SET ? WHERE ?"
                connection.query(query, [{product_stock: answer.additional},{}])
        });
    });

}

function shop() {

    
    inquirer.prompt([{
        name: "menu",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (answer) {
        
        switch(answer.menu){
            case "View Products for Sale": 
            forSale();
            break;

            case "View Low Inventory":
            lowStock();
            break;

            case "Add New Product":
            addThing();
            break;

            case "Add to Inventory":
            moreStuff();
            break;
        }
        
        
        // inquirer.prompt([{
        //     name: "purchase",
        //     type: "input",
        //     message: "Enter the id number of the product you wish to purchase.",
        //     validate: function (input) {
        //         if (isNaN(input) === true) {
        //             console.log(`
        //             please insert a number`)
        //             return false;
        //         }return true;
        //     }
        // },
        //     {
        //         name: "quantity",
        //         type: "input",
        //         message: "Enter desired quantity.",
        //         validate: function (input) {
        //             if (isNaN(input) === true) {
        //                 console.log(`
        //             please insert a number`)
        //                 return false;
        //             } return true
        //         }
        //     }])
            
            // var query = "SELECT product_name, stock_quantity FROM products WHERE ?"
            // var update = "UPDATE products SET ? WHERE ?"
            // var id = answer.purchase;
            // var quantity; 
            // var stock;
            // connection.query(query, {id: id}, function (err, res) {
            //     quantity = answer.quantity;
                
            //     stock = res[0].stock_quantity
            //     if(stock > quantity){
            //         stock -= quantity;
            //         connection.query(update, [{stock_quantity: stock},{id: id}], function(err, res){
            //             console.log("Order Complete!")
            //             shop();
            //         })
                    
            //     }else{
            //         console.log("insufficient stock.");
            //         shop();
            //     }
                
            // });

        });
};