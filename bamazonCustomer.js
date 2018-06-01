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
        //var results = "Item Id : " + res.item_id + "|"
        console.table(res);
        inquireCustomer();
    } );

  };//End queryAll();

//Start inquireCustomer();
function inquireCustomer(){

    inquirer.prompt({

        //Question 1:
        name: 'userProdId',
        type: 'input',
        message: 'What is the Id of the product you want to buy?'
    }).then(
        function(userInput){

            console.log(userInput.userProdId);
        }
    )
};//End inquireCustomer();