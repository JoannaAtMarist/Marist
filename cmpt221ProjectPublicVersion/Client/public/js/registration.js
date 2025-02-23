/* Registration Page Script */
// No DOM loader used


/* Handle Registration Form Submission */
const regForm = document.getElementById('regForm');

regForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        zipCode: document.getElementById('zipCode').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    console.log('Submitting form data:', formData); // what is happening?

    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registration successful:', data);
            alert('Registration successful!');
            window.location.href = '/login'; // Redirect to login page
        } else {
            console.error('Registration failed:', data);
            alert(data.message || 'Registration failed.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    }
});
