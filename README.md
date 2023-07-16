# Alyra Projet final - Registre de sécurité

---

## 1. Ressources

- [Vidéo de démonstration]()

 - [Déploiement Vercel]()

---

## 2. Technologies utilisées

- NEXT.js (TypeScript) 
- Hardhat 2.16.1
- RainbowKit 
- Wagmi
- Solidity 0.8.18

---

## 3. Installation

### 3.1. Prérequis

#### 3.1.1. Renommer le fichier `sample.env` en `.env` dans le dossier `backend`.
Ce fichier contient les informations nécessaires pour s'authentifier au réseau de test Sepolia. 
```js
INFURA_ID=<YOUR_ID>
SEPOLIA_PRIVATE_KEY=<YOUR_KEY>
```

#### 3.1.2. Renommer le fichier `sample.env` en `.env.developement` et `.env.production` dans le dossier `frontend`. 
```js
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_SMART_CONTRACT_ADDRESS>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<YOUR_WALLET_CONNECT_PROJECT_ADDRESS>
NEXT_PUBLIC_ENABLE_TESTNETS=<true or false>
NEXT_PUBLIC_NETWORK=<hardhat or sepolia>
NEXT_PUBLIC_GENESIS_BLOCK=<GENESIS_BLOCK>
```

Renseigner les valeurs en fonction de l'environnement:

- .env.development
  - `NEXT_PUBLIC_ENABLE_TESTNETS=true`
  - `NEXT_PUBLIC_NETWORK=hardhat`
  - `NEXT_PUBLIC_GENESIS_BLOCK=1`
- .env.production
  - `NEXT_PUBLIC_ENABLE_TESTNETS=false`
  - `NEXT_PUBLIC_NETWORK=sepolia`

> ***Note**: Par default le réseau de test `hardhat` est activé.*



### 3.2. Installation des dépendances

#### 3.2.1. Installation du backend

Depuis le dossier racine se positionner dans le dossier `backend` et installez les dépendances

```shell
cd backend
npm install
```

#### 3.2.2. Installation du frontend

Depuis le dossier racine se positionner dans le dossier `frontend`et installez les dépendances

```shell
cd frontend
npm install
```

---

## 4. Déployer et exécuter le projet en local

### 4.1. Lancer le testnet hardhat (local)

Depuis le dossier racine se positionner dans le dossier `backend`

```shell
cd backend
```

Ouvrez une console exécutez le code suivant pour démarrer le testnet `hardhat`:

```shell
npx hardhat node
```
> _**Important**: Laissez ouverte cette console_

### 4.2. Déployer le smart contract

Ouvrez une seconde console et exécutez le code suivant pour déployer le smart contract:

#### 4.2.1. Déploiement sur le réseau `hardhat` (local)
```shell
npx hardhat run --network localhost scripts/01-deploy.ts
```

#### 4.2.2. Déploiement sur le réseau `sepolia`
```shell
npx hardhat run --network sepolia scripts/01-deploy.ts
```

### 4.3. Démarrer la dApp

Depuis le dossier racine se positionner dans le dossier `frontend`

```shell
cd frontend
```

### 4.3.1. Démarrer l'application en environnement de `dev`

```shell
npm run dev
```

### 4.3.2. Démarrer l'application en environnement de `prod`

```shell
npm run build && npm run start
```

### 4.3.3. Accédez à l'application

Depuis un navigateur web [http://localhost:3000](http://localhost:3000)

---

## 6. Compilation et tests unitaires

Depuis le dossier racine se positionner dans le dossier `backend`

```shell
cd backend 
```

### 6.1 Compilez le smart contract
```shell
npx hardhat compile
```

### 6.2 Exécutez les test unitaires

```shell
npx hardhat test
```

Avec le coverage 
```shell
npx hardhat coverage
```

Avec le gas report 

```shell
REPORT_GAS=true npx hardhat test
```


## 5. Déploiement sur Vercel

> Seul le frontend sera déployé sur Vercel.
> 
> Le testnet utilisé sera Sepolia.

### 5.1. Configuration manuelle

### 5.2. Déploiement sur Vercel via scripts 