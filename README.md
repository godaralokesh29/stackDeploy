# CloudForge Deployment System

This repository contains a simple multi-service deployment flow for Git repositories.
It uses an ingestion service, a build/deploy worker service, and a request handler service.
The frontend runs separately and posts repository URLs to the ingestion service.

---

## System Overview

The system is made up of three main backend components:

1. **Ingestion Service** (`Ingestion-service`)
2. **Deploy Service** (`deploy-service`)
3. **Request Handler** (`request-handler`)

Each service plays a distinct role:

- `Ingestion-service` receives a repo URL and uploads the cloned source to S3.
- `deploy-service` consumes Redis build queue items, builds the project, and uploads the build output to S3.
- `request-handler` serves the deployed app from S3 based on a wildcard subdomain.

---

## Architecture Diagram

```text
                         +---------------------+
                         |   Frontend (3002)   |
                         | + React app / CLI   |
                         +----------+----------+
                                    |
                                    | POST /deploy
                                    v
                         +---------------------+
                         | Ingestion Service   |
                         | (localhost:3000)    |
                         +---------------------+
                                   |   
                                   | clone repo + upload source to S3
                                   | push id to Redis queue
                                   v
                         +---------------------+
                         | Redis queue         |
                         | key = build-queue   |
                         +---------------------+
                                   |
                                   | BRPOP
                                   v
                         +---------------------+
                         | Deploy Service      |
                         | (worker)            |
                         +---------------------+
                                   |  
                                   | download source from S3
                                   | build project locally
                                   | upload built assets to S3
                                   v
                         +---------------------+
                         | Amazon S3 bucket    |
                         | stackdeploy-gitstore|
                         +---------------------+
                                   |
                                   | GET object
                                   v
                         +---------------------+
                         | Request Handler     |
                         | (localhost:3001)    |
                         +---------------------+
                                   |
                                   | serve files from S3
                                   v
                         +---------------------+
                         | Browser via         |
                         | id.127.0.0.1.nip.io |
                         +---------------------+
```

---

## 1. Ingestion Service Architecture

### What it does

The ingestion service accepts deployment requests and prepares the raw source for building.

### Flow

1. Receives `POST /deploy` with JSON `{ repoUrl }`.
2. Generates a random deployment ID like `vknqK`.
3. Clones the Git repository into a local folder under `output/<id>`.
4. Recursively uploads all cloned files to S3 under key prefix `<id>/...`.
5. Pushes the generated ID onto Redis list `build-queue`.
6. Returns `{ id }` to the requester.

### Architecture diagram

```text
  Frontend -> POST /deploy -> Ingestion Service
                      |
                      +--> Git clone to local disk
                      |
                      +--> S3 upload under prefix: <id>/...
                      |
                      +--> Redis lPush("build-queue", id)
```

### Why Redis queue?

Redis provides a simple asynchronous handoff between ingestion and build worker.

- `lPush("build-queue", id)` enqueues a deployment ID.
- The deploy worker blocks on `brPop("build-queue", 0)`.
- This decouples the upload step from the build step.
- If the build worker is busy, ingestion can still accept requests.

### S3 usage here

- Raw cloned repository files are stored in S3 with keys like:
  - `vknqK/package.json`
  - `vknqK/src/index.ts`
  - `vknqK/public/index.html`

- This keeps the source available for the deploy worker without needing local disk retention.

---

## 2. Deploy Service Architecture

### What it does

The deploy service is a worker that builds the repository and publishes the final site assets.

### Flow

1. Waits on Redis queue `build-queue`.
2. When an ID arrives, downloads all raw repo files from S3 prefix `<id>/`.
3. Writes them to local disk under `deploy-service/output/<id>`.
4. Runs `npm install` and `npm run build` in that folder.
5. Copies the build output from `dist/` to S3 under `dist/<id>/...`.

### Architecture diagram

```text
  Redis build-queue --brPop--> Deploy Service
                                   |
                                   +--> Download files from S3 prefix <id>/
                                   |
                                   +--> Run build locally
                                   |
                                   +--> Upload built output to S3 prefix dist/<id>/
```

### S3 usage here

- Input S3 prefix: `vknqK/` contains raw source.
- Output S3 prefix: `dist/vknqK/` contains built files.
- Example built objects:
  - `dist/vknqK/index.html`
  - `dist/vknqK/assets/index-C4SoD0La.js`
  - `dist/vknqK/assets/index-Ca74PG3G.css`

