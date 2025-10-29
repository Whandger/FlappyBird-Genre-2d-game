# 🐦 Flappy Bird Clone

A simple yet polished **Flappy Bird-style game** built with **HTML**, **CSS**, and **JavaScript**.  
Fly through obstacles, score points, and enjoy smooth animations with realistic gravity and motion physics.

---

## 🎮 Features

- 🕹️ **Keyboard & Touch Controls** — Press **Space** or tap the screen to make the bird jump.  
- 🌍 **Infinite Scrolling Background** — Seamless scene movement for a continuous gameplay feel.  
- 🪶 **Smooth Bird Rotation** — Bird tilts up and down dynamically based on its velocity.  
- 🎯 **Score System** — Earn points each time you pass an obstacle.  
- 🔄 **Restart Button** — Appears automatically when the game ends.  
- 🔊 **Sound Effects** — Jump and score sounds stored in the `/sound` folder.

---

## 🧩 Technologies Used

### 🧱 HTML
A minimal structure containing:
- Game area (`<div id="gameArea">`)
- Obstacles, bird, and restart/start buttons.

### 🎨 CSS
Simple but effective styling for:
- Game layout and background.
- Obstacle and bird positioning.
- Basic animations and transitions.
- Background image setup for the infinite scrolling effect.

### ⚙️ JavaScript
Handles all the game logic:
- Physics (gravity, velocity, collision detection).
- Scoring and obstacle repositioning.
- Background movement using `transform` and smooth rotation with `rotate()`.
- Event listeners for keyboard (`keydown`) and mobile (`touchstart`) input.

---

## 🗂️ Project Structure

