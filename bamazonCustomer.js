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
    console.log("Connected to bamazon DB on port 8889!!\n");
    console.log('|||||| ------------------ Check Out All our Great Products ------------------||||||| \n');
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
            console.log("Item Id Selected: " + userInput.userProdId);
            console.log("Qty requested: " + userInput.userQty);

            checkInventory(userInput);
        }
    )
};//End inquireCustomer();

//=============Start checkInventory()
function checkInventory(orderJSON){
    var productId = orderJSON.userProdId;
    var qtyOrdered = orderJSON.userQty;

    connection.query(
        "SELECT * FROM products WHERE ?",
    {
        item_id: productId
    }, 
    
    function(err, res){

        var availQty = res[0].stock_quantity;
        var productOrdered = res[0].product_name;
        var diffAvailOrd = availQty - qtyOrdered;
        //console.log("New Inventory should be " + diffAvailOrd);
        
        //Check if order can be fulfilled 
        if(diffAvailOrd >= 0){
        console.log("We have " + availQty + " of these " + productOrdered + "s" + ", and you ordered " + qtyOrdered + ".");

        //Execute database update given customer's order can be fulfilled
        decrementInventory(diffAvailOrd, productId);

        } else {
            console.log("Insufficient quantity!");
            console.log("Our apologies, we do not have enough available quatity of these " + productOrdered + "s" + " to fulfill your order.");
            console.log("Please place a different order.");
            queryAll();
        }
    });//End SELECT connection.query()
};//End checkInventory()===================|

//=============Start decrementInventory()
function decrementInventory(newInvAmt, productId){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: newInvAmt
        },{
            item_id: productId
        }],
        function(err,res){
            console.log(res);
            //console.log(res.affectedRows + " products updated!\n");
            console.log("Congratulations! Your order has been submitted!");
            queryAll();
        }//End connection.query() callback fct
    );//End UPDATE connection.query()
};//End decrementInventory()===================|
