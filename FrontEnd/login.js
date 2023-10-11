document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login_form');
    const errorParagraph = document.querySelector('.error');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token;

                    if (token) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('authToken', token);
                        window.location.href = './index.html';
                    } else {
                        // Display an error message if login fails
                        errorParagraph.textContent = 'Invalid email or password. Please try again.';
                    }
                } else {
                    // Display an error message if the server response is not OK
                    errorParagraph.textContent = 'Invalid email or password. Please try again.';
                }
            } catch (error) {
                console.error('Error during authentication:', error);
                // Handle any network or request-related errors here.
            }
        });
    }
});
