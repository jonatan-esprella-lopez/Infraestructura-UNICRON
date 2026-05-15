DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'unicron_app') THEN
    CREATE ROLE unicron_app LOGIN PASSWORD 'unicron_app';
  END IF;
END $$;

GRANT CONNECT ON DATABASE unicron TO unicron_app;
