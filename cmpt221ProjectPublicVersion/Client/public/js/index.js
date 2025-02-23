/* Index/Splash Page Script */
// No DOM loader used


/* Press spacebar to continue */
document.addEventListener("keypress", (e) => {
    if (e.key == " ")
        goHome();
});

/* Click "Continue" to go to home page */
document.getElementById("continue").addEventListener("click", goHome);

/* Tap anywhere on touch devices to continue */
document.addEventListener("touchstart", () => {
    goHome();
});

/* Redirects user to the home page */
function goHome() {
    window.location.href = "/home";
}