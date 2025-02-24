import homeView from './homeView.js';   
class LogoutView {
    constructor() {
        this.messageBox = document.getElementById('login-message');
        this.spinner = document.getElementById('loading-spinner');
        this.logoutModal = document.getElementById('logout-confirm-modal');
        this.loginEmailInput = document.getElementById('login-email');
        this.loginPasswordInput = document.getElementById('login-password');
    }

    showLogoutConfirmation(handler) {
        this.logoutModal.classList.remove('hidden');
        this._logoutHandler = handler;
    }

    addHandlerLogout(handler) {
        document.addEventListener('click', (e) => {
            const signoutBtn = e.target.closest('.signout');
            if (!signoutBtn) return;
            
            this.showLogoutConfirmation(handler);
        });

        this.logoutModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancel-logout')) {
                this.hideLogoutConfirmation();
            } else if (e.target.classList.contains('confirm-logout')) {
                this.spinner.classList.remove('hidden');
                this.spinner.style.zIndex = '2000';

                setTimeout(() => {
                    this.spinner.classList.add('hidden');
                    this.hideLogoutConfirmation();

                    if (this._logoutHandler) {
                        this._logoutHandler();
                    }
                }, 500);
            }
        });
    }

    hideLogoutConfirmation() {
        this.logoutModal.classList.add('hidden');
    }

    displayLogoutMessage(message, isSuccess) {
        this.messageBox.textContent = message;
        this.messageBox.className = isSuccess ? 'success' : 'error';
        this.messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            this.messageBox.classList.add('hidden');
            this.renderDefaultState();
        }, 500);
    }

    clearMessage() {
        this.messageBox.textContent = '';
        this.messageBox.className = '';
        this.messageBox.classList.add('hidden');
    }

    renderDefaultState() {
        const markup = `
            <a href="#">
                <i class="fa fa-user"></i> 
                Account
                <i class="fa-solid fa-caret-down"></i>
            </a>
            <ul class="dropdownlist hidden">
                <li class="login"><a href="#">Log In<i class="fas fa-sign-in-alt"></i> </a></li>
                <li class="signup"><a href="#">Sign Up<i class="fas fa-user-plus"></i> </a></li>
            </ul>`;
        
        // Reset account dropdown
        homeView.account.textContent = '';
        homeView.account.insertAdjacentHTML('beforeend', markup);
        
        // Reset cart counter
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.classList.add('hidden');
        }

        // Hide cart section and show default homepage sections
        const cartSection = document.querySelector('.cart-section');
        const reasonsSection = document.querySelector('.reasons');
        const productsSection = document.querySelector('.products-section');
        const homepageBody = document.querySelector('.homepagebody');
        const productsTitle = document.querySelector('.products-title');

        if (cartSection) cartSection.classList.add('hidden');
        if (reasonsSection) reasonsSection.classList.remove('hidden');
        if (productsSection) productsSection.classList.add('hidden');
        if (homepageBody) homepageBody.classList.remove('hidden');
        if (productsTitle) productsTitle.classList.add('hidden');
        
        // Remove active state from categories
        const activeCategory = document.querySelector('.typecat.active');
        if (activeCategory) {
            activeCategory.classList.remove('active');
        }
        
        // Reattach event listeners
        const newDropdownList = homeView.account.querySelector('.dropdownlist');
        const loginButton = homeView.account.querySelector('.login');
        const signupButton = homeView.account.querySelector('.signup');
        
        homeView.toggleButtons(homeView.account, newDropdownList);
        homeView.toggleButtons(loginButton, homeView.modallogin);
        homeView.toggleButtons(signupButton, homeView.signupmodal);
        if (this.loginEmailInput) this.loginEmailInput.value = '';
        if (this.loginPasswordInput) this.loginPasswordInput.value = '';
    }
}

export default new LogoutView();
