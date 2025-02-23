# Joanna Picciano

## node.js Project
Project Description:
This project provides a Node.js server-side application that handles user accounts and weather API data. It uses Express as the web framework, and follows an MVC-style architecture with controllers and models. MongoDB is integrated using Mongoose.

### Installation & Setup

#### Node.js Dependencies:
express
```
npm install express
```
mongoose
```
npm install mongoose
```
body-parser
```
npm install express body-parser
```
express-session
```
npm install express-session
```
ejs
```
npm install ejs
```
bcryptjs
```
npm install bcryptjs
```
#### To set up and run:
Run MongoDB
```
sudo systemctl start mongod
```
Start the server
```
node Server/index.js
```
Access the site at: http://localhost:3000

### Current Issues
Flickering Login/Logout Button:
The login button briefly displays as "Login" before switching to "Logout" when a user is logged in and navigating between pages. This occurs because session data is applied after the page loads.

### Course Information
This project was developed as part of CMPT 221 - Software Development II at Marist College during the Fall 2024 semester.
It was completed under the guidance of Professor J. Arias.

### Notes
This project is a local development setup. If deploying to a live server, additional security and configuration settings may be required.
Contributions or suggestions for improvements are welcome!