DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_qunatity INT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ('Authentic Standard Widget', 'Widgets', 19.95, 999);

SELECT * FROM products;