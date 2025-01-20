CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    about TEXT,
    experience TEXT,
    photo VARCHAR(255),
    phoneNumber VARCHAR(255),
    address VARCHAR(255),
    userType VARCHAR(255) NOT NULL,
    horaires VARCHAR(255),
    price VARCHAR(255),
    domaine VARCHAR(255),
    location VARCHAR(255),
    /* location : nombre (10 ou 20 ou 30) */

    iban VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Annonces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domaine VARCHAR(255) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    categorie VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);