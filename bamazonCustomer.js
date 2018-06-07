//Import node pkgs
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});//End connection definition

connection.connect(function (err) {
    if (err) throw err;
    //console.log("Connected to bamazon DB on port 8889!!\n");
    console.log('\n|||||| ------------------ Welcome to Bamazon! ------------------||||||| \n');
    console.log('|||||| ------------------ Check Out All our Great Products ------------------||||||| \n');
    queryAll();
});

//Start queryAll()
function queryAll() {

    connection.query('SELECT * FROM products', function (err, res) {
        //Table creation w/out console.table from cTable Package: var results = "Item Id : " + res.item_id + "|" + . . . .
        console.table(res);
        //console.log(res);
        inquireCustomer();
    });

}; //End queryAll();

//Start inquireCustomer();
function inquireCustomer() {
    inquirer.prompt([{
        //Question 1:
        name: 'userProdId',
        type: 'input',
        message: 'What is the Id of the product you want to buy?'
    }, {
        //Question 2:
        name: 'userQty',
        type: 'input',
        message: 'How many of this product would you like to buy?'
    }]).then(
        function (userInput) {
            console.log("||-----------------------------------------------------------||");
            console.log("\n||------- Order Summary:");
            console.log("\n||||------- Item Id Selected: " + userInput.userProdId);
            console.log("\n||||------- Qty requested: " + userInput.userQty + "\n");
            console.log("||-----------------------------------------------------------||");

            checkInventory(userInput);
        }
    ); //End .prompt() callback fct
}; //End inquireCustomer();

//=============Start checkInventory()
function checkInventory(orderJSON) {
    var productId = orderJSON.userProdId;
    var qtyOrdered = orderJSON.userQty;

    connection.query(
        "SELECT * FROM products WHERE ?", 
        {
            item_id: productId
        },
        function (err, res) {
            var productRow = res[0];
            var availQty = productRow .stock_quantity;
            var productOrdered = productRow .product_name;
            var diffAvailOrd = availQty - qtyOrdered;
            //console.log("New Inventory should be " + diffAvailOrd);

            //Check if order can be fulfilled 
            if (diffAvailOrd >= 0) {
                console.log("\n||------- We have " + availQty + " of these " + productOrdered + "s" + ", and you ordered " + qtyOrdered + ".\n");

                //Execute database update given customer's order can be fulfilled
                decrementInventory(diffAvailOrd, productId);

                //Print Receipt After SQL UPDATE
                console.log("\n||------- Congratulations! Your order has been submitted!");
                console.log("\n||------- Customer Receipt:");
                console.table(productRow);

            } else {
                console.log("\n!!-------- Warning: Insufficient available quantity! --------!! \n");
                console.log("||-------- Our apologies, we do not have enough available quantity of these " + productOrdered + "s" + " to fulfill your order.\n");
                console.log("||-------- Please place a different order:\n");
                queryAll();
            }
        }); //End SELECT connection.query()
}; //End checkInventory()===================|

//=============Start decrementInventory()
function decrementInventory(newInvAmt, productId) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: newInvAmt
        }, {
            item_id: productId
        }],
        function (err, res) {
            //console.log(res);
            //console.log(res.affectedRows + " products updated!\n");
            console.log("\n||------- Thanks for Shopping with Bamazon -------||\n");
            console.log("\n||------- Please feel free to explore our store front again and place another order -------||\n");
            queryAll();
        } //End connection.query() callback fct
    ); //End UPDATE connection.query()
}; //End decrementInventory()===================|