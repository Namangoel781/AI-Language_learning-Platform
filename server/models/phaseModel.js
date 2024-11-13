const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const getPhases = async () => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("lesson_order");

  if (error) throw new Error(error.message);
  return data;
};

const getLessonsByPhase = async (phaseId) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("phase_id", phaseId)
    .order("lesson_order");

  if (error) throw new Error(error.message);
  return data;
};

module.exports = {
  getLessonsByPhase,
  getPhases,
};
