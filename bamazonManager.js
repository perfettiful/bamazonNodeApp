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
    console.log('|||||| ------------------ Manage All Your Great Products ------------------||||||| \n');
    //queryAll();
});