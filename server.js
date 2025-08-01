const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Arquivos de persistência
const NAME_FILE = "./names.json";
const MSG_FILE = "./messages.json";

// Lista de nomes engraçados
const funnyNames = [
  "Zé da Manga", "Tonho do Pavê", "Maria Gasolina", "Chico Arroz", "João Sem Freio",
  "Capitão Tapioca", "Ana Banana", "Luquinhas do Grau", "Mestre Cuca Nervoso", "Sargento Pamonha",
  "Betina do Pix", "Dona Encrenca", "Ronaldo Soneca", "Patrícia Confusão", "Vavá do Churras",
  "Naldo do Ônibus", "Creuza do Zap", "Ricardão 2.0", "Tio da Sukita", "Pedro do Pastel",
  "Felícia do Grito", "Gordinho da Lan House", "Zuleica Invertida", "Juju Bala", "Tião Game Over",
  "Marquinho Bugado", "Belinha do Rolezinho", "Cleberson da Kombi", "Pastor Wi-Fi", "Gabi Catástrofe"
];

// Carregar nomes
let nameMap = {};
if (fs.existsSync(NAME_FILE)) {
  try {
    nameMap = JSON.parse(fs.readFileSync(NAME_FILE));
  } catch {
    nameMap = {};
  }
}

// Carregar mensagens
let messages = [];
if (fs.existsSync(MSG_FILE)) {
  try {
    messages = JSON.parse(fs.readFileSync(MSG_FILE));
  } catch {
    messages = [];
  }
}
if (messages.length === 0) {
  messages.push({ name: "anon", text: "Sistema iniciado..." });
}

// Gerador de nome matemático
function generateMathName() {
  const prefix = ["Usuário", "Agente", "Operador", "Cliente", "Visitante"];
  const n = Math.floor(Math.sin(Date.now()) * 9999 + 10000);
  return `${prefix[Math.floor(Math.random() * prefix.length)]}#${Math.abs(n)}`;
}

// Gerador de nome engraçado ou fallback
function generateRandomName() {
  const used = new Set(Object.values(nameMap));
  const available = funnyNames.filter(n => !used.has(n));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return generateMathName();
}

// Salvar arquivos
function saveNameMap() {
  fs.writeFileSync(NAME_FILE, JSON.stringify(nameMap, null, 2));
}
function saveMessages() {
  fs.writeFileSync(MSG_FILE, JSON.stringify(messages.slice(-50), null, 2));
}

// GET mensagens
app.get("/api/chatt", (req, res) => {
  res.json(messages.slice(-50));
});

// POST nova mensagem
app.post("/api/chatt", (req, res) => {
  const { ip, message } = req.body;
  if (!message || !ip) return res.sendStatus(400);

  if (!nameMap[ip]) {
    nameMap[ip] = generateRandomName();
    saveNameMap();
  }

  messages.push({
    name: nameMap[ip],
    text: message
  });

  // Limita a 50 mensagens
  if (messages.length > 50) {
    messages = messages.slice(-50);
  }

  saveMessages();

  res.sendStatus(200);
});

// GET IP fictício
app.get("/api/chat", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0.0.0.0";
  res.json({ ip });
});

app.listen(port, () => {
  console.log(`✅ Backend rodando: http://localhost:${port}`);
});
