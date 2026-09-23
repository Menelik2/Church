-- Elections (አንቀጽ 10)
CREATE TABLE IF NOT EXISTS election_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  term_start DATE NOT NULL,
  term_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'nominating', 'voting', 'completed', 'cancelled')),
  quorum_met BOOLEAN,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS election_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_id UUID NOT NULL REFERENCES election_cycles(id) ON DELETE CASCADE,
  position_key TEXT NOT NULL,
  title_am TEXT NOT NULL,
  UNIQUE(cycle_id, position_key)
);

CREATE TABLE IF NOT EXISTS election_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID NOT NULL REFERENCES election_positions(id) ON DELETE CASCADE,
  servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  full_name_am TEXT NOT NULL,
  consecutive_terms INTEGER DEFAULT 0,
  eligible BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS election_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID NOT NULL REFERENCES election_positions(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES election_candidates(id) ON DELETE CASCADE,
  votes INTEGER DEFAULT 0,
  selected_by_lot BOOLEAN DEFAULT false,
  is_winner BOOLEAN DEFAULT false,
  is_reserve BOOLEAN DEFAULT false,
  UNIQUE(position_id, candidate_id)
);

ALTER TABLE election_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage election_cycles" ON election_cycles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage election_positions" ON election_positions FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage election_candidates" ON election_candidates FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage election_results" ON election_results FOR ALL USING (public.is_admin());
CREATE POLICY "Public read completed cycles" ON election_cycles FOR SELECT USING (status = 'completed');
