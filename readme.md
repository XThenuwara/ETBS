## Project Roadmap: Event Ticket Booking System

### ETBS-01-000 - Environment Setup  
- [done] ETBS-01-001 - Set up Node.js and Express.js project structure  
- [done] ETBS-01-002 - Configure TypeScript, ESLint, and Prettier for code consistency and Jest for testing

### ETBS-02-000 - Database & Migrations  
- [done] ETBS-02-001 - Design and integrate the database and RDBMS schema for user, event, bookings, and waiting list,
- [done] ETBS-02-002 - Implement migrations mechanism for database schema  

### ETBS-03-000 - Event Initialization  
- [done] ETBS-03-001 - Write unit tests for event initialization (TDD)
- [done] ETBS-03-002 - Implement event initialization with available tickets  

### ETBS-04-000 - Ticket Booking  
- ETBS-04-001 - Write unit tests for ticket booking logic (TDD)  
- ETBS-04-002 - Implement ticket booking endpoint  
- ETBS-04-003 - Handle concurrent ticket bookings and prevent overselling  

### ETBS-05-000 - Waiting List Management  
- ETBS-05-001 - Write unit tests for waiting list management (TDD)  
- ETBS-05-002 - Implement waiting list for sold-out events  

### ETBS-06-000 - Viewing Information  
- ETBS-06-001 - Write unit tests for viewing available tickets and waiting list (TDD)  
- ETBS-06-002 - Create endpoints to view available tickets and waiting list  

### ETBS-07-000 - Ticket Cancellation & Reassignment  
- ETBS-07-001 - Write unit tests for ticket cancellation and reassignment (TDD)  
- ETBS-07-002 - Implement ticket cancellation and automatic reassignment  

### ETBS-08-000 - Security & Error Handling  
- ETBS-08-001 - Implement proper error handling and edge case management  
- ETBS-08-002 - Apply API input validation and request sanitization  