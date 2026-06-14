# StreetCats

**Studente:** Michela Pollio  
**Matricola:** N86003607  

Applicazione web full-stack per la mappatura e il monitoraggio delle colonie feline, sviluppata con un'architettura a servizi separati (Angular per il front-end, Node.js/Express per il back-end).

---

## Requisiti di Sistema
Prima di procedere, assicurarsi che sul sistema siano installati i seguenti componenti:
* **Node.js** (versione 20 o superiore) e **npm**
* **PostgreSQL** (attivo e in ascolto sulla porta standard 5432)

---

## Installazione

Eseguire i comandi seguenti dalla radice del progetto per installare le dipendenze sia del backend che del frontend.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Variabili d'ambiente (backend)

Creare un file `.env` nella cartella `backend/` con le seguenti variabili (esempio):

```
DB_NAME=streetcats_db
DB_USER=postgres
DB_PASS=password
DB_HOST=localhost
DB_PORT=5432
```

Il backend usa `sequelize` per connettersi al database: assicurarsi che il database esista e le credenziali siano corrette.

## Comandi manuali per l'avvio

Backend (sviluppo):

```bash
cd backend
npm run dev
```

Descrizione: avvia il server in modalità sviluppo usando `nodemon` + `tsx` (esegue direttamente TypeScript).

Backend (produzione / build):

```bash
cd backend
npm run build
npm start
```

Descrizione: `npm run build` compila i file TypeScript in JavaScript (i `.js` verranno emessi accanto ai `.ts`), quindi `npm start` esegue il server in Node.

Frontend (sviluppo):

```bash
cd frontend
npm start
```

Descrizione: avvia l'app Angular con `ng serve` (default http://localhost:4200). Il backend di sviluppo è configurato per accettare richieste da `http://localhost:4200`.

## Porte predefinite

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:4200`


