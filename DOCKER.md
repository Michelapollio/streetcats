Istruzioni per dockerizzare l'applicazione (backend + frontend)

Build dei container:

```bash
docker-compose build
```

Avvio in foreground:

```bash
docker-compose up
```

Avvio in background (detached):

```bash
docker-compose up -d --build
```

Nota:
- Il backend espone la porta `3000`. Mappa la cartella `./uploads` come volume in `backend`.
- Il frontend viene servito da `nginx` su porta `4200` (mappa `80` container -> `4200` host).
- Configura le variabili d'ambiente (es. connessione al DB) via `docker-compose.yml` o un file `.env`.
