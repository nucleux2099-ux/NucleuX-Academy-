-- NucleuX Academy - ATOM v2: MarketHub Plugin Marketplace
-- Migration: 011_atom_markethub
-- Date: 2026-02-22
-- Spec: docs/specs/ATOM_MARKETHUB_SPEC.md
--
-- This migration sets up:
-- 1. atom_plugins — plugin registry (core + third-party)
-- 2. user_plugins — user installations with per-room activation
-- 3. plugin_reviews — user ratings and reviews
-- 4. plugin_analytics — per-user, per-plugin daily invocation counts
-- 5. RLS policies (published visible, authors manage, users own installs)

-- =====================================================
-- 1. ATOM PLUGINS TABLE (Plugin Registry)
-- =====================================================
-- Stores both core (first-party) and community plugins.
-- Core plugins (is_core=true) ship with ATOM and cannot be uninstalled.
-- Community plugins go through automated + manual review before publishing.

CREATE TABLE IF NOT EXISTS atom_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity (namespace: "nucleux.assessor.v1" or "creator.plugin-name.v1")
  plugin_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,                   -- markdown, shown on detail page
  version TEXT NOT NULL,                   -- semver: "1.0.0"

  -- Author
  author_id UUID REFERENCES profiles(id),
  author_name TEXT NOT NULL,

  -- Classification
  category TEXT NOT NULL CHECK (category IN (
    'evaluation',    -- grading, scoring, assessment
    'generation',    -- question generation, content creation
    'analytics',     -- data interpretation, insights
    'clinical',      -- clinical reasoning, DDx, management
    'exam',          -- exam strategy, pattern recognition
    'notes',         -- note-taking, flashcard creation
    'discussion',    -- debate moderation, fact-checking
    'wellbeing',     -- habit tracking, burnout prevention
    'curriculum',    -- CBME mapping, competency tracking
    'subject',       -- subject-specific deep expertise
    'community'      -- third-party community plugins
  )),

  -- Room activation
  default_rooms TEXT[] NOT NULL,           -- rooms where plugin activates by default
  required_core_agents TEXT[] DEFAULT '{}', -- core agents this plugin depends on
  permissions TEXT[] DEFAULT '{}',         -- declared data access permissions

  -- Plugin logic (Skills-as-Markdown — NOT executable code)
  system_prompt TEXT NOT NULL,             -- injected into ATOM context when active
  skills JSONB NOT NULL DEFAULT '[]',     -- array of PluginSkill objects
  config_schema JSONB DEFAULT '{}',       -- JSON Schema for user-configurable options

  -- Classification flags
  is_core BOOLEAN DEFAULT FALSE,          -- core plugins ship with ATOM, can't be uninstalled
  is_free BOOLEAN DEFAULT TRUE,
  price_cents INTEGER DEFAULT 0,          -- monthly price in cents (0 = free)

  -- Social proof
  install_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- Media
  screenshots TEXT[] DEFAULT '{}',        -- array of image URLs
  changelog JSONB DEFAULT '[]',           -- [{version, date, changes}]

  -- Publishing status
  is_published BOOLEAN DEFAULT FALSE,     -- visible in MarketHub listing
  is_approved BOOLEAN DEFAULT FALSE,      -- passed automated + manual review
  is_deprecated BOOLEAN DEFAULT FALSE,    -- still installed but no longer recommended

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. USER PLUGINS TABLE (Installations)
-- =====================================================
-- Tracks which plugins each user has installed and their per-room config.

CREATE TABLE IF NOT EXISTS user_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plugin_id TEXT NOT NULL REFERENCES atom_plugins(plugin_id) ON DELETE CASCADE,

  -- Activation state
  is_active BOOLEAN DEFAULT TRUE,         -- global toggle (user can disable without uninstalling)
  active_rooms TEXT[],                    -- which rooms this plugin is enabled in (null = default_rooms)

  -- User-specific configuration (validated against plugin's config_schema)
  config JSONB DEFAULT '{}',

  -- Timestamps
  installed_at TIMESTAMPTZ DEFAULT NOW(),

  -- One installation per user per plugin
  UNIQUE(user_id, plugin_id)
);

-- =====================================================
-- 3. PLUGIN REVIEWS TABLE
-- =====================================================
-- User ratings and reviews for plugins.

CREATE TABLE IF NOT EXISTS plugin_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plugin_id TEXT NOT NULL REFERENCES atom_plugins(plugin_id) ON DELETE CASCADE,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per user per plugin
  UNIQUE(user_id, plugin_id)
);

-- =====================================================
-- 4. PLUGIN ANALYTICS TABLE
-- =====================================================
-- Daily aggregated invocation counts per user per plugin.
-- Used for creator dashboard analytics and personalized recommendations.

CREATE TABLE IF NOT EXISTS plugin_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id TEXT NOT NULL REFERENCES atom_plugins(plugin_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Usage data
  room TEXT NOT NULL,                     -- which room the plugin was invoked in
  invocation_count INTEGER DEFAULT 0,
  last_invoked_at TIMESTAMPTZ,

  -- Daily aggregation bucket
  period_start DATE NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One row per plugin × user × day
  UNIQUE(plugin_id, user_id, period_start)
);

-- =====================================================
-- 5. INDEXES
-- =====================================================

-- atom_plugins indexes
CREATE INDEX IF NOT EXISTS idx_plugins_category
  ON atom_plugins (category);

CREATE INDEX IF NOT EXISTS idx_plugins_published
  ON atom_plugins (is_published, is_approved)
  WHERE is_published = TRUE AND is_approved = TRUE;

