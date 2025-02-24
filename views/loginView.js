import loginModel from "../model/loginModel.js";
import homeView from "./homeView.js";
import toastView from "./toastView.js";
class LoginView {
    constructor() {
        // You can initialize DOM elements in the constructor if needed
        this.emailInput = document.getElementById('login-email');
        this.passwordInput = document.getElementById('login-password');
        this.loginButton = document.getElementById('login-button'); // Assuming you have a login button
        this.messageBox = document.getElementById('login-message'); // Message element
        this.logoutModal = document.getElementById('logout-confirm-modal');
        this.modallogin = document.getElementById('login-modal');
        this.confirmBtn = document.querySelector('.confirm');
        this.isLoading = false; // Add loading state
    }

    getLoginInput() {
        // Returns an object containing the current input values
        return {
            email: this.emailInput.value,
            password: this.passwordInput.value
        };
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        if (loading) {
            this.loginButton.disabled = true;
            this.loginButton.style.backgroundColor = '#ccc';
            this.loginButton.textContent = 'Logging in...';
        } else {
            this.loginButton.disabled = false;
            this.loginButton.style.backgroundColor = '#ef233c';
            this.loginButton.textContent = 'Login';
        }
    }

    addHandlerLogin(handler) {
        this.loginButton.addEventListener('click', async (event) => {
            event.preventDefault();
            
            // Prevent multiple clicks while loading
            if (this.isLoading) return;
            
            // Set loading state
            this.setLoadingState(true);
            
            try {
                await handler(this.getLoginInput());
            } catch (error) {
                console.error('Login error:', error);
                this.displayMessage('An error occurred during login.', false);
            } finally {
                // Reset loading state
                this.setLoadingState(false);
            }
        });
    }
    displayMessage(message, isSuccess) {
        // Get the spinner element
        const spinner = document.getElementById('loading-spinner');
        
        // Show the spinner
        spinner.classList.remove('hidden');
        
        // Hide the spinner after 1 second and show the message
        setTimeout(() => {
            spinner.classList.add('hidden');
            // Display the message

    
            // Auto-hide the message after an additional 2 seconds
            setTimeout(() => {
                if (isSuccess) {
                    toastView.success(message)
                    this.clearMessage();
                    this.renderlogin()
                    homeView.modallogin.classList.toggle('active');
                    homeView.modallogin.classList.toggle('hidden');
                    this.emailInput.value = '';
                    this.passwordInput.value = '';
                } else {
                    this.passwordInput.value = '';
                    toastView.error(message)
                }
            }, 1000); // Message stays for 2 seconds
        }, 500); // Spinner is shown for 1 second
    }
    renderlogin() {
        const userstring = sessionStorage.getItem('loggedInUser');
        const user = JSON.parse(userstring);
        
        const markup = `
            <a href="#">
                <i class="fa fa-user"></i> 
                ${user.name.firstname} 
                <i class="fa-solid fa-caret-down"></i>
            </a>
            <ul class="dropdownlist hidden">
                <li class="manage"><a href="#">Manage Account </a></li>
                <li class="signout"><a href="#">Sign Out </a></li>
            </ul>`;
        
        homeView.account.textContent = ''; // Clear existing content
        homeView.account.insertAdjacentHTML('beforeend', markup);
        const newDropdownList = homeView.account.querySelector('.dropdownlist');
        const manageButton = homeView.account.querySelector('.manage');
    
        // Reattach dropdown toggle
        homeView.toggleButtons(homeView.account, newDropdownList);
        
    }
    // renderDefaultState() {
    //     const markup = `
    //         <a href="#">
    //             <i class="fa fa-user"></i> 
    //             Account
    //             <i class="fa-solid fa-caret-down"></i>
    //         </a>
    //         <ul class="dropdownlist hidden">
    //             <li class="login"><a href="#">Log In<i class="fas fa-sign-in-alt"></i> </a></li>
    //             <li class="signup"><a href="#">Sign Up<i class="fas fa-user-plus"></i> </a></li>
    //         </ul>`;
        
    //     homeView.account.textContent = '';
    //     homeView.account.insertAdjacentHTML('beforeend', markup);
        
    //     // Reattach event listeners for login/signup
    //     const newDropdownList = homeView.account.querySelector('.dropdownlist');
    //     const loginButton = homeView.account.querySelector('.login');
    //     const signupButton = homeView.account.querySelector('.signup');
        
    //     homeView.toggleButtons(homeView.account, newDropdownList);
    //     homeView.toggleButtons(loginButton, homeView.modallogin);
    //     homeView.toggleButtons(signupButton, homeView.signupmodal);
    // }

    // addHandlerLogout(handler) {
    //     document.addEventListener('click', (e) => {
    //         const signoutBtn = e.target.closest('.signout');
    //         if (!signoutBtn) return;
            
    //         // Show logout confirmation modal instead of browser confirm
    //         this.showLogoutConfirmation(handler);
    //     });

    //     // Handle confirmation modal buttons
    //     this.logoutModal.addEventListener('click', (e) => {
    //         if (e.target.classList.contains('cancel-logout')) {
    //             this.hideLogoutConfirmation();
    //         } else if (e.target.classList.contains('confirm-logout')) {
    //             const spinner = document.getElementById('loading-spinner');
    //             spinner.classList.remove('hidden');
    //             setTimeout(() => {
    //                 spinner.classList.add('hidden');
    //                 this.hideLogoutConfirmation();

    //             }, 3000);

    //             handler();
    //         }
    //     });
    // }

    // showLogoutConfirmation() {
    //     this.logoutModal.classList.remove('hidden');
    //     this.logoutModal.classList.add('active');
    // }

    // hideLogoutConfirmation() {
    //     this.logoutModal.classList.add('hidden');
    //     this.logoutModal.classList.remove('active');
    // }

    clearMessage() {
        this.messageBox.classList.add('hidden'); // Hide the message
        this.messageBox.textContent = ''; // Clear the message content
    }

    // hideLoginModal() {
    //     this.modallogin.classList.add('hidden');
    // }
}
export default new LoginView()