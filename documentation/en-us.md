# INTEGRATOR PROJECT II: TECHNICAL DOCUMENTATION

**System Name:** Geek Management (GG)  
**Version:** 1.02  
**Responsible:** Vitória Rodrigues Ferreira

---

## 1. OVERVIEW

The **Geek Management** system was developed to meet the operational needs of the Geek Station store. Its main purpose is to optimize stock control, sales processing, and customer data management.

The solution is based on a modern web architecture, allowing management to obtain a panoramic view of store performance and stock levels, while providing attendants and cashiers with agile interfaces for customer service, sales processing, quick product lookups, and exchange management.

---

## 2. PROJECT DESCRIPTION AND USER PROFILES

The system integrates distinct features adapted to different access profiles. The central objective is the efficient management of information flow through robust registration and permission structures.

### 2.1. System Entities

The system will manage the following fundamental records:
* Employees
* Customers
* Products
* Sales

### 2.2. Access Profiles

* **Admin:** Highest level user, responsible for system maintenance and employee management.
* **Manager:** Responsible for store operations, reports, and supervision, with safeguards for deleting sensitive data (sales).
* **Attendant:** Focused on stock flow and customer registration.
* **Cashier:** Focused on finalizing sales and quick customer registration.

### 2.3. Permissions and Access Matrix

Below is the table detailing the authorization level for each main feature.

| Feature / Resource | Admin | Manager | Attendant | Cashier |
| :--- | :---: | :---: | :---: | :---: |
| **Employees** (Register/Edit) | Yes | Yes | No | No |
| **Customers** (Register/Edit) | Yes | Yes | Yes | Yes |
| **Products** (Register/Edit) | Yes | Yes | Yes | No |
| **Products** (Delete from Catalog) | Yes | Yes | Yes | No |
| **Sales** (Register New - POS) | Yes | Yes | No | Yes |
| **Sales** (View History) | Yes | Yes | Yes | Yes |
| **Sales** (Delete Record) | Yes | No | No | No |
| **Management Reports** | Yes | Yes | No | No |

---

## 3. FUNCTIONAL REQUIREMENTS (FR)

The functional requirements of the system are listed below, identified by unique codes.

**FR001 – Customer Registration**
The system must allow Attendant and Cashier profiles to register customers via a web form.
* **Mandatory data:** Name, CPF (Tax ID), phone number, and gender.

**FR002 – Product Registration**
The system must allow the Attendant profile to register new products in the stock.
* **Mandatory data:** Name, price, code, stock quantity, category, and description.

**FR003 – Sales Registration**
The system must allow the Cashier profile to register sales (Point of Sale).
* **Mandatory data:** Product, sale date, sale code, unit price (at the time of sale), quantity, and linked customer.

**FR004 – Employee Registration**
The system must allow Administrator and Manager profiles to register new employees and define their roles.
* **Mandatory data:** Name, CPF (Tax ID), CEP (Zip Code), street, number, complement, and role.

**FR005 – Customer Inquiry**
The system must allow the Administrator and all employees to view customer registration data.

**FR006 – Product Inquiry**
The system must allow the Administrator and all employees to view products with full details (price, stock, description).

**FR007 – Sales Inquiry**
The system must allow the Manager and employees to view details of previously completed sales.

**FR008 – Customer Management (Listing)**
The system must present a list (table/grid) with customer information.
* **Extra permissions:** Administrator or Manager users can edit and/or delete records from this table.

**FR009 – Product Management (Listing)**
The system must present a list with information on products in stock.
* **Extra permissions:** Administrator, Manager, and Attendant can edit and/or delete listed products.

**FR010 – Sales Management (Listing)**
The system must present a list containing the sales history.
* **Extra permissions:** Administrator or Manager users can edit information contained in the table. Only the Administrator can delete.

**FR011 – Catalog Maintenance**
The system must specifically allow the **Attendant** profile to add, edit, and remove products from the catalog to keep the inventory updated.

**FR012 – Payment Methods**
The system must process and record the following payment methods at the time of sale:
* Credit Card
* Debit Card
* Cash

---

## 4. NON-FUNCTIONAL REQUIREMENTS (NFR)

**NFR001 – Usability**
The web interface must be responsive, intuitive, and user-friendly, ensuring that users without advanced technical training can operate the system efficiently through the browser.

**NFR002 – Security**
* **Authentication:** Access to the system requires a login and password. Passwords must be stored with encryption (Hash) in the database.
* **Authorization:** The system must validate on the *Backend* if the request coming from the *Frontend* matches the logged-in user's role.
* **Integrity:** All financial transactions must be recorded in logs.

**NFR003 – Reliability**
The system must have regular database backup routines to mitigate data loss risks.

---

## 5. TECHNICAL SPECIFICATIONS AND DEVELOPMENT ENVIRONMENT

The project adopts a modern and modular architecture, divided between the production environment and development tools.

### 5.1. Architecture Diagram

```mermaid
graph TD
    User((User))
    Front[Front-end<br>Vite + Vanilla JS]
    Proxy[Vite Proxy]
    Mock[Mock Server<br>Node + Fastify]
    Java[Back-end API<br>Java Spring]
    DB[(MySQL Database)]

    User -->|Access| Front
    Front -->|Axios Requests| Proxy
    Proxy -.->|Dev Mode| Mock
    Proxy -->|Prod/Integ Mode| Java
    Java -->|JDBC/Hibernate| DB
    Mock -.->|Provisional Data| DB 
```

### 5.2. Production Architecture (Target)
* **Model:** Client-Server (RESTful API).
* **Back-end:** Java with JDBC and Hibernate.
* **Database:** MySQL.

### 5.3. Front-end Architecture (Client)
* **Language:** JavaScript (ES Modules), HTML5, and CSS3.
* **Build Tool:** **Vite**. Used for optimized bundling, asset management, and development server with *Hot Module Replacement* (HMR).
* **Communication:** **Axios** library for asynchronous HTTP requests.

### 5.4. Development Strategy (Mock Server)
To allow parallel Front-end development while the Java Back-end is being built, a provisional server is used:
* **Technology:** Node.js with Fastify and TypeScript.
* **Function:** Simulate Java API routes (Mock), receiving Axios requests, validating basic business rules, and returning fictitious or temporarily persisted JSON data.

---

## 6. PROJECT STRUCTURE (MONOREPO)

The source code is organized in a **Monorepo** format using **NPM Workspaces**. This allows managing both the Front-end and the Mock Server in the same repository, sharing configurations and simplifying script execution.

**Directory Structure:**

```text
📦 GGeek
├─ .gitignore
├─ README.md
├─ docker-compose.yml  (Infrastructure: Database & Containers)
├─ package.json        (Root: Orchestrates scripts and workspaces)
└─ packages
    ├─ front           (Web App - Vite/JS)
    │   ├─ vite.config.js
    │   └─ src/
    │
    ├─ mockserver      (Test API - Fastify/Node)
    │   ├─ src/
    │   └─ index.ts
    │
    └─ backend         (Production API - Java)
        ├─ src/
        └─ pom.xml
```

---

# 🛠️ How to Run

To run this project locally, follow these steps.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Java JDK (v17+ for Backend development)

## Installation

Install all dependencies for the monorepo (Front & Mock):
```bash
npm install
```

## Running the Environment

Start the Database:
```bash
npm run db:up
```

Start Development Servers (Front + Mock):
```bash
npm run dev:mock
```