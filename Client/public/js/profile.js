/* Profile Page Script */
// No DOM loader used

/* Handle Profile Form Submission */
document.getElementById("profileForm").addEventListener('submit', async function (event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value; // Get the user's ID

    const formData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        zipCode: document.getElementById('zipCode').value,
        zipCodePref: document.getElementById('zipCodePref').value,
    };

    console.log('Submitting profile update for user:', userId);
    console.log('Updated Profile Data:', formData);

    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        // what is happening?
        console.log('Form Data:', formData);
        console.log('Response Status:', response.status);
        console.log('Response Data:', result);
        
        if (response.ok) {
            console.log('Profile successfully updated:', result);

            // Update form fields dynamically with the new data
            ['email', 'firstName', 'lastName', 'dob', 'phoneNumber', 'zipCode', 'zipCodePref'].forEach(field => {
                document.getElementById(field).value = result[field];
            });

            alert('Profile updated successfully!');
        } else {
            console.error('Error updating profile:', result);
            alert(result.message || 'Failed to update profile.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while updating your profile.');
    }
});
