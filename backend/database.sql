CREATE DATABASE IF NOT EXISTS agrimali;
USE agrimali;

CREATE TABLE Utilisateur (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nom         VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    motDePasse  VARCHAR(255) NOT NULL,
    telephone   VARCHAR(20),
    type        ENUM('Agriculteur','Acheteur','Administrateur') NOT NULL
);

CREATE TABLE Agriculteur (
    id            INT PRIMARY KEY,
    localisation  VARCHAR(200),
    typesCultures VARCHAR(255),
    FOREIGN KEY (id) REFERENCES Utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE Acheteur (
    id               INT PRIMARY KEY,
    adresseLivraison VARCHAR(255),
    FOREIGN KEY (id) REFERENCES Utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE Administrateur (
    id     INT PRIMARY KEY,
    niveau VARCHAR(50),
    FOREIGN KEY (id) REFERENCES Utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE Produit (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    nom             VARCHAR(150) NOT NULL,
    description     TEXT,
    prix            DOUBLE NOT NULL,
    quantite        INT DEFAULT 0,
    categorie       VARCHAR(100),
    datePublication DATE DEFAULT (CURRENT_DATE),
    agriculteur_id  INT,
    FOREIGN KEY (agriculteur_id) REFERENCES Agriculteur(id) ON DELETE CASCADE
);

CREATE TABLE Meteo (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    region         VARCHAR(100),
    temperature    DOUBLE,
    precipitation  DOUBLE,
    date           DATE,
    agriculteur_id INT,
    FOREIGN KEY (agriculteur_id) REFERENCES Agriculteur(id) ON DELETE SET NULL
);

CREATE TABLE Message (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    contenu         TEXT NOT NULL,
    dateEnvoi       DATETIME DEFAULT CURRENT_TIMESTAMP,
    lu              BOOLEAN DEFAULT FALSE,
    expediteur_id   INT,
    destinataire_id INT,
    FOREIGN KEY (expediteur_id)   REFERENCES Utilisateur(id) ON DELETE SET NULL,
    FOREIGN KEY (destinataire_id) REFERENCES Utilisateur(id) ON DELETE SET NULL
);

CREATE TABLE Commande (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    dateCommande DATE DEFAULT (CURRENT_DATE),
    statut       ENUM('En attente','Confirmée','En livraison','Livrée','Annulée') DEFAULT 'En attente',
    montantTotal DOUBLE DEFAULT 0.0,
    acheteur_id  INT,
    FOREIGN KEY (acheteur_id) REFERENCES Acheteur(id) ON DELETE SET NULL
);

CREATE TABLE Commande_Produit (
    commande_id  INT,
    produit_id   INT,
    quantite     INT NOT NULL DEFAULT 1,
    prixUnitaire DOUBLE NOT NULL,
    PRIMARY KEY (commande_id, produit_id),
    FOREIGN KEY (commande_id) REFERENCES Commande(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id)  REFERENCES Produit(id)  ON DELETE CASCADE
);

INSERT INTO Utilisateur (nom, email, motDePasse, telephone, type) VALUES
('Coulibaly Sira',           'sira@agrimali.ml',         '123456', '+223 76 11 11 01', 'Agriculteur'),
('Diaby Afsatou Almamy',     'afsatou@agrimali.ml',      '123456', '+223 76 11 11 02', 'Acheteur'),
('Diakite Cheick Al Hassane','cheick@agrimali.ml',       '123456', '+223 76 11 11 03', 'Administrateur'),
('Diallo Aminata',           'aminata@agrimali.ml',      '123456', '+223 76 11 11 05', 'Acheteur'),
('Dicko Aissata',            'aissata@agrimali.ml',      '123456', '+223 76 11 11 07', 'Agriculteur'),
('Doumbia Sitan',            'sitan@agrimali.ml',        '123456', '+223 76 11 11 08', 'Agriculteur'),
('Fall Mohamed Papa L',      'mohamedpapal@agrimali.ml', '123456', '+223 76 11 11 09', 'Acheteur'),
('Fall Zeinabou',            'zeinabou@agrimali.ml',     '123456', '+223 76 11 11 10', 'Agriculteur'),
('Sagara Nanga',             'nanga@agrimali.ml',        '123456', '+223 76 11 11 11', 'Acheteur'),
('Simaga Fatoumata Sankare', 'fatoumata@agrimali.ml',    '123456', '+223 76 11 11 13', 'Agriculteur'),
('Traore Fatimata',          'fatimata@agrimali.ml',     '123456', '+223 76 11 11 14', 'Administrateur');

INSERT INTO Agriculteur (id, localisation, typesCultures) VALUES
(1,  'Bamako, Mali',   'Maïs, Mil'),
(5,  'Sikasso, Mali',  'Coton, Arachides'),
(6,  'Mopti, Mali',   'Riz, Sorgho'),
(8,  'Kayes, Mali',   'Maïs, Mangues'),
(10, 'Koutiala, Mali', 'Coton, Mil');

INSERT INTO Acheteur (id, adresseLivraison) VALUES
(2, 'Bamako, Hamdallaye'),
(4, 'Bamako, ACI 2000'),
(7, 'Bamako, Badalabougou'),
(9, 'Bamako, Lafiabougou');

INSERT INTO Administrateur (id, niveau) VALUES
(3,  'Fondateur — CEO AgriMali'),
(11, 'Co-Fondatrice');

INSERT INTO Produit (nom, description, prix, quantite, categorie, agriculteur_id) VALUES
('Sac de Maïs 50kg',   'Maïs local de Coulibaly Sira',       15000, 200, 'Céréales',     1),
('Coton brut 100kg',   'Coton propre de Diallo Aminata',      28000, 15,  'Textile',      5),
('Sac de Riz 50kg',    'Riz de Mopti de Doumbia Sitan',       18000, 100, 'Céréales',     6),
('Mangues fraîches',   'Mangues de Kayes de Fall Zeïnabou',    4500, 80,  'Fruits',       8),
('Sorgho 25kg',        'Sorgho de Simaga Fatoumata',           6000, 150, 'Céréales',    10),
('Arachides 20kg',     'Arachides de Dicko Aïssata',           9000, 0,   'Légumineuses', 5);

INSERT INTO Meteo (region, temperature, precipitation, date, agriculteur_id) VALUES
('Bamako',   34.5, 12.3, '2026-05-26', 1),
('Sikasso',  31.2, 18.7, '2026-05-26', 5),
('Mopti',    38.1,  5.2, '2026-05-26', 6),
('Kayes',    40.0,  2.1, '2026-05-26', 8),
('Koutiala', 33.5, 14.0, '2026-05-26', 10);

INSERT INTO Message (contenu, expediteur_id, destinataire_id) VALUES
('Bonjour, le sac de maïs est-il encore disponible ?', 2, 1),
('Oui, il est disponible. Quantité : 200 sacs.',        1, 2),
('Je voudrais commander 5 sacs de riz.',                4, 6),
('Commande reçue, livraison dans 48h.',                 6, 4);

INSERT INTO Commande (dateCommande, statut, montantTotal, acheteur_id) VALUES
('2026-05-20', 'Livrée',       75000, 2),
('2026-05-23', 'En livraison', 28000, 4),
('2026-05-26', 'En attente',   22200, 7);

INSERT INTO Commande_Produit (commande_id, produit_id, quantite, prixUnitaire) VALUES
(1, 1, 5, 15000),
(2, 2, 1, 28000),
(3, 3, 1, 18000),
(3, 4, 1,  4500);