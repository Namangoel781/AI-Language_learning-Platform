const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const updateUserProgress = async (userId, phaseId, lessonId) => {
  const { data, error } = await supabase.from("userprogress").insert({
    user_id: userId,
    phase_id: phaseId,
    lesson_id: lessonId,
  });
  if (error) throw new Error(`Failed to update progress: ${error.message}`);
};

module.exports = {
  updateUserProgress,
};
