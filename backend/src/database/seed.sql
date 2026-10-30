-- ============================================================================
-- Entre Nous - Initial Data Seeding
-- ============================================================================
-- This script seeds initial categories and challenges.
-- Run AFTER entre_nous.sql
-- ============================================================================

-- ============================================================================
-- SEED: CHALLENGE CATEGORIES
-- ============================================================================

INSERT INTO "ChallengeCategory" ("id", "name", "description", "emoji", "color", "active") VALUES
  ('cat_social', 'Social', 'Questions about relationships and social interactions', '👥', '#3B82F6', true),
  ('cat_personal', 'Personal', 'Questions about personal dreams, values, and experiences', '🎯', '#8B5CF6', true),
  ('cat_fun', 'Fun', 'Lighthearted and playful questions', '😄', '#F59E0B', true),
  ('cat_deep', 'Deep', 'Profound and thought-provoking questions', '🤔', '#10B981', true),
  ('cat_creative', 'Creative', 'Imaginative and creative challenges', '🎨', '#EC4899', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: CHALLENGES - Social Category
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_s001', 'open_question', 'What quality do you value most in a friend?', 'cat_social', 'easy', true),
  ('ch_s002', 'open_question', 'Describe a time when someone helped you when you needed it most.', 'cat_social', 'medium', true),
  ('ch_s003', 'open_question', 'How do you typically handle disagreements with people close to you?', 'cat_social', 'hard', true),
  ('ch_s004', 'quick', 'Introvert or extrovert? Why?', 'cat_social', 'easy', true),
  ('ch_s005', 'creative', 'Create a funny story about an awkward social situation.', 'cat_social', 'medium', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: CHALLENGES - Personal Category
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_p001', 'open_question', 'What is your biggest dream?', 'cat_personal', 'easy', true),
  ('ch_p002', 'open_question', 'What accomplishment are you most proud of?', 'cat_personal', 'easy', true),
  ('ch_p003', 'mirror', 'What do you think is my biggest strength?', 'cat_personal', 'medium', true),
  ('ch_p004', 'open_question', 'What scares you most about the future?', 'cat_personal', 'hard', true),
  ('ch_p005', 'choice', 'If you could change one thing about yourself, what would it be?', 'cat_personal', 'medium', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: CHALLENGES - Fun Category
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_f001', 'quick', 'Cats or dogs?', 'cat_fun', 'easy', true),
  ('ch_f002', 'creative', 'Describe your ideal vacation in 3 sentences.', 'cat_fun', 'easy', true),
  ('ch_f003', 'open_question', 'What is your guilty pleasure?', 'cat_fun', 'easy', true),
  ('ch_f004', 'quick', 'If you were a superpower, which one would you be?', 'cat_fun', 'easy', true),
  ('ch_f005', 'creative', 'Invent a new holiday and explain it.', 'cat_fun', 'medium', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: CHALLENGES - Deep Category
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_d001', 'open_question', 'What does happiness mean to you?', 'cat_deep', 'hard', true),
  ('ch_d002', 'open_question', 'How do you define success?', 'cat_deep', 'hard', true),
  ('ch_d003', 'mirror', 'What do you think I value most in life?', 'cat_deep', 'hard', true),
  ('ch_d004', 'open_question', 'What lesson did a failure teach you?', 'cat_deep', 'hard', true),
  ('ch_d005', 'open_question', 'How has this pandemic changed your perspective on life?', 'cat_deep', 'hard', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: CHALLENGES - Creative Category
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_c001', 'creative', 'Tell a story using exactly 5 words.', 'cat_creative', 'medium', true),
  ('ch_c002', 'creative', 'Create a character and describe them in 3 sentences.', 'cat_creative', 'medium', true),
  ('ch_c003', 'creative', 'Imagine a world where gravity doesn''t exist. Describe it.', 'cat_creative', 'hard', true),
  ('ch_c004', 'creative', 'Write a poem about your favorite place.', 'cat_creative', 'hard', true),
  ('ch_c005', 'creative', 'Describe a color without using color names.', 'cat_creative', 'medium', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: MORE CHALLENGES (Variety)
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_s006', 'open_question', 'What is the best advice someone has given you?', 'cat_social', 'medium', true),
  ('ch_p006', 'open_question', 'What skill would you love to learn?', 'cat_personal', 'easy', true),
  ('ch_f006', 'quick', 'Coffee or tea?', 'cat_fun', 'easy', true),
  ('ch_d006', 'open_question', 'What motivates you to keep going?', 'cat_deep', 'hard', true),
  ('ch_c006', 'creative', 'Invent a new food dish and name it.', 'cat_creative', 'easy', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: FINAL ADDITIONAL CHALLENGES
-- ============================================================================

INSERT INTO "Challenge" ("id", "type", "prompt", "categoryId", "difficulty", "active") VALUES
  ('ch_s007', 'mirror', 'What do you think I would do in my free time?', 'cat_social', 'medium', true),
  ('ch_p007', 'open_question', 'Who had the biggest influence on who you are today?', 'cat_personal', 'hard', true),
  ('ch_f007', 'creative', 'Create a funny dialogue between two objects in this room.', 'cat_fun', 'medium', true),
  ('ch_d007', 'open_question', 'How do you want to be remembered?', 'cat_deep', 'hard', true),
  ('ch_c007', 'creative', 'Describe an emotion as if it were a weather pattern.', 'cat_creative', 'medium', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CONFIRM SEED COMPLETION
-- ============================================================================

-- Count seeded data
SELECT 'Challenge Categories:' as "Status", COUNT(*) as "Count" FROM "ChallengeCategory"
UNION ALL
SELECT 'Challenges:', COUNT(*) FROM "Challenge"
ORDER BY "Count" DESC;

-- ============================================================================
-- END OF SEEDING
-- ============================================================================
