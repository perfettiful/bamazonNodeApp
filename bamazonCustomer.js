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
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to bamazon DB on port 8889!!");

    console.log('Here are all our products: ');
    queryAll();
});

//Start queryAll()
function queryAll(){
    
    connection.query('SELECT * FROM products', function (err, res) {
        //Table creation w/out console.table from cTable Package: var results = "Item Id : " + res.item_id + "|" + . . . .
        console.table(res);
        //console.log(res);
        inquireCustomer();
    } );

  };//End queryAll();

//Start inquireCustomer();
function inquireCustomer(){
    inquirer.prompt([{
        //Question 1:
        name: 'userProdId',
        type: 'input',
        message: 'What is the Id of the product you want to buy?'
    },{
        //Question 2:
        name: 'userQty',
        type: 'input',
        message: 'How many of this product would you like to buy?'
    }]).then(
        function(userInput){
            console.log("Item Selected: " + userInput.userProdId);
            console.log("Qty requested: " + userInput.userQty);

            checkInventory(userInput);
        }
    )
};//End inquireCustomer();

//Start checkInventory()
function checkInventory(orderJSON){
    var productId = orderJSON.userProdId;
    var qtyOrdered = orderJSON.userQty;

    connection.query("SELECT * FROM products WHERE ?",{

        item_id: productId
    }, function(err, res){
        console.table(res);
    });



};//End checkInventory()