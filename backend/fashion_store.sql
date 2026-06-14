-- --------------------------------------------------------
-- ERD Mapping Singkat:
-- --------------------------------------------------------
-- 1. users: Tabel utama untuk pengguna (admin dan customer).
-- 2. products: Tabel master untuk produk fashion.
-- 3. carts: Menyimpan keranjang belanja (1 User memiliki 1 atau banyak Carts).
-- 4. cart_items: Menyimpan produk di dalam keranjang (1 Cart memiliki banyak Cart_Items, terhubung ke Products).
-- 5. orders: Menyimpan data pesanan/checkout (1 User memiliki banyak Orders).
-- 6. order_items: Menyimpan detail produk dari pesanan (1 Order memiliki banyak Order_Items, terhubung ke Products).
-- 7. payments: Menyimpan data pembayaran (1 Order memiliki 1 Payment).
-- 8. reviews: Menyimpan ulasan produk (1 User memberi banyak Reviews, 1 Product memiliki banyak Reviews).
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `fashion_store`;
USE `fashion_store`;

-- 1. Table structure for table `users`
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('admin', 'customer') DEFAULT 'customer',
  `status` ENUM('Active', 'Inactive', 'Banned') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table structure for table `products`
CREATE TABLE `products` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100) DEFAULT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `color` VARCHAR(50) DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table structure for table `carts`
CREATE TABLE `carts` (
  `cart_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table structure for table `cart_items`
CREATE TABLE `cart_items` (
  `cart_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `cart_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`cart_id`) REFERENCES `carts`(`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table structure for table `orders`
CREATE TABLE `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `recipient_name` VARCHAR(150) NOT NULL,
  `recipient_phone` VARCHAR(20) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `subtotal` DECIMAL(12,2),
  `shipping_cost` DECIMAL(12,2),
  `total_amount` DECIMAL(12,2),
  `status` ENUM('Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled') DEFAULT 'Pending',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  `updated_at` TIMESTAMP NULL,
  `tracking_number` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table structure for table `order_items`
CREATE TABLE `order_items` (
  `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price_at_purchase` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table structure for table `payments`
CREATE TABLE `payments` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL UNIQUE,
  `payment_method` VARCHAR(50) NOT NULL,
  `payment_proof` VARCHAR(255) DEFAULT NULL,
  `payment_status` ENUM('Unpaid', 'Paid', 'Failed', 'Refunded') DEFAULT 'Unpaid',
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Table structure for table `reviews`
CREATE TABLE `reviews` (
  `review_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- INSERT SAMPLE DATA
-- --------------------------------------------------------

-- INSERT Users (1 Admin, 2 Customers)
-- Note: passwords are theoretically hashed strings like bcrypt
INSERT INTO `users` (`username`, `email`, `password_hash`, `phone_number`, `role`, `status`) VALUES
('Admin Manager', 'admin@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081298765432', 'admin', 'Active'),
('John Doe', 'user@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', 'customer', 'Active'),
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081298765433', 'customer', 'Active');

-- INSERT Products (5 Fashion Products)
INSERT INTO `products` (`name`, `description`, `category`, `size`, `color`, `image_url`, `price`, `stock`) VALUES
('Classic Denim Jacket', 'Premium denim jacket with classic cut and durable material.', 'Jackets', 'M', 'Blue', '/images/products/denim-jacket.jpg', 450000.00, 50),
('Cotton Basic T-Shirt', 'Comfortable 100% cotton t-shirt for daily wear.', 'T-Shirts', 'L', 'White', '/images/products/white-tshirt.jpg', 120000.00, 150),
('Slim Fit Chino Pants', 'Elegant slim fit chino pants perfect for casual and formal occasions.', 'Pants', '32', 'Khaki', '/images/products/chino-pants.jpg', 350000.00, 80),
('Floral Summer Dress', 'Lightweight floral dress, perfect for summer days.', 'Dresses', 'S', 'Floral', '/images/products/summer-dress.jpg', 250000.00, 40),
('Leather Ankle Boots', 'Genuine leather ankle boots with sturdy heel.', 'Shoes', '40', 'Black', '/images/products/leather-boots.jpg', 850000.00, 20);
