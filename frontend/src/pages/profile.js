import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox, Alert } from "@mui/material";

function Profile() {
    // Exemple d'envoi d'une requête pour récupérer le profil de l'utilisateur
    const fetchProfile = async () => {
        const response = await fetch("/api/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Utiliser le token stocké dans localStorage (ou cookie)
            },
            credentials: "include", // Si le token est dans un cookie HttpOnly
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Profile Data:", data);
        } else {
            console.error("Error fetching profile:", data.message);
        }
    };

    // Récupérer les informations de l'utilisateur depuis le localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const [form, setForm] = useState({
        firstName: user ? user.firstName : "",
        lastName: user ? user.lastName : "",
        email: user ? user.email : "",
        experience: user ? user.experience : "",
        phoneNumber: user ? user.phoneNumber : "",
        address: user ? user.address : "",
        userType: user ? user.userType : "Apprenant",
    });

    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!user) {
            // Rediriger si l'utilisateur n'est pas connecté
            window.location.href = "/login";
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = [];

        // Validation des champs
        if (!form.firstName) newErrors.push({ field: "firstName", message: "Veuillez remplir le champ Prénom" });
        if (!form.lastName) newErrors.push({ field: "lastName", message: "Veuillez remplir le champ Nom" });
        if (!form.email) newErrors.push({ field: "email", message: "Veuillez remplir le champ Email" });
        if (!form.experience) newErrors.push({ field: "experience", message: "Veuillez remplir le champ Expérience" });
        if (!form.phoneNumber) newErrors.push({ field: "phoneNumber", message: "Veuillez remplir le champ Numéro de téléphone" });
        if (!form.address) newErrors.push({ field: "address", message: "Veuillez remplir le champ Adresse" });

        setErrors(newErrors);

        if (newErrors.length === 0) {
            // Sauvegarder les nouvelles informations dans localStorage
            localStorage.setItem("user", JSON.stringify(form));
            setSuccessMessage("Les informations ont été mises à jour avec succès !");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "auto" }}>
            <Typography variant="h4" gutterBottom>Mon Profil</Typography>

            {/* Affichage des erreurs */}
            {errors.length > 0 && errors.map((err, index) => (
                <Alert key={index} severity="error">{err.message}</Alert>
            ))}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <form onSubmit={handleSubmit}>
                {/* Champs du formulaire */}
                <TextField
                    label="Prénom"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={errors.some((err) => err.field === "firstName")}
                    helperText={errors.find((err) => err.field === "firstName")?.message}
                />
                <TextField
                    label="Nom"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={errors.some((err) => err.field === "lastName")}
                    helperText={errors.find((err) => err.field === "lastName")?.message}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={errors.some((err) => err.field === "email")}
                    helperText={errors.find((err) => err.field === "email")?.message}
                />
                <TextField
                    label="Expérience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={errors.some((err) => err.field === "experience")}
                    helperText={errors.find((err) => err.field === "experience")?.message}
                />
                <TextField
                    label="Numéro de téléphone"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={errors.some((err) => err.field === "phoneNumber")}
                    helperText={errors.find((err) => err.field === "phoneNumber")?.message}
                />
                <TextField
                    label="Adresse"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={errors.some((err) => err.field === "address")}
                    helperText={errors.find((err) => err.field === "address")?.message}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.userType === "Formateur"}
                            onChange={(e) => setForm({ ...form, userType: e.target.checked ? "Formateur" : "Apprenant" })}
                        />
                    }
                    label="Formateur"
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sauvegarder
                </Button>
            </form>
        </div>
    );
}

export default Profile;
