const { createClient } = require("@supabase/supabase-js");
const path = require("path");

// Isso força o carregamento do .env mesmo que o processo inicie de outro lugar
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Log de diagnóstico (Remova depois que funcionar)
console.log("Tentando conectar ao Supabase URL:", supabaseUrl ? "OK" : "VAZIO");

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Erro crítico: SUPABASE_URL ou SUPABASE_KEY não foram encontradas no arquivo .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
