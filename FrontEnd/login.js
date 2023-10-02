// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the login form element and error paragraph element
    const loginForm = document.getElementById('login_form');
    const errorParagraph = document.querySelector('.error');
    if(loginForm){
    // Add a submit event listener to the login form
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      // Get the user's input email and password
      const email = loginForm.email.value;
      const password = loginForm.password.value;
     
      const token = await authenticateUser(email, password);
     // if (isAuthenticated) {
      if(token){
        // Set the login status in local storage
        localStorage.setItem('isLoggedIn', 'true');
        //Store the token
        localStorage.setItem('authToken', token);
        // Redirect to the index page after successful login
        window.location.href = './index.html';    
      } else {
        // Display an error message if login fails
        errorParagraph.textContent = 'Invalid email or password. Please try again.';
      }
    });
  }
  });
  // Function to authenticate the user
  async function authenticateUser(email, password) {
    //  making a request to the authentication API
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
        const token = data.token; // Assuming the token is returned in the response
        return token; // Return the authentication token
                   
      } else {
            // return null;
            throw new Error('Authentication failed'); // Throw an error on authentication failure
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      // return false;
      throw error; // Re-throw the error to handle it elsewhere if needed
 
 
    }
  }
