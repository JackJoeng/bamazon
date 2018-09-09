DROP DATABASE IF EXISTS Bamazon;
CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products(
    ItemID int NOT NULL,
    ProductName VARCHAR(200) NOT NULL,
    DepartmentName VARCHAR(200) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity int NOT NULL,
    primary key(ItemID)
);

select * from Products;

INSERT INTO Products(ItemID,ProductName,DepartmentName,Price,StockQuantity)
VALUES (29878,"What Have You Done","Books & Audible",7.99,200),
    (12456,"Deadpool 2","Movies, Music & Games",4.99,200),
    (78989,"Turbo 64GB USB 3.0 Flash Drive","Electronics, Computers & Office",11.99,500),
    (77878,"Dorel Living Teagan Armless Accent Chair","Home, Garden, Pets & Tools",92.21,20),
    (99923,"Treasure X Legends of Treasure Set","Toys, Kids & Baby",29.99,5),
    (12134,"Men's Long-Sleeve Slub Henley Tee","Clothing, Shoes & Jewelry",25.99,200),
    (65456,"Vega Protein & Greens, Plant Protein Shake","Restaurants, Food & Groce",19.99,100),
    (98972,"Under Armour Undeniable 3.0 Duffle","Sports & Outdoors",64.99,2),
    (12234,"Super Mario Party","Movies, Music & Games",59.99,500),
    (12212,"General Grabber AT2 Radial Tire","Automotive & Industrial",140.91,200);

CREATE TABLE Departments(
    DepartmentID MEDIUMINT AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts DECIMAL(10,2) NOT NULL,
    TotalSales DECIMAL(10,2) NOT NULL,
    TotalProfits DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(DepartmentID));

INSERT INTO Departments(DepartmentName, OverHeadCosts, TotalSales, TotalProfits)
VALUES ('Books & Audible', 50000.00, 15000.00, 200000.00),
    ('Movies, Music & Games', 20000.00, 12000.00, 800000.00),
    ('Electronics, Computers & Office', 30000.00, 15000.00, 200000.00),
    ('Home, Garden, Pets & Tools', 3000.00, 12000.00, 500000.00),
    ('Restaurants, Food & Groce', 1200.00, 15000.00, 60000.00),
    ('Beauty & Health', 40000.00, 12000.00, 788888.00),
    ('Toys, Kids & Baby', 35000.00, 15000.00, 900000.00),
    ('Sports & Outdoors', 35000.00, 15000.00, 10000.00),
    ('Automotive & Industrial', 35000.00, 15000.00, 9888888.00),
    ('Clothing, Shoes & Jewelry', 12000.00, 12000.00, 1200000.00);


