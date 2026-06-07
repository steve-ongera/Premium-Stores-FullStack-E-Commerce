CREATE TYPE payment_provider AS ENUM ('stripe', 'mpesa', 'paypal', 'manual');

CREATE TABLE IF NOT EXISTS payments (
  id             SERIAL PRIMARY KEY,
  order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider       payment_provider NOT NULL DEFAULT 'stripe',
  status         payment_status NOT NULL DEFAULT 'unpaid',
  amount         NUMERIC(10, 2) NOT NULL,
  currency       VARCHAR(3) NOT NULL DEFAULT 'USD',
  transaction_id VARCHAR(255),
  provider_data  JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order       ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();