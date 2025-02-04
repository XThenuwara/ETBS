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
- [done] ETBS-04-001 - Write unit tests for ticket booking logic (TDD)  ]
- [done] ETBS-04-002 - Implement ticket booking endpoint  
- [done] ETBS-04-003 - Handle concurrent ticket bookings and prevent overselling  
- [done] ETBS-04-004 - Modify Test cases for concurrent ticket bookings and prevent overselling

### ETBS-05-000 - Ticket Cancellation & Reassignment  
- [done] ETBS-05-001 - Write unit tests for ticket cancellation and reassignment (TDD)  
- [done] ETBS-05-002 - Implement ticket cancellation and automatic reassignment  

### ETBS-06-000 - Viewing Information  
- [done] ETBS-06-001 - Write unit tests for viewing available tickets and waiting list (TDD)  
- [done] ETBS-06-002 - Create endpoints to view available tickets and waiting list  

### ETBS-07-000 - Security & Error Handling  
- ETBS-07-001 - Implement proper error handling and edge case management  
- ETBS-07-002 - Apply API input validation and request sanitization  

### ETBS-08-000 - Design a Simple Frontend
- ETBS-08-001 - Design a simple frontend for the ticket booking system
- ETBS-08-002 - Integrate the frontend with the backend API