export default function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "0.0.0.0";
  res.status(200).json({ ip });
}
