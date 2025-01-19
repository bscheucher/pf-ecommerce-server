-- Users table
CREATE TABLE os_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE os_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE os_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Product categories junction table
CREATE TABLE os_product_categories (
    product_id INT NOT NULL REFERENCES os_products(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES os_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Orders table
CREATE TABLE os_orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES os_users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE os_order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES os_orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES os_products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- Addresses table
CREATE TABLE os_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES os_users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20)
);

-- Payment details table
CREATE TABLE os_payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES os_orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE os_reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES os_users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES os_products(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
