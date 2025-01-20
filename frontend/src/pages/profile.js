import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox, Alert, Switch, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Login from "./login";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [datePicked, setDatePicked] = useState(dayjs());
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        about: "",
        email: "",
        experience: "",
        photo: "",
        phoneNumber: "",
        address: "",
        userType: "Apprenant",
        horaires: "",
        price: "",
        location: 10,
        iban: "",
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
                    about: data.about || "",
                    email: data.email || "",
                    experience: data.experience || "",
                    photo: data.photo || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || "",
                    userType: data.userType || "Apprenant",
                    horaires: data.horaires || "",
                    price: data.price || "",
                    location: data.location || 10,
                    iban: data.iban || "",
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
        if (!form.email) validationErrors.push({ field: "email", message: "L'email est requis" });
        if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) validationErrors.push({ field: "phoneNumber", message: "La saisie de votre champ est incorrecte, veuillez la modifier" });
        if (form.userType === "Formateur") {
            if (!form.horaires) validationErrors.push({ field: "horaires", message: "Les horaires sont requis" });
            if (!form.price) validationErrors.push({ field: "price", message: "Le prix est requis" });
            if (form.price && !/^\d+$/.test(form.price)) validationErrors.push({ field: "price", message: "Le prix doit être un nombre entier" });
            if (!form.location) validationErrors.push({ field: "location", message: "Le lieu est requis" });
        }

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
            <form onSubmit={handleSubmit}>
                {/* Champs du formulaire */}
                <div style={{
                    display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between",

                }}>
                    <span style={{ marginRight: 16 }}>Prénom</span>
                    <span>{form.firstName}</span>
                </div>
                <div style={{
                    margin: "16px 0",
                    display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between",
                }}>
                    <span style={{ marginRight: 16 }}>Nom</span>
                    <span>{form.lastName}</span>
                </div>
                <TextField
                    label="A propos"
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    multiline
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
                    multiline
                    error={errors.some((err) => err.field === "experience")}
                    helperText={errors.find((err) => err.field === "experience")?.message}
                />
                <TextField
                    label="Photo"
                    name="photo"
                    value={form.photo}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
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
                        <Switch
                            checked={form.userType === "Formateur"}
                            onChange={(e) => setForm((prevForm) => ({
                                ...prevForm,
                                userType: e.target.checked ? "Formateur" : "Apprenant",
                            }))}
                        />
                    }
                    label={form.userType === "Formateur" ? "Formateur" : "Apprenant"}
                />
                {form.userType === "Formateur" && (
                    /* calendrier */
                    <>
                        <div style={{ margin: "16px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                <span style={{ marginRight: 16 }}>Horaires</span>
                                <span>{form.horaires}</span>
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar value={datePicked} onChange={(newValue) => setDatePicked(newValue)} />
                            </LocalizationProvider>
                            <TextField
                                label="Prix/heure"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                margin="normal"
                                fullWidth
                                error={errors.some((err) => err.field === "price")}
                                helperText={errors.find((err) => err.field === "price")?.message}
                            />
                        </div>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Lieu du cours</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={form.location}
                                label="Lieu du cours"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>A distance</MenuItem>
                                <MenuItem value={20}>Chez le formateur</MenuItem>
                                <MenuItem value={30}>Chez l'apprenant</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="IBAN"
                            name="iban"
                            value={form.iban}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                    </>
                )}

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sauvegarder
                </Button>
            </form>
        </div>
    );
}

export default Profile;
