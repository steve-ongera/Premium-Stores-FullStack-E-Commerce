CREATE TABLE IF NOT EXISTS product_images (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  public_id   TEXT,  -- Cloudinary public_id for deletion
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Ensure only one primary image per product
CREATE UNIQUE INDEX idx_product_images_primary
  ON product_images(product_id)
  WHERE is_primary = TRUE;