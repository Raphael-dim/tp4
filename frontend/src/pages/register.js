import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    lastName: "",
    firstName: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    if (!form.email) {
      newErrors.push({ field: "email", message: "Veuillez remplir le champs sélectionné" });
    } else if (!validateEmail(form.email)) {
      newErrors.push({ field: "email", message: "Cette adresse e-mail est non valide. Assurez-vous qu’elle respecte ce format: exemple@email.com" });
    }

    if (!form.password) {
      newErrors.push({ field: "password", message: "Veuillez remplir le champs sélectionné" });
    } else if (form.password.length < 8) {
      newErrors.push({ field: "password", message: "Votre mot de passe doit contenir au minimum 8 caractères" });
    } else if (!validatePassword(form.password)) {
      newErrors.push({ field: "password", message: "Votre mot de passe doit contenir un chiffre, un caractère minuscule, un caractère majuscule et un caractère spécial." });
    }

    if (!form.confirmPassword) {
      newErrors.push({ field: "confirmPassword", message: "Veuillez remplir le champs sélectionné" });
    } else if (form.confirmPassword !== form.password) {
      newErrors.push({ field: "confirmPassword", message: "Les mots de passe ne correspondent pas" });
    }

    if (!form.lastName) {
      newErrors.push({ field: "lastName", message: "Veuillez remplir le champs sélectionné" });
    }

    if (!form.firstName) {
      newErrors.push({ field: "firstName", message: "Veuillez remplir le champs sélectionné" });
    }

    if (!form.acceptTerms) {
      newErrors.push({ field: "acceptTerms", message: "Vous devez accepter les conditions d’utilisation" });
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      let response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        alert("User created");
        // Rediriger vers la page login après l'enregistrement
        window.location.href = "/login"; // Utilisation de window.location.href pour la redirection
      } else {
        setErrorMessages([data.message]);
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <Typography variant="h4">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          margin="normal"
          fullWidth
          error={errors.some((err) => err.field === "email")}
          helperText={errors.find((err) => err.field === "email")?.message}
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          margin="normal"
          fullWidth
          error={errors.some((err) => err.field === "password")}
          helperText={errors.find((err) => err.field === "password")?.message}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          margin="normal"
          fullWidth
          error={errors.some((err) => err.field === "confirmPassword")}
          helperText={errors.find((err) => err.field === "confirmPassword")?.message}
        />
        <TextField
          label="Last Name"
          type="text"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          margin="normal"
          fullWidth
          error={errors.some((err) => err.field === "lastName")}
          helperText={errors.find((err) => err.field === "lastName")?.message}
        />
        <TextField
          label="First Name"
          type="text"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          margin="normal"
          fullWidth
          error={errors.some((err) => err.field === "firstName")}
          helperText={errors.find((err) => err.field === "firstName")?.message}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
            />
          }
          label="I accept the terms and conditions"
        />
        {errors.some((err) => err.field === "acceptTerms") && (
          <Typography color="error" variant="caption">
            {errors.find((err) => err.field === "acceptTerms")?.message}
          </Typography>
        )}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
      </form>
      {errorMessages.map((message, index) => (
        <Alert key={index} severity="error">
          {message}
        </Alert>
      ))}
    </div>
  );
}

export default Register;
