CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,  -- snapshot at time of order
  product_image TEXT,
  sku          VARCHAR(100),
  unit_price   NUMERIC(10, 2) NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  total        NUMERIC(10, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED
);

CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);