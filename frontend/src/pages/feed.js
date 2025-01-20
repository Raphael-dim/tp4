import React, { useState, useEffect } from "react";
import { TextField, Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchDomain, setSearchDomain] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
        const token = localStorage.getItem("token"); // Récupère le token depuis localStorage
        

        if (!token) {
           
            navigate("/login");
            console.error("Token non trouvé. Veuillez vous connecter.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } else {
                const errorData = await response.json();
                console.error("Erreur : ", errorData.message);
                alert("Erreur lors de la récupération des utilisateurs : " + errorData.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel API :", error);
            alert("Une erreur s'est produite lors de la récupération des utilisateurs.");
        }
    };

    fetchUsers();
}, []);


const handleSearch = () => {
    if (!searchDomain && !searchLocation && !searchName) {
      alert("Veuillez remplir le champs sélectionné"); // Affiche un message d'alerte
      return;
    }
  
    // Créer une copie de la liste des utilisateurs à filtrer
    let filtered = [...users];
  
    if (searchDomain) {
      const lowerDomain = searchDomain.toLowerCase();
      filtered = filtered.filter((user) =>
        user.domaine.toLowerCase().includes(lowerDomain)
      );
    }
  
    if (searchLocation) {
      const lowerCity = searchLocation.toLowerCase();
      filtered = filtered.filter((user) =>
        user.location.toLowerCase().includes(lowerCity) // Correction : utiliser `user.location`
      );
    }
  
    if (searchName) {
      const lowerUser = searchName.toLowerCase();
      filtered = filtered.filter((user) =>
        (user.first_name.toLowerCase() + " " + user.last_name.toLowerCase()).includes(lowerUser)
      );
    }
  
    setFilteredUsers(filtered);
  };
  
  

  const resetFilters = () => {
    setSearchDomain("");
    setSearchLocation("");
    setSearchName("");
    setFilteredUsers(users);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Liste des utilisateurs
      </Typography>

      {/* Barre de recherche */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <TextField
          label="Domaine"
          value={searchDomain}
          onChange={(e) => setSearchDomain(e.target.value)}
          fullWidth
        />
        <TextField
          label="Ville"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          fullWidth
        />
        <TextField
          label="Nom de l'utilisateur"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Rechercher
        </Button>
        <Button variant="outlined" color="secondary" onClick={resetFilters}>
          Réinitialiser
        </Button>
      </Box>

      {/* Liste des utilisateurs */}
        <Grid container spacing={2}>
        {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card>
                <CardContent>
                    <Typography variant="h6">
                    {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="body2">Domaine : {user.domaine}</Typography>
                    <Typography variant="body2">Ville : {user.location}</Typography>
                    <Typography variant="body2">Type : {user.userType}</Typography>
                </CardContent>
                </Card>
            </Grid>
            ))
        ) : (
            <Typography variant="body1" sx={{ textAlign: "center", margin: "20px auto" }}>
            Aucun résultat n’est lié à votre recherche
            </Typography>
        )}
        </Grid>
    </Box>
  );
};

export default Feed;
