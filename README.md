<div align="center">
  <h1>🚀 HireUs</h1>
  <p><strong>A Modern, Full-Stack Job Board & Application Platform</strong></p>

  [![React](https://img.shields.io/badge/React-19.2-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![Java](https://img.shields.io/badge/Java-21-ED8B00.svg?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Redis](https://img.shields.io/badge/Redis-7-DC382D.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

  <br />
</div>

## 📖 Overview

**HireUs** is a comprehensive job portal designed to bridge the gap between job seekers (candidates) and employers (recruiters). It features a robust **Spring Boot (Java 21)** backend with secure **JWT authentication**, connected to a **PostgreSQL** database, and utilizes **Redis** for caching and rate limiting. The frontend is a snappy, modern interface built with **React and Vite**.

## ✨ Features

- **👥 Dual User Roles**
  - **Candidates:** Browse jobs, search by title/location, submit applications, and track application status on a personalized dashboard.
  - **Recruiters:** Post new job openings, review submitted applications, and access a recruiter-specific dashboard.
- **🔒 Secure Authentication:** JWT-based login and signup flow.
- **📊 Analytics Dashboard:** Simple analytics for total applications.
- **🛡️ Rate Limiting:** Built-in rate limiting using Bucket4j and Redis.
- **📚 API Documentation:** Integrated Swagger UI for easy API exploration and testing.

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot** (Data JPA, Web, Security, Validation)
- **PostgreSQL** (Primary Database)
- **Redis** (Caching & Rate Limiting)
- **JWT** (JSON Web Tokens via jjwt)
- **Swagger / OpenAPI** (springdoc)
- **Bucket4j** (Rate Limiting)

### Frontend
- **React 19**
- **Vite**
- **React Router**
- **Lucide React** (Icons)
- **Axios**

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Java 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Node.js](https://nodejs.org/en/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/) (For running Postgres & Redis locally)

### 1. Environment Setup

Copy the example environment file to create your own configuration:

```bash
cp .env.example .env
```
*(Update `.env` with your specific database/redis credentials if needed, though the defaults work with the provided Docker setup).*

### 2. Start Infrastructure (Database & Redis)

Run the provided Docker Compose file to spin up PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

### 3. Run the Backend (HireUs API)

Navigate to the `hireus-api` directory and start the Spring Boot server using Maven:

```bash
cd hireus-api
./mvnw clean compile
./mvnw spring-boot:run
```
*The backend will start on `http://localhost:8080`.*

### 4. Run the Frontend (HireUs Web)

In a new terminal window, navigate to the `hireus-web` directory, install dependencies, and start the Vite dev server:

```bash
cd hireus-web
npm install
npm run dev
```
*The frontend will be accessible at `http://localhost:5173`.*

---

## 📚 API Documentation

Once the backend is running, you can explore and interact with the REST APIs using the built-in Swagger UI:

👉 **[Swagger UI: http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
