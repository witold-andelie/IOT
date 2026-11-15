# Smart Classroom Ventilation

IoT semester project for **ETEW5E Internet of Things** (Czech University of Life Sciences Prague, ZS 2026/27).

Every classroom gets a small sensor that measures **CO₂, temperature and humidity**.
The system stores the readings and shows each room as a **traffic light**, so the teacher
knows when to open the window.

| CO₂ (ppm)   | Status     | Shown as              |
|-------------|------------|-----------------------|
| < 1000      | `good`     | 🟢 ✓ Good             |
| 1000 – 1400 | `warning`  | 🟡 ⚠ Ventilate soon   |
| > 1400      | `critical` | 🔴 ✕ Ventilate now    |

![Grafana dashboard](docs/images/dashboard.png)

> **Note:** the hardware (ESP32 + CO₂ sensor) is only proposed in the documentation and
> has not been built. The running demo uses **simulated sensors** that send exactly the same
> messages as real devices would.

**Contents**

1. [How it works](#1-how-it-works)
2. [What you need](#2-what-you-need)
3. [Run it step by step](#3-run-it-step-by-step)
4. [Check every part of the system](#4-check-every-part-of-the-system)
5. [Project structure](#5-project-structure)
6. [Configuration (.env)](#6-configuration-env)
7. [Common tasks](#7-common-tasks)
8. [Troubleshooting](#8-troubleshooting)
9. [Documentation and team workflow](#9-documentation-and-team-workflow)

---

## 1. How it works

```
 ┌──────────────────────────────────────────────┐
 │ Sensor (one per classroom)                    │  demo: simulated in Node-RED
 │ measures CO₂, temperature, humidity every 10 s│  real: ESP32-C3 + Sensirion SCD41
 └──────────────────────┬───────────────────────┘
                        │ MQTT message to topic  classroom/C21/telemetry
                        │ {"room":"C21","co2":1102,"temp":22.4,"hum":38.0}
                        ▼
 ┌──────────────────────────────────────────────┐
 │ Mosquitto (MQTT broker)                       │  the "post office" for messages
 └──────────────────────┬───────────────────────┘
                        │ Node-RED subscribes to  classroom/+/telemetry
                        ▼
 ┌──────────────────────────────────────────────┐
 │ Node-RED                                      │  checks the values and decides
 │ validate → good / warning / critical          │  the status from the CO₂ level
 └──────────────────────┬───────────────────────┘
                        │ INSERT INTO measurements ...
                        ▼
 ┌──────────────────────────────────────────────┐
 │ PostgreSQL (database)                         │  tables: rooms, measurements
 └──────────────────────┬───────────────────────┘
                        │ SQL queries every 10 s
                        ▼
 ┌──────────────────────────────────────────────┐
 │ Grafana (dashboard in the browser)            │  traffic lights, charts, statistics
 └──────────────────────────────────────────────┘
```

### The technologies in one sentence each

| Technology | What it is | Used here for |
|---|---|---|
| **MQTT** | a lightweight messaging protocol for IoT devices (publish / subscribe) | sensors send readings to a topic, others subscribe to it |
| **Eclipse Mosquitto** | an MQTT broker (server) | receives messages and forwards them to subscribers |
| **Node-RED** | a visual programming tool; you connect "nodes" into flows in the browser | simulating sensors, checking data, writing to the database |
| **PostgreSQL** | a relational SQL database | storing every reading |
| **Grafana** | a web tool for dashboards and charts | showing the data |
| **Docker / Docker Compose** | runs each program in its own container; Compose starts them all together | one command starts the whole system on any computer |

### What happens every 10 seconds

1. The Node-RED flow **"1 - Sensor simulator"** creates one reading for each of the three classrooms
   (C21, D105, E101) and publishes it over MQTT. CO₂ slowly rises (people are breathing);
   when it reaches 1500 ppm the simulated teacher "opens the window" and CO₂ falls back to 600 ppm.
   One cycle takes about 5–10 minutes (faster than reality, for the demo).
2. The flow **"2 - Ingest & classify"** receives the message, checks that all values are numbers,
   calculates the status (`good` / `warning` / `critical`) and inserts a row into PostgreSQL.
3. Grafana queries PostgreSQL and refreshes the dashboard.

---

## 2. What you need

| Requirement | Notes |
|---|---|
| **Docker Desktop** (Windows / macOS) or **Docker Engine + Compose v2** (Linux) | https://docs.docker.com/get-docker/ — after installing, **start Docker Desktop** and wait until it says "running" |
| **Git** | https://git-scm.com/downloads (or download the repository as ZIP from GitHub) |
| ~2 GB free disk space | for the Docker images |
| Free ports **1880, 1883, 3000, 5432** | see [Troubleshooting](#port-is-already-allocated) if one is taken |

You do **not** need to install Node-RED, PostgreSQL or Grafana yourself; Docker downloads them.

Check that Docker works:

```bash
docker --version
docker compose version
```

Both commands must print a version. If `docker compose` is not found, update Docker.

---

## 3. Run it step by step

### Step 1: Get the code

```bash
git clone https://github.com/witold-andelie/IOT.git
cd IOT
```

(Team members with write access can use SSH: `git clone git@github.com:witold-andelie/IOT.git`.)

### Step 2: Create your configuration file

The passwords are not stored in Git. Copy the template and edit it:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Open `.env` in any text editor and replace both `change-me` values with your own passwords.
(For a local test the defaults also work, but never use them on a public server.)

### Step 3: Start the system

```bash
docker compose up -d --build
```

- `--build` builds the Node-RED image (adds the PostgreSQL node). The **first start takes
  a few minutes** because Docker downloads the images. Later starts take seconds.
- `-d` runs everything in the background.

### Step 4: Check that all four services are running

```bash
docker compose ps
```

You should see four services with status `Up` (PostgreSQL and Node-RED also show `healthy`;
during the first ~30 seconds Node-RED shows `health: starting`, which is normal):

```
SERVICE     STATUS
grafana     Up 30 seconds
mosquitto   Up 30 seconds
node-red    Up 25 seconds (healthy)
postgres    Up 30 seconds (healthy)
```

### Step 5: Open the dashboard

Open **http://localhost:3000** in your browser. The *Classroom Air Quality* dashboard opens
without login (read-only). The first values appear after about 10 seconds; the charts fill up
over the next minutes, and the first traffic light turns yellow after a few minutes.

| Service | URL / address | Login |
|---|---|---|
| Grafana (dashboard) | http://localhost:3000 | none for viewing; admin = `GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD` from `.env` (click **Sign in**) |
| Node-RED (flows) | http://localhost:1880 | none |
| PostgreSQL | `localhost:5432`, database `classroom` | `POSTGRES_USER` / `POSTGRES_PASSWORD` from `.env` |
| MQTT broker | `localhost:1883` | none (anonymous) |

All ports are bound to `127.0.0.1`, so they are reachable only from your own computer.

Tip: add `?kiosk` to the dashboard URL for a full-screen view without menus
(e.g. http://localhost:3000/d/classroom-air/classroom-air-quality?kiosk).

### Step 6: Stop it

```bash
docker compose down        # stop; the data is kept
docker compose down -v     # stop AND delete all data (fresh start next time)
```

---

## 4. Check every part of the system

If the dashboard shows "No data", check each step of the data path in this order.

**a) Are sensor messages arriving at the MQTT broker?**

```bash
docker compose exec mosquitto mosquitto_sub -t 'classroom/#' -v
```

Every 10 seconds you should see three lines like
`classroom/C21/telemetry {"room":"C21","co2":713,"temp":22.4,"hum":40.7}`. Stop with `Ctrl+C`.

**b) Is Node-RED processing them?**

Open http://localhost:1880. There are two tabs:

- **1 - Sensor simulator**: *Every 10 s* → *Simulate classrooms* → *Publish telemetry*
- **2 - Ingest & classify**: *Classroom sensors* → *Validate & classify* → *Save measurement*

Under *Validate & classify* a small coloured dot shows the last processed reading
(e.g. `C21: 1102 ppm (warning)`). The MQTT nodes should show a green **connected** dot.
To see every message, click the button on the right side of a green **debug** node to activate it
and open the debug panel (bug icon, top right).

**c) Are rows being written to the database?**

```bash
docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT room_id, co2, temp, hum, status, ts FROM measurements ORDER BY id DESC LIMIT 9;"'
```

You can also connect with a graphical tool such as pgAdmin or DBeaver:
host `localhost`, port `5432`, database `classroom`, user and password from `.env`.

**d) Can Grafana read the database?**

Sign in to Grafana as admin → **Connections → Data sources → Classroom DB → Test**.
It should say "Database Connection OK".

---

## 5. Project structure

```
IOT/
├── docker-compose.yml          defines the 4 services, their ports, volumes and settings
├── .env.example                configuration template → copy to .env (which is NOT committed)
├── mosquitto/
│   └── mosquitto.conf          MQTT broker settings (port 1883, anonymous access)
├── node-red/
│   ├── Dockerfile              official Node-RED image + node-red-contrib-postgresql
│   └── data/
│       └── flows.json          the Node-RED flows (simulator + ingest); only this file is in Git
├── db/
│   └── init.sql                creates the tables and the 3 classrooms (runs on the first start only)
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/postgres.yml   connects Grafana to PostgreSQL automatically
│   │   └── dashboards/dashboards.yml  tells Grafana to load dashboards from grafana/dashboards/
│   └── dashboards/
│       └── classroom.json      the "Classroom Air Quality" dashboard
└── docs/
    ├── technical-documentation.md   solution name, technologies, hardware, costs, sustainability
    ├── technical-documentation.pdf  the same document as PDF (for Moodle)
    └── images/dashboard.png
video/                      video presentation (Remotion + Kokoro TTS), see video/README.md
```

### Database tables

```sql
rooms        (id, name, building, capacity)                -- e.g. 'C21', 'Seminar room C21', 'C', 30
measurements (id, room_id → rooms.id, co2, temp, hum, status, ts)
```

### MQTT message format

Topic `classroom/<room id>/telemetry`, payload JSON:

```json
{"room": "C21", "co2": 1102, "temp": 22.4, "hum": 38.0}
```

`co2` in ppm, `temp` in °C, `hum` in % relative humidity. The room is taken from the topic;
it must exist in the `rooms` table.

---

## 6. Configuration (.env)

| Variable | Default | Meaning |
|---|---|---|
| `POSTGRES_DB` | `classroom` | database name |
| `POSTGRES_USER` | `iot` | database user (also used by Node-RED and Grafana) |
| `POSTGRES_PASSWORD` | `change-me` | database password |
| `POSTGRES_HOST_PORT` | `5432` | port on **your** computer for PostgreSQL; change if 5432 is taken |
| `GRAFANA_ADMIN_USER` | `admin` | Grafana administrator |
| `GRAFANA_ADMIN_PASSWORD` | `change-me` | Grafana administrator password |
| `TZ` | `Europe/Prague` | time zone of the containers |

The database and Grafana passwords are applied **only on the first start** (when the data volumes
are created). To change them later, run `docker compose down -v` (deletes the data) and start again.

---

## 7. Common tasks

### See the logs

```bash
docker compose logs -f node-red      # or: mosquitto, postgres, grafana
```

### Edit the Node-RED flows

1. Open http://localhost:1880, change the flow, click **Deploy** (top right).
2. Node-RED saves the change directly into `node-red/data/flows.json`.
3. Commit that file.

The database and MQTT connection settings come from environment variables
(`PGHOST`, `PGUSER`, …, `MQTT_HOST` in `docker-compose.yml`), so the flow file contains no passwords.

### Change the CO₂ limits

The limits are in two places:

1. Node-RED, node **Validate & classify** (tab 2): `p.co2 < 1000 ? 'good' : p.co2 <= 1400 ? 'warning' : 'critical'`
2. Grafana, panel **CO₂ concentration** → *Thresholds* (the dashed lines at 1000 and 1400)

### Add a classroom

1. Add it to the database:
   ```bash
   docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "INSERT INTO rooms VALUES ('"'"'B12'"'"', '"'"'Seminar room B12'"'"', '"'"'B'"'"', 25);"'
   ```
   and add the same row to `db/init.sql`, so it exists after a fresh start.
2. In Node-RED, node **Simulate classrooms**, add `{ id: 'B12', rise: 20 },` to the `ROOMS` list and click **Deploy**.
3. The new room appears in Grafana automatically (with a default colour).

### Edit the Grafana dashboard

Sign in as admin, edit and **Save**. The change is stored inside Grafana, not in the file.
To put it into Git: **Export → Export as JSON**, and replace `grafana/dashboards/classroom.json`
with the exported content. Then commit the file.

### Start with an empty database

```bash
docker compose down -v
docker compose up -d
```

`db/init.sql` runs again and creates fresh tables. **You must do this after changing `db/init.sql`**,
because it runs only when the database is created for the first time.

### Update after `git pull`

```bash
git pull
docker compose up -d --build
```

---

## 8. Troubleshooting

### `Cannot connect to the Docker daemon` / `failed to connect to the docker API`

Docker Desktop is not running. Start it, wait until it is ready, then run the command again.

### `port is already allocated`

Another program uses one of the ports. Find it:

```bash
# macOS / Linux
lsof -nP -iTCP:5432 -sTCP:LISTEN
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5432
```

Often it is a locally installed PostgreSQL. Either stop it, or set `POSTGRES_HOST_PORT=5433`
in `.env` and run `docker compose up -d` again. (For ports 1880, 1883 and 3000 change the
left number in `ports:` in `docker-compose.yml`, e.g. `"127.0.0.1:3001:3000"`.)

### Grafana shows "No data"

- Wait 10–20 seconds after the start; the dashboard refreshes every 10 s.
- Check that the time range (top right) is **Last 30 minutes**, not some time in the past.
- Go through [section 4](#4-check-every-part-of-the-system) to find where the data stops.

### Node-RED: `password authentication failed` or `relation "measurements" does not exist`

The database was created earlier with different settings. Reset it with
`docker compose down -v && docker compose up -d`.

### Linux: Node-RED cannot write `node-red/data`

The Node-RED container runs as user 1000. Give it the folder:

```bash
sudo chown -R 1000:1000 node-red/data
```

### Windows: `docker compose exec ... sh -c '...'` fails in PowerShell

Run the commands from **Git Bash**, or open a shell in the container first:
`docker compose exec postgres psql -U iot -d classroom`.

---

## 9. Documentation and team workflow

- **Technical documentation** (name, technologies, hardware proposal, costs, sustainability):
  [`docs/technical-documentation.md`](docs/technical-documentation.md) (PDF: [`docs/technical-documentation.pdf`](docs/technical-documentation.pdf))
- **Never commit `.env`** or any password; the repository is public. `.gitignore` already excludes it.
- Work on a branch and merge into `main` when the change works:
  ```bash
  git checkout -b my-change
  # ... edit, test with docker compose ...
  git add -A && git commit -m "Describe the change"
  git push -u origin my-change
  ```
