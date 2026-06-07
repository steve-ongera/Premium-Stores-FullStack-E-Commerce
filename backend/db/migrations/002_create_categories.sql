CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  parent_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  image_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug    ON categories(slug);
CREATE INDEX idx_categories_parent  ON categories(parent_id);