// Get all stars and the submit button
const stars = document.querySelectorAll('.star');
const submitButton = document.getElementById('submit-feedback');
const thankYouMessage = document.getElementById('thank-you-message');
const commentBox = document.getElementById('comment-box');

// Set up the event listeners for each star
stars.forEach(star => {
    star.addEventListener('click', () => {
        // Remove 'selected' class from all stars
        stars.forEach(star => star.classList.remove('selected'));

        // Add 'selected' class to the clicked star and all previous stars
        const rating = star.getAttribute('data-value');
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('selected');
            }
        });
    });
});

// Handle feedback submission
submitButton.addEventListener('click', () => {
    const selectedStar = document.querySelector('.star.selected');
    const comment = commentBox.value.trim();

    if (selectedStar) {
        // Show thank you message
        thankYouMessage.classList.remove('hidden');
        submitButton.disabled = true;  // Disable the button after submission

        // Optionally: You could save the feedback data (rating + comment) here
        console.log('Rating:', selectedStar.getAttribute('data-value'));
        console.log('Comment:', comment);

        // Wait for a few seconds before redirecting to the home page
        setTimeout(() => {
            window.location.href = "garage2.html";  // Redirect to the home page
        }, 2000);  // Delay of 2 seconds for showing the thank-you message
    } else {
        alert("Please select a rating!");
    }
});
