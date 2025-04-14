# Service Management UI

This project serves as the web interface for the `service-management-api` project. 
The backend repository built with Java 24 + Spring + MongoDB can be accessed here:
https://github.com/cagritrk/service-management-api

The project manages Service objects with the following operations:

- Add a new service
- Update an existing service
- Delete an existing service

These operations can be performed through the web interface.

The project is built with Angular 19 using standalone components.

Two profiles are available:
- development (environment.development.ts)
- production (environment.ts)

## Features Demonstration
### 1. Create Service
![service-manager-app-demo](https://github.com/user-attachments/assets/ce5070bd-4cf4-4f38-9ec6-7a32f07d5ae4)
### 2. Update Service
![service-manager-app-demo-update](https://github.com/user-attachments/assets/1f55842b-db88-4d78-8568-1a0a2a40aa1c)

## Requirements

- Node.js (v^18.19.1 or newer)
- npm

## How to Run the Project

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Quick Start with Bash Script (Local)

For quick local development, you can use the `run-dev.sh` script which performs these steps automatically.

1. Make the script executable:
   ```bash
   chmod +x run-dev.sh
   ```
2. Run the script:
   ```bash
   ./run-dev.sh
   ```
