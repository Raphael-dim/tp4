import React, { useState } from "react";

const Annonce = () => {
  const [formData, setFormData] = useState({
    domaine: "",
    ville: "",
    categorie: "",
  });

  const [errors, setErrors] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.domaine.trim()) {
      newErrors.domaine = "Veuillez remplir le champs domaine";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const queryParams = new URLSearchParams(formData);
      const response = await fetch(`http://localhost:5000/api/annonce/search?${queryParams}`, { method: "GET" });

      if (response.ok) {
        const data = await response.json();
        setResults(data.length > 0 ? data : []);
      } else {
        const errorData = await response.json();
        setResults([]);
        setErrors({ apiError: errorData.message });
      }
    } catch (error) {
      setErrors({ apiError: "Erreur lors de la requête. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recherche Avancée</h1>
      <form onSubmit={handleSubmit}>
        {/* Domaine */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="domaine">Domaine <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            id="domaine"
            name="domaine"
            value={formData.domaine}
            onChange={handleChange}
            placeholder="Exemple : Anglais"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
          {errors.domaine && <p style={{ color: "red" }}>{errors.domaine}</p>}
        </div>

        {/* Ville */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="ville">Ville</label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            placeholder="Exemple : Paris"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        {/* Catégorie */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="categorie">Catégorie</label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            <option value="">-- Sélectionnez une catégorie --</option>
            <option value="Design">Design</option>
            <option value="Développement">Développement</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Recherche en cours..." : "Rechercher"}
        </button>
      </form>

      {/* Affichage des résultats */}
      <div style={{ marginTop: "30px" }}>
        <h2>Résultats</h2>
        {errors.apiError && <p style={{ color: "red" }}>{errors.apiError}</p>}
        {results.length > 0 ? (
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Domaine : {result.domaine}, Ville : {result.ville || "N/A"}, Catégorie : {result.categorie || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>Aucun résultat</p>
        )}
      </div>
    </div>
  );
};

export default Annonce;
