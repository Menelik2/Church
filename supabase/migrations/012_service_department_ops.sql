-- Extra ops tables for አገልግሎት ክፍሎች

-- Mezmur: approved songs + service assignments (ሰርግ / ንግስ / ጉባኤ)
CREATE TABLE IF NOT EXISTS mezmur_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  occasion TEXT,
  is_approved BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type TEXT NOT NULL
    CHECK (service_type IN ('regular', 'wedding', 'ngus', 'parish', 'other')),
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  title_am TEXT,
  members_count INT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'done', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children age-band activities (ደቂቅ / ማዕከላዊያን)
CREATE TABLE IF NOT EXISTS children_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  band TEXT NOT NULL CHECK (band IN ('deqiq', 'maekelawi')),
  title_am TEXT NOT NULL,
  age_min INT,
  age_max INT,
  facilitator_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES children_groups(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL DEFAULT 'lesson'
    CHECK (activity_type IN ('lesson', 'drama', 'trip', 'other')),
  title_am TEXT NOT NULL,
  activity_date DATE DEFAULT CURRENT_DATE,
  present_count INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Arts (ኪነጥበብ) events / performances
CREATE TABLE IF NOT EXISTS arts_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  event_type TEXT DEFAULT 'performance',
  event_date DATE,
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'rehearsing', 'done', 'cancelled')),
  participants_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mezmur_services_date ON mezmur_services(service_date);
CREATE INDEX IF NOT EXISTS idx_children_act_date ON children_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_arts_events_date ON arts_events(event_date);

ALTER TABLE mezmur_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mezmur_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE children_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE children_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE arts_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_mezmur_songs" ON mezmur_songs FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_mezmur_svc" ON mezmur_services FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_child_g" ON children_groups FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_child_a" ON children_activities FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_arts" ON arts_events FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
