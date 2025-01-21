# Projet Split

## Cadre du projet
Ce projet a été réalisé dans le cadre de la matière **Validation de logiciels** de la deuxième année à l'IMT Mines Alès.

## Description
Split est une application de partage de compétences et d'expériences dans le domaine du digital, reposant sur la méthode du "reverse mentoring". Elle permet à des utilisateurs nouveaux dans un secteur professionnel de se faire accompagner par un mentor plus expérimenté, à la fois pour des formations à bas coût et pour la possibilité de rémunérer ou être rémunéré en fonction des services rendus.

## Fonctionnalités principales
- **Connexion manuelle** : Authentification via formulaire avec email et mot de passe.
- **Recherche avancée** : Recherche de profils et annonces filtrées par domaine, ville et catégorie.
- **Recherche rapide** : Recherche rapide d’utilisateurs ou d’entreprises à travers un champ de recherche sur le réseau social interne.
- **Profil utilisateur** : Affichage, édition, et gestion du profil avec possibilité de changer le mot de passe ou supprimer le compte.

## Auteurs
- Loic Esclapez
- Raphaël Dimeck
- Odilon Vidal

## Installation et lancement

### Prérequis
- Node.js installé (version >= 14.x)
- NPM installé

### Lancer le projet

1. Clonez le dépôt dans votre répertoire local :
  ```bash
   git clone https://url-du-repository.git
   ```

2. Installez les dépendances pour le **backend** et le **frontend** :

   - Backend :
    ```bash
     cd backend
     npm install
     cd ..
     npm run server
    ```


   - Frontend :
    ```bash
     cd frontend
     npm install
     cd ..
     npm run client
    ```

### Accéder à l'application
- Le **backend** sera accessible à l'adresse : `http://localhost:5000`
- Le **frontend** sera accessible à l'adresse : `http://localhost:3000`

## Développement
- **Backend** : Utilise Node.js et Express pour l'API.
- **Frontend** : Utilise React pour l'interface utilisateur.

## Remarques
- L'application permet à la fois la gestion de profils utilisateurs, la recherche avancée et rapide, ainsi que l'inscription et la connexion.
- Les messages d'erreur sont spécifiés pour chaque formulaire pour une meilleure expérience utilisateur.

## Licence
Ce projet est sous la licence [MIT](LICENSE).
