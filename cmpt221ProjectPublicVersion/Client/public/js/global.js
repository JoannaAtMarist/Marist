/* Global script for all pages */

/* Check for User Login Status */
(async () => {
    try {
        console.log("Checking session status"); // what is happening? 

        const response = await fetch('/api/session/status');
        const status = await response.json();

        console.log("Session status response:", status); // what is happening?

        const loginBtn = document.getElementById("loginBtn");
        const membersBtn = document.getElementById("membersBtn");

        if (status.loggedIn) {
            // User is logged in: Change Login button to Logout
            loginBtn.textContent = "Logout";
            loginBtn.addEventListener("click", async () => {
                try {
                    const logoutResponse = await fetch('/api/user/logout', { method: 'POST' });
                    if (logoutResponse.ok) {
                        alert("You have been logged out.");
                        window.location.href = "/login"; // Redirect to login after logout
                    } else {
                        alert("Logout failed.");
                    }
                } catch (error) {
                    console.error("Error during logout:", error);
                }
            });

            // Show the Members button when logged in
            membersBtn.style.display = "inline";

        } else {
            // User is not logged in: Keep Login functionality
            loginBtn.textContent = "Login";
            loginBtn.addEventListener("click", () => {
                window.location.href = "/login";
            });

            // Hide the Members button
            membersBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching session status:", error);
    }
})();

/* Navigation Buttons */
document.addEventListener("click", event => {
    const pageRoutes = {
        "homeBtn": "/home",
        "registrationBtn": "/registration",
        "profileBtn": "/profile",
        "membersBtn": "/members"
    };

    if (pageRoutes[event.target.id]) {
        window.location.href = pageRoutes[event.target.id];
    }
});

/* Back Button: Allows users to return to the previous page */
const backBtn = document.getElementById("backBtn");
if (backBtn) {
    backBtn.addEventListener("click", (e) => {
        history.go(-1);
    });
}
