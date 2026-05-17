export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  phone TEXT,
  agency TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  agent_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  publication_status TEXT NOT NULL DEFAULT 'unpublished',
  legal_status TEXT NOT NULL DEFAULT 'clear',
  price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  area REAL,
  area_built REAL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spaces INTEGER,
  floor INTEGER,
  year_built INTEGER,
  address TEXT,
  city TEXT,
  zone TEXT,
  latitude REAL,
  longitude REAL,
  is_featured INTEGER NOT NULL DEFAULT 0,
  image_urls TEXT NOT NULL DEFAULT '[]',
  features TEXT NOT NULL DEFAULT '[]',
  published_at TEXT,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_media (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_documents (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  document_type TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_visits (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  agent_id TEXT,
  tenant_id TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  feedback TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_offers (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  agent_id TEXT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  offer_type TEXT NOT NULL DEFAULT 'buy',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_contracts (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  agent_id TEXT,
  contract_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  draft_text TEXT,
  file_url TEXT,
  total_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  start_date TEXT,
  end_date TEXT,
  signed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_matches (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  breakdown TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_sales (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  agent_id TEXT,
  client_id TEXT,
  property_id TEXT,
  sale_type TEXT NOT NULL,
  product_or_service TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BOB',
  payment_method TEXT NOT NULL,
  sale_location TEXT NOT NULL,
  sale_channel TEXT NOT NULL,
  notes TEXT,
  sold_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_properties_tenant ON properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_visits_property ON property_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_client ON property_visits(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_tenant ON property_sales(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sales_agent ON property_sales(agent_id);
CREATE INDEX IF NOT EXISTS idx_matches_client ON property_matches(client_id);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT '',
  agent_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'new',
  operation_type TEXT,
  property_type TEXT,
  budget_min REAL,
  budget_max REAL,
  currency TEXT NOT NULL DEFAULT 'BOB',
  preferred_city TEXT,
  notes TEXT,
  converted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_agent ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
`;
