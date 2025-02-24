class LoginModel {
    constructor() {
        this.users = [];
    }

    async usersData() {
        try {
            const res = await fetch(`https://fakestoreapi.com/users`);
            this.users = await res.json();
            console.log(this.users);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    }

    // Method to validate user login credentials using email and password
    loginFunctionality(email, password) {
        // Find the user by email
        const user = this.users.find(user => user.email === email);

        // Check if user exists and the password matches
        if (user && user.password === password) {
            // console.log('Login successful:', user);
            return user; // Return the user object on successful login
        } else {
            // console.error('Invalid email or password');
            return null; // Return null or handle failure case
        }
        
        return null;
    }

    logout() {
        // Clear user data from session storage
        sessionStorage.removeItem('loggedInUser');
        return true; // Return success status
    }

    getCurrentUser() {
        const userString = sessionStorage.getItem('loggedInUser');
        if (!userString) return null;
        
        try {
            return JSON.parse(userString);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
}
export default new LoginModel();
