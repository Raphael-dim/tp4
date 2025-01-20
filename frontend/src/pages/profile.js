import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox, Alert } from "@mui/material";
import Login from "./login";

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        experience: "",
        phoneNumber: "",
        address: "",
        userType: "Apprenant",
    });
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        

        if (!token) {
            // window.location.href = "/login"; // Rediriger si l'utilisateur n'est pas connecté
            return;
        }

        const fetchProfile = async () => {
            const response = await fetch("http://localhost:5000/api/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Ajouter le token dans l'entête Authorization
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setUserProfile(data);
                // Remplir les champs du formulaire avec les données de l'utilisateur
                setForm({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    experience: data.experience || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || "",
                    userType: data.userType || "Apprenant",
                });
            } else {
                // Gérer les erreurs ici (par exemple rediriger si le token est invalide)
                // window.location.href = "/login";
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation du formulaire (exemple)
        const validationErrors = [];
        if (!form.firstName) validationErrors.push({ field: "firstName", message: "Le prénom est requis" });
        if (!form.lastName) validationErrors.push({ field: "lastName", message: "Le nom est requis" });
        if (!form.email) validationErrors.push({ field: "email", message: "L'email est requis" });

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/profile", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        if (response.status === 200) {
            setSuccessMessage("Profil mis à jour avec succès !");
            setErrors([]); // Réinitialiser les erreurs
        } else {
            const errorData = await response.json();
            setErrors([{ message: errorData.message || "Erreur lors de la mise à jour du profil" }]);
        }
    };

    if (!userProfile) {
        return <div>Loading...</div>;
    }

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
