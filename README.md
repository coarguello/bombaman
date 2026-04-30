<div align="center">
  <h1>💣 Bombaman</h1>
  <p><strong>A modern, fast-paced web clone of the classic Bomberman arcade game.</strong></p>
</div>

## 🎮 Overview

Bombaman is a fully playable web-based arcade game built with modern frontend technologies. It features grid-based movement, destructible environments, multiple enemy AI types, and a progressive upgrade system.

## ✨ Features

- **Classic Gameplay:** Navigate the grid, place bombs, and blow up crates and enemies.
- **Dynamic AI:** Face 5 different types of enemies with unique behaviors:
  - 🟠 **Ballom:** Random movement.
  - 🔵 **Onil:** Chases the player directly.
  - ⚪ **Ghost:** Moves slowly but passes through solid crates.
  - 🔴 **Sprinter:** Extremely fast movement.
  - 🟣 **Smart:** Chases the player while actively avoiding bomb blasts.
- **Progression System:** Unlock passive upgrades (speed boosts, increased explosion radius) automatically as you destroy more crates across levels.
- **Responsive Design:** The game grid scales dynamically to fit your browser window.

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React
- **Build Tool:** Vite 6

## 🚀 Run Locally

**Prerequisites:**  Node.js (v18+)

1. Clone the repository:
   ```bash
   git clone https://github.com/coarguello/bombaman.git
   cd bombaman
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000/`.

## ⌨️ Controls

- **Arrow Keys:** Move Up, Down, Left, Right
- **Spacebar:** Place Bomb

## 🏆 How to Win

1. Destroy crates to find the hidden exit portal.
2. Eliminate all enemies on the level to unlock the portal.
3. Enter the portal to proceed to the next level!
