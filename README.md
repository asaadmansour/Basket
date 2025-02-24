# Basket - E-Commerce Website

## Overview
Basket is a fully functional e-commerce website built with JavaScript, leveraging the MVC (Model-View-Controller) architecture. It allows users to log in, choose their location using an interactive map, edit user data, add products to their cart, calculate the total cost, and proceed with payments using Stripe's test mode. The project integrates external APIs like Fake Store API for user authentication and Stripe for payment processing.

## Features
- **User Authentication:** Log in using Fake Store API credentials.
- **Location Selection:** Interactive Mapbox-based map for selecting and saving the user's location.
- **Cart System:** Add and remove items, view total cost, and update cart dynamically.
- **User Profile Management:** Edit and save user details after login.
- **Payment Integration:** Test Stripe payments using test card details.
- **MVC Architecture:** Code structured with separate concerns for Model, View, and Controller.
- **Responsive Design:** Works across different devices.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Map Integration:** Mapbox GL JS
- **API Integration:** Fake Store API for authentication and product data
- **Payment Gateway:** Stripe (Test Mode)
- **Version Control:** Git & GitHub
- **Hosting:** Netlify

## Folder Structure
Basket/ │── index.html # Main entry point │── styles/ # Contains all CSS files │── js/ │ ├── models/ # Data handling logic (Fake Store API, cart management) │ ├── views/ # UI rendering logic (Login, cart, map, checkout) │ ├── controllers/ # Connects models & views (User actions, form handling) │ ├── config.js # API keys & settings │── assets/ # Images & icons │── .gitignore # Excludes node_modules and API keys │── README.md # Documentation

## How to Run the Project Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/asaadmansour/Basket.git
Navigate to the project folder:
sh
Copy
Edit
cd Basket
Open index.html in your browser.
Alternatively, use Live Server (VS Code extension) for a better experience.
How to Test the Website
Log in with Fake Store API Users
Open Fake Store API Users.
Choose a user and copy their username and password.
Enter the credentials on the login page.
After logging in, you can edit and save user details.
Selecting a Location on the Map
Navigate to the map feature.
Click on your desired location.
Save the selected location.
Testing the Payment System
Add items to the cart.
Proceed to checkout.
Use the following Stripe test card for payment:
Card Number: 4242 4242 4242 4242
Expiration Date: Any future date
CVC: Any 3-digit number
ZIP Code: Any value
Submit the payment and check for a successful transaction message.
Live Demo
Check out the live version of the website: Basket on Netlify

Best Practices Followed
Separation of Concerns: The project follows MVC architecture, keeping business logic separate from UI rendering.
Modular Code: JavaScript files are structured into models, views, and controllers for maintainability.
Secure API Handling: API keys are stored in config.js and ignored in Git.
Responsive Design: Uses CSS best practices to ensure mobile compatibility.
Version Control: Git and GitHub used for tracking changes and collaboration.
Future Improvements
Implement a backend for real user authentication.
Enhance security measures for handling payments.
Improve UI/UX with better animations and transitions.
Author
Developed by Asaad Mansour as a JavaScript project to enhance frontend development skills and integrate real-world APIs.

