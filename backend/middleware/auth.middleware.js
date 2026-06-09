import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Login required. Run arbor login." });
  }

  try {
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECREAT_KEY);
    req.authUserId = decoded.id.toString();
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Run arbor login again." });
  }
}

export function requireMatchingUser(req, res, next) {
  const { userId } = req.params;
  if (!userId || userId !== req.authUserId) {
    return res.status(403).json({ error: "Not allowed for this user." });
  }
  next();
}
