# 🏪 Inventory Management API

A scalable, multi-tenant **Inventory Management System** built with a **microservices architecture** using **NestJS**, **gRPC**, **GraphQL**, and **REST**. Designed to support separate API gateways for **store owners** and **admins**, with domain-driven service boundaries, robust RBAC, and event-driven messaging.

---

## 📌 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Getting Started](#getting-started)
* [Microservices Overview](#microservices-overview)
* [API Gateways](#api-gateways)
* [Authentication](#authentication)
* [Events & Messaging](#events--messaging)
* [Planned Features](#planned-features)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

---

## ✨ Features

* 🧱 Microservices architecture with gRPC internal communication
* 🌐 REST & GraphQL API exposure for external clients
* 🔐 Role-based access control (RBAC) per store
* 🛒 Store-level user management
* 🛆 Product CRUD, stock levels, category management
* 🗒 Inventory tracking and webhook/event-based sync (WIP)
* 📊 Analytics module (WIP)
* 📡 Separate API Gateways for **Store** and **Admin** (BFF-style architecture)

---

## 🛠 Tech Stack

| Layer             | Tech Used                           |
| ----------------- | ----------------------------------- |
| Backend Framework | NestJS                              |
| Communication     | gRPC, REST, GraphQL                 |
| Database          | PostgreSQL, Redis                   |
| Messaging Queue   | RabbitMQ                            |
| Auth              | JWT, RBAC                           |
| Containerization  | Docker, Docker Compose              |
| DevOps            | GitHub Actions, Terraform (planned) |

---

## 🏗 Architecture

\[Replace this section with an architecture diagram image.]

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* Docker & Docker Compose
* PostgreSQL
* RabbitMQ

### Clone the Repo

```bash
git clone https://github.com/iamarvy/inventory-management-api.git
cd inventory-management-api
```

### Install Dependencies

```bash
npm install
```

### Run Services via Docker

```bash
docker-compose up --build
```

### Run Locally (Individually)

```bash
cd services/auth
npm run start:dev
```

---

## 🧰 Microservices Overview

| Service              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| Auth Service         | Handles authentication, authorization, and token issuance  |
| Product Service      | Manages product CRUD and inventory levels                  |
| Store Service        | Manages stores, store-specific users, and roles            |
| Notification Service | Handles event-based messaging and notifications (optional) |

---

## 🌐 API Gateways

### Store Gateway

* REST/GraphQL interface for store users (owners, managers)
* Access product inventory, roles, and store settings

### Admin Gateway

* Interface for global admins
* Manage stores, view analytics, perform high-level operations

---

## 🔐 Authentication

* JWT-based authentication strategy
* Role-based access enforced at the store and service level
* Uses NestJS guards and decorators for secure API access

---

## 📬 Events & Messaging

* Uses RabbitMQ for service decoupling and async communication
* Inventory updates, notifications, and events passed via message queues
* Future support for webhook broadcasting to third-party systems

---

## 🗝 Planned Features

* [ ] Inventory analytics dashboard
* [ ] Admin audit logs
* [ ] Multi-language support
* [ ] Public API token system for store owners
* [ ] Multi-currency pricing and conversion
* [ ] Webhook subscription system

---

## 📁 Project Structure

```bash
/services
  ├── auth/
  ├── products/
  ├── store/
  ├── notifications/
  └── common/          # Shared DTOs, interfaces
/gateways
  ├── store-gateway/
  └── admin-gateway/
/proto                 # gRPC proto definitions
/docker                # Docker-related configs
```

---

## 🤝 Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

<!-- This project is licensed under the MIT License. -->
© 2025 Oluwaseyi Oke