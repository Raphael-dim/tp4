import { Router } from "express";
import DatabaseConnection from "../DatabaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const connection = await DatabaseConnection.getInstance();
  const [user] = await connection.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );

  if (user.length === 0) {
    res.status(401).json({ message: "Email ou mot de passe incorrect, veuillez réessayer" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Email ou mot de passe incorrect, veuillez réessayer" });
    return;
  }

  // Générer le token JWT
  const token = jwt.sign(
    { id: user[0].id, email: user[0].email },  // Payload (données qu'on va encoder)
    "votre_clé_secrète",                      // Clé secrète pour signer le token
    { expiresIn: "1h" }                       // Le token expirera dans 1 heure
  );

  // Répondre avec le token
  res.status(200).json({
    message: "Login successful",
    token: token,  // Retourner le token dans la réponse
  });
});

router.post("/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await DatabaseConnection.getInstance();
  const [user] = await connection.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );

  if (user.length > 0) {
    res.status(409).json({ message: "Votre email existe déjà, veuillez vous connecter" });
    return;
  }

  await connection.query(
    "INSERT INTO Users (email, first_name, last_name, password, userType) VALUES (?, ?, ?, ?, 'Apprenant')",
    [email, firstName, lastName, hashedPassword]
  );

  res.status(201).json({ message: "User created" });
});

// Middleware pour vérifier le token JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Récupérer le token des cookies ou des headers (format Bearer)

  if (!token) {
    return res.status(401).json({ message: "Token d'authentification manquant" });
  }

  // Vérifier la validité du token
  jwt.verify(token, "votre_clé_secrète", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    req.user = user;  // Ajouter les informations de l'utilisateur dans la requête
    next();
  });
};

// Route pour récupérer les informations du profil de l'utilisateur
router.get("/profile", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // ID de l'utilisateur provenant du token

  const connection = await DatabaseConnection.getInstance();
  const [user] = await connection.query("SELECT * FROM Users WHERE id = ?", [userId]);

  if (user.length === 0) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  // Renvoi des informations de l'utilisateur (sans son mot de passe)
  res.status(200).json({
    id: user[0].id,
    email: user[0].email,
    firstName: user[0].first_name,
    lastName: user[0].last_name,
    // Ajouter d'autres champs nécessaires
  });
});

// Route pour éditer les informations du profil de l'utilisateur
router.put("/profile", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // ID de l'utilisateur provenant du token
  const { email, password, about, experience, photo, phoneNumber, address, userType, horaires, price, domaine, location, iban } = req.body;

  const connection = await DatabaseConnection.getInstance();

  // Vérifier si l'email est déjà utilisé par un autre utilisateur
  if (email) {
    const [existingUser] = await connection.query(
      "SELECT * FROM Users WHERE email = ? AND id != ?",
      [email, userId]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Cet email est déjà utilisé par un autre utilisateur." });
    }
  }

  // Préparer les champs à mettre à jour
  const updates = {};
  if (email) updates.email = email;
  if (password) updates.password = await bcrypt.hash(password, 10);
  if (about) updates.about = about;
  if (experience) updates.experience = experience;
  if (photo) updates.photo = photo;
  if (phoneNumber) updates.phoneNumber = phoneNumber;
  if (address) updates.address = address;
  if (userType) updates.userType = userType;
  if (horaires) updates.horaires = horaires;
  if (price) updates.price = price;
  if (domaine) updates.domaine = domaine;
  if (location) updates.location = location;
  if (iban) updates.iban = iban;

  // Construire la requête dynamique en fonction des champs fournis
  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const updateValues = Object.values(updates);

  if (updateFields) {
    await connection.query(
      `UPDATE Users SET ${updateFields} WHERE id = ?`,
      [...updateValues, userId]
    );
  }

  res.status(200).json({ message: "Profil mis à jour avec succès" });
});

router.get("/users", authenticateJWT, async (req, res) => {
  const connection = await DatabaseConnection.getInstance();

  try {
    const [users] = await connection.query(
      "SELECT id, email, first_name, last_name, userType, domaine, location FROM Users"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

router.delete("/profile", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // ID de l'utilisateur provenant du token

  const connection = await DatabaseConnection.getInstance();

  try {
    const [user] = await connection.query("SELECT * FROM Users WHERE id = ?", [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await connection.query("DELETE FROM Users WHERE id = ?", [userId]);

    res.status(200).json({ message: "Profil supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du profil :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});



export default router;
