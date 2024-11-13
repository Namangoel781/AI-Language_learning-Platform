// supabase.js
const { createClient } = require("@supabase/supabase-js");

// Replace with your actual Supabase URL and API Key
const SUPABASE_URL = "https://kvjknmlszrsbrhxdvyok.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2amtubWxzenJzYnJoeGR2eW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2ODM5NTEsImV4cCI6MjA0NTI1OTk1MX0.IYNDf1abjurHdfsTYF97EgE1oPDkyzNJnE5yIEnqZvw";

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

module.exports = { supabase };
