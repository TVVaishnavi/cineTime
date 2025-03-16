# CineTime

## Description

This repository contains both the backend and frontend for the CineTime application. The backend is built using Express.js for the server, MongoDB for the database, and Jest for unit testing. The frontend is developed using React.js with HTML/CSS for the user interface. Users can sign up and log in, browse movies, select theatres, choose seats, and book tickets. The application also includes a user profile page. Admins can directly log in to manage the system. For UI testing, Cypress is used, and Percy is integrated for visual testing.

## Features

* **User Authentication**: Users can sign up and log in to their accounts.
* **Admin Authentication** : Admins can log in directly.
* **Movie and Theatre Listings**: Users can browse available movies and theatres.
* **Seat Selection and Ticket Booking** :
* Users can select available seats and book tickets for movies.
* There is a time limit for selecting seats. If the booking isn't completed within the time limit, the seat selection is undone.
* **Ticket Cancellation**: Users can cancel their booked tickets.

## Installation

To install and run this project locally:

* Clone the repository:
  bash

```
git clone https://github.com/TVVaishnavi/cineTime.git
cd cineTime
```

* Install dependencies:

  bash

```
npm install
```

* Set up environment variables:

  bash

```
cp.env.example .env
# Update .env with your database credentials and other settings
```

* Start the server:

  bash

```

cd Backend
npm run dev
```

* Start the app:
  bash

  ```
  cd frontend
  npm start
  ```

## Usage

To run the application:

1. Ensure MongoDB is running.
2. User Postman or any API client to interact with the backend.
3. Example API requests:
   signup:
   bash

```
POST /api/signup
```

* Login:
  bash

```
POST /api/login
```

## Support

For support, you can reach out via:

* Issue tracker: GitHub Issues
* Email: vaishnavitvenkatesh@gmail.com

## Roadmap

### ✅ Phase 1: Initial Setup

* [X] Set up **Express.js** for backend
* [X] Set up **Reactjs** for frontend
* [X] Configure **MongoDB** for data storage
* [X] Implement **User Authentication** (Signup/Login)
* [X] Implement **Admin Login**

### 🚀 Phase 2: Core Features

* [X] Fetch **Movies & Theatres**
* [X] Implement **Seat Selection with Timer**
* [X] Enable **Ticket Booking & Cancellation**

### 🔧 Phase 3: Enhancements & Testing

* [X] Implement **Seat Auto-Unselect After Timeout**
* [X] Write **Unit Tests with Jest**

## Contribution:

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add some feature'`.
5. Push to the branch: `git push origin feature-name`.
6. Open a pull request.

## Author and Acknowledgment

* Vaishnavi - Initial work - [TVVaishnvai](https://github.com/TVVaishnavi)
