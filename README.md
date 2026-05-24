# SyncTalk 🚀

SyncTalk is a modern, full-stack, real-time messaging application designed to provide instantaneous peer-to-peer communication. Built with a decoupled architectural style, it features a secure asynchronous backend framework and a fluid, glassmorphic dark-themed user dashboard. 

The system leverages persistent network pipes to handle immediate message delivery, real-time user presence tracking, and active typing states without requiring browser page refreshes.

---

## 📝 Project Description

SyncTalk acts as an isolated, high-performance chat network. When users access the system, they are greeted by an immersive login and registration gateway. Once authenticated, users enter a dual-panel split dashboard:

* **The Navigation Sidebar:** Displays the active logged-in user profile, an on-the-fly local directory search bar, and a live roster of all registered system peers showing their real-time connection status (Online/Offline).
* **The Interaction Chat Arena:** A dynamic stream surface area that automatically fetches historical chat lines upon selecting a contact, listens for incoming live message payloads, provides active "typing..." indicator alerts, and handles programmatic viewport scroll locking to anchor to the newest text bubbles.

---

## 🛠️ Technologies Used

The SyncTalk ecosystem is engineered using industry-standard, lightweight, and modern technology layers:

### 📡 Backend Infrastructure
* **FastAPI:** A high-performance, modern Python web framework used to construct the asynchronous REST API routing configurations and manage stateful WebSocket communication nodes.
* **Uvicorn:** A lightning-fast, production-ready ASGI web server implementation used to run the asynchronous backend lifecycle.
* **SQLAlchemy ORM:** Used as the Object-Relational Mapper to define strict relational data schema frameworks and handle object-based queries cleanly.
* **SQLite:** A lightweight, serverless, self-contained SQL database engine chosen for seamless local data storage and tracking user credentials and historical message records.

### 🔒 Security & Data Encryption
* **Direct Bcrypt Hashing:** Used to execute reliable, cryptographically sound byte-level password encryption before writing records to the database.
* **Python-Jose (JWT):** Utilized to sign, decode, and verify cryptographically secure JSON Web Tokens to establish protected routing guards, session verification, and secure handshake verification.

### 💻 Frontend Client Layer
* **React (Vite):** A components-based UI library compiled via Vite to leverage lightning-fast Hot Module Replacement (HMR) and optimized single-page routing structures.
* **Tailwind CSS:** Utilized to craft the user interface with premium custom glassmorphic sheets, gradient background lighting effects, smooth input animations, and completely responsive desktop/mobile layouts.
* **Lucide React:** A clean and consistent open-source iconography kit used for interface indicators, buttons, and system asset icons.

---
