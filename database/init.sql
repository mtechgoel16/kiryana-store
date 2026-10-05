CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(64) UNIQUE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    hindi_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    is_loose BOOLEAN DEFAULT FALSE,
    base_unit VARCHAR(20) NOT NULL,
    reorder_threshold NUMERIC(10, 2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_batches (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    cost_price NUMERIC(10, 2) NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE,
    inward_date DATE NOT NULL DEFAULT CURRENT_DATE,
    initial_quantity NUMERIC(10, 2) NOT NULL,
    current_stock NUMERIC(10, 2) NOT NULL,
    is_short_shelf_life BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    order_type VARCHAR(30) DEFAULT 'ONLINE_DELIVERY',
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PAID',
    order_status VARCHAR(30) DEFAULT 'CONFIRMED',
    confirmation_checked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    batch_id INT REFERENCES product_batches(id),
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    sold_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS store_reviews (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    customer_name VARCHAR(100),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (id, barcode, sku, name, hindi_name, category, is_loose, base_unit, reorder_threshold)
VALUES 
(1, NULL, 'KRN-SUG-01', 'Madhur Pure Sugar', 'चीनी', 'Grains & Staples', TRUE, 'kg', 25.00),
(2, '8901719101012', 'KRN-PAR-01', 'Parle-G Glucose Biscuit 100g', 'पारले-जी बिस्कुट', 'Snacks', FALSE, 'packet', 20.00),
(3, '8901234567890', 'KRN-BRD-01', 'Harvest Gold White Bread 400g', 'सफेद ब्रेड', 'Daily Fresh', FALSE, 'packet', 10.00),
(4, '8901030383733', 'KRN-ATT-01', 'Aashirvaad Shudh Chakki Atta 10kg', 'आशीर्वाद आटा', 'Grains & Staples', FALSE, 'packet', 8.00),
(5, NULL, 'KRN-RIC-01', 'Kolam Raw Rice (Loose)', 'कोलम चावल', 'Grains & Staples', TRUE, 'kg', 30.00),
(6, '8902088010111', 'KRN-MLK-01', 'Amul Taaza Toned Milk 500ml', 'अमूल ताजा दूध', 'Daily Fresh', FALSE, 'packet', 15.00),
(7, '8901058852332', 'KRN-MAG-01', 'Maggi 2-Minute Masala Noodles 70g', 'मैगी नूडल्स', 'Snacks', FALSE, 'packet', 40.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_batches (product_id, batch_number, mrp, selling_price, cost_price, inward_date, expiry_date, initial_quantity, current_stock, is_short_shelf_life)
VALUES 
(1, 'LOT-SUG-2025A', 48.00, 44.00, 38.00, CURRENT_DATE - INTERVAL '15 days', NULL, 200.00, 12.00, FALSE),
(2, 'PG-DEC24', 10.00, 10.00, 8.00, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '35 days', 100.00, 45.00, FALSE),
(3, 'BRD-WEEK11', 40.00, 40.00, 32.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 30.00, 14.00, TRUE),
(4, 'ASH-FEB25', 440.00, 410.00, 370.00, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '120 days', 40.00, 32.00, FALSE),
(5, 'RIC-OLD-2024', 55.00, 50.00, 42.00, CURRENT_DATE - INTERVAL '400 days', NULL, 500.00, 190.00, FALSE),
(6, 'MLK-DAY2', 28.00, 28.00, 24.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 50.00, 22.00, TRUE),
(7, 'MAG-MAR25', 14.00, 14.00, 11.50, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '180 days', 120.00, 95.00, FALSE);
