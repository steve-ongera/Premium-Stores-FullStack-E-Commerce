CREATE TYPE discount_type AS ENUM ('percent', 'fixed');

CREATE TABLE IF NOT EXISTS coupons (
  id            SERIAL PRIMARY KEY,
  code          VARCHAR(50) NOT NULL UNIQUE,
  discount_type discount_type NOT NULL DEFAULT 'percent',
  value         NUMERIC(10, 2) NOT NULL CHECK (value > 0),
  min_order     NUMERIC(10, 2) DEFAULT 0,
  max_uses      INTEGER,
  used_count    INTEGER NOT NULL DEFAULT 0,
  expires_at    TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);