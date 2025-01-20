import React, { useState, useEffect } from "react";
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Box,
    Alert,
} from "@mui/material";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [memory, setMemory] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [requestMessage, setRequestMessage] = useState("");

    useEffect(() => {
        // Si "Remember me" est coché, vérifier s'il existe un utilisateur connecté
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setMemory(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        if (email === "") {
            errors.push("Email is required");
        }
        if (password === "") {
            errors.push("Password is required");
        }
        setErrorMessages(errors);
        if (errors.length > 0) {
            return;
        }

        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 200) {
            const data = await response.json();
            const token = data.token; // Récupérer le token JWT depuis la réponse

            if (memory) {
                // Mémoriser l'email et le token JWT dans localStorage
                localStorage.setItem("email", email);
                localStorage.setItem("token", token); // Stocker le token dans localStorage
            } else {
                // localStorage.removeItem("email");
                // localStorage.removeItem("token"); // Supprimer le token si "Remember me" est décoché
            }

            console.log(data.message);
            // Tu peux rediriger l'utilisateur vers sa page de profil ou d'accueil après une connexion réussie
            window.location.href = "/profile";  // Exemple de redirection vers le profil
        } else {
            const data = await response.json();
            setRequestMessage(data.message);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto" }}>
            <Typography variant="h4">Login</Typography>
            <div>
                <Typography variant="body1">
                    Already have an account? <a href="/register">Register</a>
                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    fullWidth
                    error={errorMessages.includes("Email is required")}
                    helperText={errorMessages.includes("Email is required") && "Veuillez remplir le champ Email"}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    fullWidth
                    error={errorMessages.includes("Password is required")}
                    helperText={errorMessages.includes("Password is required") && "Veuillez remplir le champ Password"}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={memory}
                            onChange={(e) => setMemory(e.target.checked)}
                        />
                    }
                    label="Remember me"
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
            {requestMessage && (
                <Box mt={2}>
                    <Alert severity="error">{requestMessage}</Alert>
                </Box>
            )}
        </div>
    );
}

export default Login;