### Why the two-stage upload?

This separation keeps raw source and built site assets distinct.

- Ingestion stores source.
- Deploy service stores final site output.
- Request handler only needs the final `dist/` output.

---

## 3. Request Handler Architecture

### What it does

The request handler exposes a public URL per deployment ID and serves static app files from S3.

### Flow

1. Browser navigates to `http://<id>.127.0.0.1.nip.io:3001/`.
2. The request handler extracts `<id>` from the hostname.
3. It maps request paths to S3 keys under `dist/<id>/...`.
4. It fetches the object from S3 and returns the file body.
5. If the object does not exist, it returns `404 Not found`.

### Architecture diagram

```text
  Browser (via <id>.127.0.0.1.nip.io:3001)
             |
             v
     Request Handler
             |
    GET S3 object from dist/<id>/<path>
             |
             v
      Return static asset to browser
```

### Wildcard subdomain by `nip.io`

`nip.io` is a wildcard DNS service that maps any hostname containing an IP address back to that IP.

For example:

- `vknqK.127.0.0.1.nip.io` resolves to `127.0.0.1`
- `RhljE.127.0.0.1.nip.io` resolves to `127.0.0.1`

This means you can use a unique subdomain for each deployment without changing DNS or hosts files.

### Why wildcard host-based routing?

Because the request handler uses the hostname to determine which deployment ID to serve.
This makes the URL look like a real deployment domain:

- `http://vknqK.127.0.0.1.nip.io:3001/`
- `http://RhljE.127.0.0.1.nip.io:3001/`

That subdomain is the ID.

### Key resolution and case sensitivity

S3 keys are case-sensitive. The request handler resolves the exact ID folder prefix from S3 using:

- `dist/<id>/...`

If the hostname ID is lowercased but the S3 folder uses mixed case, the handler resolves the correct folder name before fetching.
This avoids `NoSuchKey` errors when the ID contains uppercase letters.

---

## Redis Queue Explanation

Redis is used as the queueing layer between ingestion and deployment.

- `Ingestion-service` pushes IDs with `lPush("build-queue", id)`.
- `deploy-service` consumes IDs with `brPop("build-queue", 0)`.

Because `brPop` blocks until an item is available, the deploy worker is idle until work arrives.
This makes the deployment pipeline reliable and decoupled.

---

## Full Flow Example

1. User enters repository URL in the frontend.
2. Frontend `POST`s to `http://localhost:3000/deploy`.
3. `Ingestion-service` clones the repo and uploads raw source to S3.
4. `Ingestion-service` pushes the build ID into Redis.
5. `Deploy-service` wakes up, downloads the raw source from S3, builds it, and uploads the `dist/` output back to S3.
6. User opens `http://<id>.127.0.0.1.nip.io:3001/`.
7. `Request-handler` serves the built app files from S3.

---

## Setup and Run

### 1. Redis

Start Redis locally or connect to a Redis instance.
The services use the default Redis URL in `createClient()`.

### 2. Ingestion Service

```bash
cd Ingestion-service
npm install
npm run start # or node src/index.ts / node dist/index.js depending on build
```

### 3. Deploy Service

```bash
cd deploy-service
npm install
npm run start # or node src/index.ts / node dist/index.js depending on build
```

### 4. Request Handler

```bash
cd request-handler
npm install
npm run start # or node src/index.ts / node dist/index.js depending on build
```

### 5. Frontend

If your frontend is at port `3002`:

```bash
cd frontend
npm install
npm run dev
```

Then open the UI and paste your Git repo URL.

---

## Deployment URL Pattern

Once a deployment is created, the returned URL looks like:

```text
http://<id>.127.0.0.1.nip.io:3001/
```

Example:

```text
http://vknqK.127.0.0.1.nip.io:3001/
```

This URL is portable locally because `nip.io` resolves the subdomain to `127.0.0.1` automatically.

---

## Notes

- The request handler is responsible for serving built assets directly from S3.
- Redis is the glue between ingestion and deployment.
- S3 stores both raw source and built distributions.
- Wildcard hostnames are handled using `nip.io` so you can use unique deployment IDs.

If you want, I can also add a simplified root-level `npm start` orchestration script and a `docker-compose.yml` for the whole stack.