CREATE INDEX IF NOT EXISTS idx_plugins_popular
  ON atom_plugins (install_count DESC)
  WHERE is_published = TRUE AND is_approved = TRUE;

CREATE INDEX IF NOT EXISTS idx_plugins_rating
  ON atom_plugins (rating DESC)
  WHERE is_published = TRUE AND is_approved = TRUE;

CREATE INDEX IF NOT EXISTS idx_plugins_author
  ON atom_plugins (author_id);

-- user_plugins indexes
CREATE INDEX IF NOT EXISTS idx_user_plugins_user
  ON user_plugins (user_id);

CREATE INDEX IF NOT EXISTS idx_user_plugins_plugin
  ON user_plugins (plugin_id);

-- plugin_reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_plugin
  ON plugin_reviews (plugin_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user
  ON plugin_reviews (user_id);

-- plugin_analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_plugin_period
  ON plugin_analytics (plugin_id, period_start);

CREATE INDEX IF NOT EXISTS idx_analytics_user
  ON plugin_analytics (user_id, period_start);

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Recalculate plugin rating after a review is added/updated/deleted
CREATE OR REPLACE FUNCTION recalculate_plugin_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE atom_plugins
  SET
    rating = COALESCE((
      SELECT ROUND(AVG(r.rating)::NUMERIC, 1)
      FROM plugin_reviews r
      WHERE r.plugin_id = COALESCE(NEW.plugin_id, OLD.plugin_id)
    ), 0),
    review_count = (
      SELECT COUNT(*)
      FROM plugin_reviews r
      WHERE r.plugin_id = COALESCE(NEW.plugin_id, OLD.plugin_id)
    ),
    updated_at = NOW()
  WHERE plugin_id = COALESCE(NEW.plugin_id, OLD.plugin_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_plugin_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON plugin_reviews
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_plugin_rating();

-- Increment install_count when a user installs a plugin
CREATE OR REPLACE FUNCTION update_plugin_install_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE atom_plugins
    SET install_count = install_count + 1, updated_at = NOW()
    WHERE plugin_id = NEW.plugin_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE atom_plugins
    SET install_count = GREATEST(install_count - 1, 0), updated_at = NOW()
    WHERE plugin_id = OLD.plugin_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_install_count_on_user_plugin
  AFTER INSERT OR DELETE ON user_plugins
  FOR EACH ROW
  EXECUTE FUNCTION update_plugin_install_count();

-- =====================================================
-- 7. RLS POLICIES
-- =====================================================

-- atom_plugins: Published + approved visible to all authenticated; authors manage their own
ALTER TABLE atom_plugins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published plugins visible to all"
  ON atom_plugins
  FOR SELECT
  TO authenticated
  USING (
    (is_published = TRUE AND is_approved = TRUE)
    OR author_id = auth.uid()
  );

CREATE POLICY "Authors can insert plugins"
  ON atom_plugins
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own plugins"
  ON atom_plugins
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

-- user_plugins: Users manage their own installations
ALTER TABLE user_plugins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own installations"
  ON user_plugins
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- plugin_reviews: All authenticated users can read reviews; users manage own reviews
ALTER TABLE plugin_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews visible to all"
  ON plugin_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users manage own reviews"
  ON plugin_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own reviews"
  ON plugin_reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own reviews"
  ON plugin_reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- plugin_analytics: Users see own usage data
ALTER TABLE plugin_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own analytics"
  ON plugin_analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role handles analytics writes (from Edge Functions)
-- No INSERT policy for authenticated — analytics are written by backend only

-- =====================================================
-- 8. UPDATED_AT TRIGGERS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_atom_plugins'
  ) THEN
    CREATE TRIGGER set_updated_at_atom_plugins
      BEFORE UPDATE ON atom_plugins
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_plugin_reviews'
  ) THEN
    CREATE TRIGGER set_updated_at_plugin_reviews
      BEFORE UPDATE ON plugin_reviews
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- =====================================================
-- 9. COMMENTS
-- =====================================================

COMMENT ON TABLE atom_plugins IS 'ATOM MarketHub plugin registry. Core (is_core=true) + community plugins. Skills-as-Markdown — no executable code. See docs/specs/ATOM_MARKETHUB_SPEC.md';
COMMENT ON TABLE user_plugins IS 'User plugin installations with per-room activation toggles and user-specific configuration';
COMMENT ON TABLE plugin_reviews IS 'Plugin ratings (1-5) and text reviews. One review per user per plugin. Auto-updates atom_plugins.rating';
COMMENT ON TABLE plugin_analytics IS 'Daily aggregated plugin invocation counts per user. Used for creator dashboard and recommendations';
COMMENT ON COLUMN atom_plugins.system_prompt IS 'Skills-as-Markdown prompt injected into ATOM context when plugin is active. Max 2000 tokens.';
COMMENT ON COLUMN atom_plugins.permissions IS 'Declared data access permissions: read_memory, write_memory, read_analytics, read_progress, read_mcq_history, ui_actions';
COMMENT ON COLUMN atom_plugins.config_schema IS 'JSON Schema defining user-configurable options for this plugin';
COMMENT ON FUNCTION recalculate_plugin_rating IS 'Trigger function: recalculates atom_plugins.rating and review_count after review changes';
COMMENT ON FUNCTION update_plugin_install_count IS 'Trigger function: increments/decrements atom_plugins.install_count on user_plugins insert/delete';
