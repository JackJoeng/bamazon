var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors');
var Table = require('cli-table');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon', 
});

var newDept = [];


connection.connect();

console.log(colors.black.bgWhite.underline('----------------------  Welcome  ------------------------'))
console.log('---------------------------------------------------------')
console.log(colors.black.bgWhite.underline('Available at ---------> Bamazon ---------> PRIME NOW !!'))
console.log('                                                         ')
console.log('-----------------  -Supervisor Portal-  -----------------'.green)
console.log('---------------------------------------------------------')

var executiveOptions = {
	properties:{
		eOptions:{
			description: colors.yellow('1) View Product Sales by Department 2) Create New Department')
		},
	},
};

prompt.start();

prompt.get(executiveOptions, function(err, res){
	if(res.eOptions == 1){
		viewProductSales();
	} else if(res.eOptions == 2){
		createDepartment();
	} else{
		console.log('You picked an invalid choice!');
		connection.end();
	}
});

var viewProductSales = function(){
	var table = new Table({
		head: ['Department ID', 'Department Name', 'Overhead Cost', 'Total Sales', 'Total Profits'],
		style: {
			head:['yellow'],
			compact: false,
			colAligns: ['center'],
		}
	});
	console.log(' ');
	console.log(colors.black.bgWhite.underline('>>>>>>>>>Product Sales by Department<<<<<<<<<<'));

	connection.query('SELECT DepartmentID, DepartmentName, OverHeadCosts, TotalSales, TotalProfits FROM Departments', function(err, res){
		if(err) console.log('Error: ' + err);

		for(var i = 0; i<res.length; i++){
			table.push(
				[res[i].DepartmentID, res[i].DepartmentName, res[i].OverHeadCosts, res[i].TotalSales, res[i].TotalProfits]
				);
		}

		console.log(' ');
		console.log(table.toString());
		prompt.get(executiveOptions, function(err, res){
			if(res.eOptions == 1){
				viewProductSales();
			} else if(res.eOptions == 2){
				createDepartment();
			} else{
				console.log('You picked an invalid choice!');
				connection.end();
			}
		});
	})
};

var createDepartment = function(){
	var newDepartment = {
		properties: {
			newDeptName:{ description: colors.green('Please enter the name of the new department you would like to add')
			},
			newOverhead:{ description: colors.green('Please enter the overhead costs for this department')
			},
		}
	}

	prompt.start();
	prompt.get(newDepartment, function(err, res){

		var newDeptInfo = {
			deptName: res.newDeptName,
			overHeadNew: res.newOverhead,
			autoTotalSales: 0,
			autoTotalProfits: 0
		};
		newDept.push(newDeptInfo);
		connection.query('INSERT INTO Departments(DepartmentName, OverHeadCosts, TotalSales, TotalProfits) VALUES (?, ?, ?, ?);', [newDept[0].deptName, newDept[0].overHeadNew, newDept[0].autoTotalSales, newDept[0].autoTotalProfits], function(err, res){
			if(err){
				console.log('Error: ' + err);
				connection.end();
			} else {
				console.log('');
				console.log(colors.yellow.underline(newDept[0].deptName + ' has been sucessfully created as a new department!'));
				console.log(' ');
				prompt.get(executiveOptions, function(err, res){
					if(res.eOptions == 1){
						viewProductSales();
					} else if(res.eOptions == 2){
						createDepartment();
					} else{
						console.log('You picked an invalid choice!');
						connection.end();
					}
				});
			}
		})
	})
};