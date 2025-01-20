import React, { useContext, useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { AuthContext } from "../contexts/authContext"; // Importer le contexte

function Header() {
    const { isLoggedIn, userEmail, logout } = useContext(AuthContext); // Utiliser le contexte
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        // Vérifier le token dans localStorage
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleProfilePage = () => {
        window.location.href = "/profile";
    };

    const handleLogout = () => {
        logout(); // Appeler la fonction de déconnexion
        localStorage.removeItem("token"); // Supprimer le token lors de la déconnexion
        window.location.href = "/login"; // Rediriger vers la page de login
    };

    return (
        <AppBar position="static" style={{ marginBottom: "20px", backgroundColor: "#7192ad" }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Split Application
                </Typography>
                {token ? (
                    <div>
                        <Button color="inherit" onClick={handleProfilePage}>
                            {userEmail || "User"}
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Se déconnecter
                        </Button>
                    </div>
                ) : (
                    <Button href="/login">
                        Se connecter
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
