DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
	id int not null auto_increment,
    primary key (id),
    product_name varchar(60) not null,
    department_name varchar(40) not null,
    price decimal(8,2) not null,
    stock_quantity int default 0
);

insert into products(product_name, department_name, price, stock_quantity)
values('Squatty Potty', 'Toiletry', 15.00, 30);
insert into products(product_name, department_name, price, stock_quantity)
values('Plunger', 'Toiletry', 8.00, 2000);
insert into products(product_name, department_name, price, stock_quantity)
values('Toilet Brush', 'Toiletry', 7.00, 800);
insert into products(product_name, department_name, price, stock_quantity)
values('Urinal Cake', 'Toiletry', 1.00, 3000);
insert into products(product_name, department_name, price, stock_quantity)
values('Bidet', 'Toiletry', 400.00, 30);