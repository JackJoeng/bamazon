var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon', 
});

connection.connect();

function start(){
	var productPurchased = [];
connection.query('SELECT ItemID, ProductName, DepartmentName, Price, StockQuantity FROM Products', function(err, result){
	if(err) console.log(err);
	console.log(colors.black.bgWhite.underline('----------------------  Welcome  ------------------------'))
	console.log('---------------------------------------------------------')
	console.log(colors.black.bgWhite.underline('Available at ---------> Bamazon ---------> PRIME NOW !!'))
	console.log('                                                         ')
	console.log('------------------- -Customer Portal- -------------------'.green)
	console.log('---------------------------------------------------------')

	var table = new Table({
		head: ['Item Id#', 'Department','Product','Price($)','Stock'],
		style: {
			head: ['yellow'],
			compact: false,
			colAligns: ['center'],
		}
	});

	for(var i = 0; i < result.length; i++){
		table.push(
			[result[i].ItemID, result[i].DepartmentName, result[i].ProductName, result[i].Price + '$', result[i].StockQuantity]
		);
	}
	
	console.log(table.toString());

	purchase();
});

var purchase = function(){
	var productInfo = {
		properties: {
			itemID:{description: colors.yellow('Please enter the product ID')},
			Quantity:{description: colors.green('Please enter the quantity you would like to purchase')}
		},
	};

	prompt.start();
	prompt.get(productInfo, function(err, result){

		var custPurchase = {
			itemID: result.itemID,
			Quantity: result.Quantity
		};
		
		productPurchased.push(custPurchase);

		connection.query('SELECT * FROM Products WHERE ItemID=?', productPurchased[0].itemID, function(err, result){
				if(err) console.log(err, 'That item ID doesn\'t exist');
				if(result[0].StockQuantity < productPurchased[0].Quantity){
					console.log('Sorry, there is not enough in stock!');
					reprompt();
				} else if(result[0].StockQuantity >= productPurchased[0].Quantity){
					console.log('');
					console.log(productPurchased[0].Quantity + ' items purchased');
					console.log(result[0].ProductName + ' ' + result[0].Price);
					var saleTotal = result[0].Price * productPurchased[0].Quantity;

					connection.query("UPDATE Departments SET TotalSales = ? WHERE DepartmentName = ?;", [saleTotal, result[0].DepartmentName], function(err, resultOne){
						if(err) console.log('error: ' + err);
						return resultOne;
					})

					console.log('Total: $' + saleTotal);
					newQuantity = result[0].StockQuantity - productPurchased[0].Quantity;
					connection.query("UPDATE Products SET StockQuantity = " + newQuantity +" WHERE ItemID = " + productPurchased[0].itemID, function(err, result){
						console.log('');
						console.log(colors.cyan.underline('Your order has been successfully processed! We will notify you when it is shipped. Thank you for shopping with us!'));
						console.log('');
						reprompt();	
					})
				};
		})
	})
};
}

function reprompt(){
	inquirer.prompt([{
	  type: "confirm",
	  name: "reply",
	  message: "Would you like to purchase another item?"
	}]).then(function(ans){
	  if(ans.reply){
		start();
	  } else{
		console.log("Thank you for shopping with us! See you soon!");
		connection.end();
	  }
	});
  }

start();

