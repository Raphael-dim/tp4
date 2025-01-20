import { Router } from "express";
import DatabaseConnection from "../DatabaseConnection.js";

const router = Router();

// Route pour créer une nouvelle annonce
router.post("/annonce/create", async (req, res) => {
    const { domaine, ville, categorie } = req.body;

    if (!domaine) {
        return res.status(400).json({ message: "Le champ 'domaine' est obligatoire." });
    }

    const connection = await DatabaseConnection.getInstance();

    try {
        await connection.query(
            "INSERT INTO Annonces (domaine, ville, categorie) VALUES (?, ?, ?)",
            [domaine, ville || null, categorie || null]
        );
        res.status(201).json({ message: "Annonce créée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la création de l'annonce :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'annonce." });
    }
});

// Route pour rechercher des annonces
router.get("/annonce/search", async (req, res) => {
    const { domaine, ville, categorie } = req.query;

    if (!domaine) {
        return res.status(400).json({ message: "Veuillez remplir le champs domaine" });
    }

    const connection = await DatabaseConnection.getInstance();

    try {
        let query = "SELECT * FROM Annonces WHERE domaine = ?";
        const params = [domaine];

        if (ville) {
            query += " AND ville = ?";
            params.push(ville);
        }
        if (categorie) {
            query += " AND categorie = ?";
            params.push(categorie);
        }

        const [results] = await connection.query(query, params);
        if(results.length == 0){
            res.status(500).json({ message: "Aucun résultat" });
        } else{
            res.status(200).json(results);
        }
        
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: "Erreur lors de la recherche d'annonces." });
    }
});

// Middleware pour valider l'existence d'une annonce par ID
const validateAnnonceExists = async (req, res, next) => {
    const { id } = req.params;

    const connection = await DatabaseConnection.getInstance();
    const [results] = await connection.query("SELECT * FROM Annonces WHERE id = ?", [id]);

    if (results.length === 0) {
        return res.status(404).json({ message: "Annonce non trouvée." });
    }

    req.annonce = results[0]; // Stocker l'annonce trouvée dans `req`
    next();
};

// Route pour récupérer une annonce par ID
router.get("/annonce/:id", validateAnnonceExists, (req, res) => {
    res.status(200).json(req.annonce);
});

// Route pour supprimer une annonce par ID
router.delete("/annonce/:id", validateAnnonceExists, async (req, res) => {
    const { id } = req.params;

    const connection = await DatabaseConnection.getInstance();

    try {
        await connection.query("DELETE FROM Annonces WHERE id = ?", [id]);
        res.status(200).json({ message: "Annonce supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'annonce." });
    }
});

export default router;
