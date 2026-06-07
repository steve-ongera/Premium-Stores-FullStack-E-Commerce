CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_price   NUMERIC(10, 2) CHECK (compare_price >= 0),
  cost_price      NUMERIC(10, 2),
  sku             VARCHAR(100) UNIQUE,
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id     INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  weight          NUMERIC(8, 2),
  tags            TEXT[],
  search_vector   TSVECTOR,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug        ON products(slug);
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_is_active   ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price       ON products(price);
CREATE INDEX idx_products_stock       ON products(stock);
CREATE INDEX idx_products_search      ON products USING GIN(search_vector);

-- Auto-update updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update search vector on insert/update
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();