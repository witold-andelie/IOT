# Video script: Smart Classroom Ventilation

Target length: about 4 minutes (assignment: 3–5 min).
Narration: Kokoro TTS, voice `af_heart` (≈ 180 words per minute).

Each scene has the **narration** (what the voice says) and the **visuals** (what Remotion shows).

---

## 1. Opening slide (≈ 12 s)

**Visuals:** title "Smart Classroom Ventilation", subtitle "ETEW5E Internet of Things · CZU Prague · 2026/27",
team names: Zongyuan Chi, Lijie Luo, Jingyi Liu, Wentao Ma.

**Narration:**
Smart Classroom Ventilation. A semester project for the Internet of Things course at the
Czech University of Life Sciences Prague, by Zongyuan Chi, Lijie Luo, Jingyi Liu and Wentao Ma.

## 2. Motivation (≈ 35 s)

**Visuals:** classroom illustration; a CO₂ counter rising from 450 to 1,500 ppm; text "invisible".

**Narration:**
Imagine a seminar room on a Tuesday morning. Thirty students, closed windows, and a ninety-minute lesson.
With every breath, the carbon dioxide level in the room goes up. Czech guidelines for school ventilation
say it should stay below fifteen hundred parts per million, but in a full classroom that limit can be
reached within a single lesson. Studies suggest that high carbon dioxide makes people tired and less focused.
The problem is simple: nobody can see it. So the window is opened too late, or not at all.

## 3. Similar solutions (≈ 35 s)

**Visuals:** four cards: Aranet4 (~€199, one room), Airthings / Netatmo (vendor cloud),
CO₂ traffic light DIY (no data), Building management system (needs mechanical ventilation).

**Narration:**
Solutions already exist. Portable monitors like the Aranet4 cost around two hundred euros each,
and show the value in one room only. Cloud products from Airthings or Netatmo store the data with the vendor.
Many German schools built simple CO₂ traffic lights, but they don't save any data.
And a professional building management system needs mechanical ventilation,
which most older schools simply don't have.

## 4. What makes our solution different (≈ 25 s)

**Visuals:** four ticks appearing one by one: central dashboard · ~€51 per room · open source, no licence fees · data stays on campus.

**Narration:**
Our solution combines the best of these ideas: a traffic light in every classroom, plus one central
dashboard for the whole building, with history and statistics. It needs about fifty euros of hardware
per room, it uses only open-source software with no licence fees, and the data stays on the
university's own server.

## 5. How it works (≈ 45 s)

**Visuals:** animated architecture diagram; a message "packet" travels
Sensor → MQTT broker → Node-RED → PostgreSQL → Grafana; the threshold table appears at the Node-RED step.

**Narration:**
Here's how it works. In every classroom, a small sensor node, an ESP32 microcontroller with a Sensirion
CO₂ sensor, measures carbon dioxide, temperature and humidity. It sends each reading as a short JSON message
over MQTT to a Mosquitto broker. Node-RED subscribes to these messages, checks the values, and classifies
the air. Below one thousand ppm is good. Up to fourteen hundred means: ventilate soon. Above that: ventilate now.
Every reading is stored in a PostgreSQL database, and Grafana turns the data into a live dashboard.
The whole server side runs in Docker, and starts with a single command.

## 6. Live demo (≈ 45 s)

**Visuals:** screen recording of the Grafana dashboard (kiosk mode), with zoom-ins and highlight boxes
on the traffic lights, the CO₂ chart and the bar chart.

**Narration:**
This is the dashboard, running live. For the demo, the sensors are simulated in Node-RED, and they send
exactly the same MQTT messages a real device would. At the top, every classroom has its own traffic light.
When a room passes one thousand ppm, it turns yellow, and above fourteen hundred, red.
The chart below shows the typical saw-tooth pattern: CO₂ rises during the lesson, someone opens the window,
and it drops again. And the bars at the bottom show how much of the time each room needed fresh air,
so facility management knows where to act first.

## 7. Hardware (≈ 25 s)

**Visuals:** exploded view of the sensor node with labels and prices:
ESP32-C3 €6 · SCD41 €30 · LED ring €4 · USB power €6 · 3D-printed case €5 = €51.

**Narration:**
In a real deployment, each classroom gets one sensor node: an ESP32-C3 board, the SCD41 sensor,
an LED ring for the traffic light, a USB power supply, and a 3D-printed case. It sends a reading every minute,
and sets the LED itself, so the light keeps working even if the network is down.

## 8. Costs (≈ 30 s)

**Visuals:** cost table: pilot (3 rooms) €191 initial / €411 per year;
rollout (30 rooms) €1,905 initial / €810 per year / €27 per room per year; comparison bar: 30 × Aranet4 ≈ €5,970.

**Narration:**
What does it cost? For a pilot with three classrooms, hardware and installation come to about
one hundred ninety euros, and running it for a year to about four hundred. For a whole building
with thirty classrooms, it's about nineteen hundred euros up front, and around eight hundred per year.
That's roughly twenty-seven euros per classroom. For comparison, thirty commercial monitors alone would cost
almost six thousand euros. And since all the software is open source, there are no licence fees at all.

## 9. Closing slide (≈ 10 s)

**Visuals:** title, tagline "Fresh air, made visible.", team names, repository URL
github.com/witold-andelie/IOT.

**Narration:**
Smart Classroom Ventilation. Fresh air, made visible. Thank you for watching.
