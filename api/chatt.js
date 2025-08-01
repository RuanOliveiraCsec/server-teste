let messages = [{ name: "anon", text: "Sistema iniciado..." }];
let nameMap = {};

const funnyNames = [
  "Zé da Manga", "Tonho do Pavê", "Maria Gasolina", "Chico Arroz", "João Sem Freio",
  "Capitão Tapioca", "Ana Banana", "Luquinhas do Grau", "Mestre Cuca Nervoso", "Sargento Pamonha",
  "Betina do Pix", "Dona Encrenca", "Ronaldo Soneca", "Patrícia Confusão", "Vavá do Churras",
  "Naldo do Ônibus", "Creuza do Zap", "Ricardão 2.0", "Tio da Sukita", "Pedro do Pastel",
  "Felícia do Grito", "Gordinho da Lan House", "Zuleica Invertida", "Juju Bala", "Tião Game Over",
  "Marquinho Bugado", "Belinha do Rolezinho", "Cleberson da Kombi", "Pastor Wi-Fi", "Gabi Catástrofe"
];

function generateFallbackName() {
  const prefix = ["Usuário", "Agente", "Operador", "Cliente", "Visitante"];
  const n = Math.floor(Math.random() * 9999);
  return `${prefix[Math.floor(Math.random() * prefix.length)]}#${n}`;
}

function generateRandomName(used) {
  const available = funnyNames.filter(name => !used.has(name));
  return available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : generateFallbackName();
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json(messages.slice(-50));
  }

  if (req.method === "POST") {
    const message = req.body.message;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    if (!ip || !message) return res.status(400).end();

    if (!nameMap[ip]) {
      const used = new Set(Object.values(nameMap));
      nameMap[ip] = generateRandomName(used);
    }

    messages.push({
      name: nameMap[ip],
      text: message
    });

    if (messages.length > 50) messages = messages.slice(-50);

    return res.status(200).end();
  }

  res.status(405).end();
}
