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

function start(){

var inventoryUpdate = [];
var addedProduct = [];

connection.connect();
console.log(colors.black.bgWhite.underline('----------------------  Welcome  ------------------------'))
console.log('---------------------------------------------------------')
console.log(colors.black.bgWhite.underline('Available at ---------> Bamazon ---------> PRIME NOW !!'))
console.log('                                                         ')
console.log('------------------ -Manager Portal- ---------------------'.green)
console.log('---------------------------------------------------------')
var managerOptions = {
	properties:{
		mOptions:{
			description: colors.yellow('1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product')
		},
	},
};

prompt.start();
prompt.get(managerOptions, function(err, res){
	if(res.mOptions == 1){
		viewProducts();
	} else if(res.mOptions == 2){
		viewInventory();
	} else if(res.mOptions == 3){
		addInventory();
	} else if(res.mOptions ==4){
		addNewProduct();
	} else {
		console.log('You picked an invalid choice.');
		connection.end();
	}
});

var viewProducts = function(){
	connection.query('SELECT * FROM Products', function(err, res){
		console.log('');
		console.log('Products for Sale'.yellow)
		console.log('');	

		var table = new Table({
			head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['yellow'],
				compact: false,
				colAligns: ['center'],
			}
		});

		for(var i=0; i<res.length; i++){
			table.push(
				[res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
			);
		}

		console.log(table.toString());
		prompt.get(managerOptions, function(err, res){
			if(res.mOptions == 1){
				viewProducts();
			} else if(res.mOptions == 2){
				viewInventory();
			} else if(res.mOptions == 3){
				addInventory();
			} else if(res.mOptions ==4){
				addNewProduct();
			} else {
				console.log('You picked an invalid choice.');
				connection.end();
			}
		});
	})
};


var viewInventory = function(){

	connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, res){
		console.log('');
		console.log('Items With Low Inventory');
		console.log('');

		var table = new Table({
			head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['yellow'],
				compact: false,
				colAligns: ['center'],
			}
		});

		for(var i=0; i<res.length; i++){
			table.push(
				[res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
			);
		}

		console.log(table.toString());
		prompt.get(managerOptions, function(err, res){
			if(res.mOptions == 1){
				viewProducts();
			} else if(res.mOptions == 2){
				viewInventory();
			} else if(res.mOptions == 3){
				addInventory();
			} else if(res.mOptions ==4){
				addNewProduct();
			} else {
				console.log('You picked an invalid choice.');
				connection.end();
			}
		});
	})
};

var addInventory = function(){
	var addInvt = {
		properties:{
			inventoryID: {
				description: colors.green('Please enter the ID of the product you want to add inventory for')
			},
			inventoryAmount:{
				description: colors.green('Please enter the number of items you want to add to the inventory')
			}
		},
	};

	prompt.start();
	prompt.get(addInvt, function(err, res){

		var invtAdded = {
			inventoryAmount: res.inventoryAmount,
			inventoryID: res.inventoryID,
		}

		inventoryUpdate.push(invtAdded);
		connection.query("UPDATE Products SET StockQuantity = (StockQuantity + ?) WHERE ItemID = ?;", [inventoryUpdate[0].inventoryAmount, inventoryUpdate[0].inventoryID], function(err, result){

			if(err) console.log('error '+ err);
			connection.query("SELECT * FROM Products WHERE ItemID = ?", inventoryUpdate[0].inventoryID, function(error, resOne){
				console.log('');
				console.log(colors.yellow.underline('The new updated stock quantity for product (ID: '+inventoryUpdate[0].inventoryID+ ') is ' + resOne[0].StockQuantity));
				console.log('');
				prompt.get(managerOptions, function(err, res){
					if(res.mOptions == 1){
						viewProducts();
					} else if(res.mOptions == 2){
						viewInventory();
					} else if(res.mOptions == 3){
						addInventory();
					} else if(res.mOptions ==4){
						addNewProduct();
					} else {
						console.log('You picked an invalid choice.');
						connection.end();
					}
				});
			})

		})
	})
};


var addNewProduct = function(){
	var newProduct = {
		properties: {
			newIdNum:{ description: colors.gray('Please enter a 5-digit unique product Id')},
			newItemName:{ description: colors.gray('Please enter the name of the product you wish to add')},
			newItemDepartment: { description: colors.gray('Please enter the name of the department the product belongs to')},
			newItemPrice: { description: colors.gray('Please enter the price of the product (format: 00.00)')},
			newStockQuantity: { description: colors.gray('Please enter a stock quantity for this product')},
		}
	}

	prompt.start();
	prompt.get(newProduct, function(err, res){

		var newItem = {
			newIdNum: res.newIdNum,
			newItemName: res. newItemName,
			newItemDepartment: res.newItemDepartment,
			newItemPrice: res.newItemPrice,
			newStockQuantity: res.newStockQuantity,

		};

		addedProduct.push(newItem);
		connection.query('INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?, ?);', [addedProduct[0].newIdNum, addedProduct[0].newItemName, addedProduct[0].newItemDepartment, addedProduct[0].newItemPrice, addedProduct[0].newStockQuantity], function(err, result){

			if(err) console.log('Error: ' + err);

			console.log(colors.yellow.underline(addedProduct[0].newItemName+ ' has been successfully added to the inventory!'));
			console.log(' ');
			console.log('Item id#: ' + addedProduct[0].newIdNum);
			console.log('Item name: ' + addedProduct[0].newItemName);
			console.log('Department: ' + addedProduct[0].newItemDepartment);
			console.log('Price: $' + addedProduct[0].newItemPrice);
			console.log('Stock Quantity: ' + addedProduct[0].newStockQuantity);

			prompt.get(managerOptions, function(err, res){
				if(res.mOptions == 1){
					viewProducts();
				} else if(res.mOptions == 2){
					viewInventory();
				} else if(res.mOptions == 3){
					addInventory();
				} else if(res.mOptions ==4){
					addNewProduct();
				} else {
					console.log('You picked an invalid choice.');
					connection.end();
				}
			});
		})
	})
};
}


start();
