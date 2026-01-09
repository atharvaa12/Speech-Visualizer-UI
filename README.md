

# 🌌 Circular Audio Visualizer

A **real-time circular audio visualizer** built with pure HTML, CSS, and JavaScript.
It reacts live to microphone input, creating glowing radial spectrums, bass pulses, and neon ambience.

> No frameworks. No libraries. Just raw Web Audio API + Canvas.

---

## ✨ Features

* 🎤 Live microphone audio capture
* 🔵 Circular frequency spectrum visualization
* 🌈 Dynamic rainbow bars with glow effects
* 📱 Responsive scaling for any screen size


---

## 🛠 Tech Stack

| Layer    | Tech                         |
| -------- | ---------------------------- |
| UI       | HTML5, CSS3                  |
| Audio    | Web Audio API                |
| Graphics | Canvas 2D                    |
| Fonts    | Orbitron, Inter              |
| Runtime  | Browser (no server required) |

---

## 📂 Project Structure

```
/
├─ index.html
├─ style.css
└─ visualizer.js
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourusername/circular-audio-visualizer.git
cd circular-audio-visualizer
```

### 2️⃣ Open in browser

Just open `index.html` in any modern browser (Chrome, Edge, Firefox).

### 3️⃣ Grant Microphone Access

Click **Start Recording** and allow mic permission.
Your voice/music will immediately drive the visualizer.

---

## 🎛 How It Works

* Microphone input is captured using `getUserMedia()`
* Audio is passed through a GainNode for extra intensity
* An `AnalyserNode` extracts frequency data
* Canvas draws glowing radial bars based on frequency power
* Low-frequency bins drive the central pulse animation

---

## 🖼 Visual Behavior

| Sound   | Effect                       |
| ------- | ---------------------------- |
| Bass    | Expands glowing center pulse |
| Treble  | Long neon spectrum spikes    |
| Silence | Ambient idle glow            |

---



