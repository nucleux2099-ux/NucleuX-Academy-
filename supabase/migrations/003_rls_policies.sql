-- NucleuX Academy - RLS Policies
-- Migration: 003_rls_policies
-- Date: 2026-02-07

-- =====================================================
-- PROFILES
-- =====================================================
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- USER PREFERENCES
-- =====================================================
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STREAKS
-- =====================================================
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- ATOMS (public read)
-- =====================================================
CREATE POLICY "Published atoms are viewable" ON atoms FOR SELECT USING (is_published = true);

-- =====================================================
-- ATOM CITATIONS (public read)
-- =====================================================
CREATE POLICY "Atom citations are viewable" ON atom_citations FOR SELECT USING (true);

-- =====================================================
-- ATOM CONNECTIONS (public read)
-- =====================================================
CREATE POLICY "Atom connections are viewable" ON atom_connections FOR SELECT USING (true);

-- =====================================================
-- USER ATOM PROGRESS
-- =====================================================
CREATE POLICY "Users can manage own progress" ON user_atom_progress FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- STUDY SESSIONS
-- =====================================================
CREATE POLICY "Users can manage own sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- DAILY STATS
-- =====================================================
CREATE POLICY "Users can manage own stats" ON daily_stats FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PATHWAYS (public read)
-- =====================================================
CREATE POLICY "Pathways are viewable" ON pathways FOR SELECT USING (true);

-- =====================================================
-- PATHWAY TOPICS (public read)
-- =====================================================
CREATE POLICY "Pathway topics are viewable" ON pathway_topics FOR SELECT USING (true);

-- =====================================================
-- USER PATHWAYS
-- =====================================================
CREATE POLICY "Users can manage own pathways" ON user_pathways FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- MCQs (public read)
-- =====================================================
CREATE POLICY "Published MCQs are viewable" ON mcqs FOR SELECT USING (is_published = true);

-- =====================================================
-- MCQ OPTIONS (public read)
-- =====================================================
CREATE POLICY "MCQ options are viewable" ON mcq_options FOR SELECT USING (true);

-- =====================================================
-- MCQ ATTEMPTS
-- =====================================================
CREATE POLICY "Users can manage own attempts" ON mcq_attempts FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- USER NOTES
-- =====================================================
CREATE POLICY "Users can manage own notes" ON user_notes FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- DISCUSSIONS (public read, auth write)
-- =====================================================
CREATE POLICY "Discussions are viewable" ON discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own discussions" ON discussions FOR UPDATE USING (auth.uid() = author_id);

-- =====================================================
-- COMMENTS (public read, auth write)
-- =====================================================
CREATE POLICY "Comments are viewable" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);

-- =====================================================
-- ATOM INTERACTIONS
-- =====================================================
CREATE POLICY "Users can manage own interactions" ON atom_interactions FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- ATOM RECOMMENDATIONS
-- =====================================================
CREATE POLICY "Users can view own recommendations" ON atom_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can dismiss own recommendations" ON atom_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- DONE!
-- =====================================================
