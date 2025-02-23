/* Login Page Script */


/* Display Login Message if Redirected */
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
        alert(message); // Show the redirect message as an alert
    }
});

/* Handle Login Form Submission */
const loginForm = document.login_form;

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const jsonData = JSON.stringify(formData); // Convert form data to JSON

    // Send login request to the server
    fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            console.log('Server response:', data);

            // Redirect to profile page if login is successful
            if (data.success) {
                window.location.href = '/profile';
            } else {
                alert(data.message); // Display error message
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            // Handle errors 
        });
});