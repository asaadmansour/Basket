import homeModel from './model/homeModel.js';
import homeView from './views/homeView.js';
import mainView from './views/mainView.js';
import loginModel from './model/loginModel.js';
import loginView from './views/loginView.js';
import manageAccountView from './views/manageAccountView.js';
import logoutView from './views/logoutView.js';
import logoutModel from './model/logoutModel.js';
import manageAccountModel from './model/manageAccountModel.js';
import toastView from './views/toastView.js';
import productsModel from './model/productsModel.js';
import productsView from './views/productsView.js';
import cartModel from './model/cartModel.js';
import cartView from './views/cartView.js';
import searchModel from './model/searchModel.js';
import searchView from './views/searchView.js';
import stripeService from './services/stripeService.js';
import paymentStatusModel from './model/paymentStatusModel.js';
import paymentStatusView from './views/paymentStatusView.js';

// Initialize the fetching of data and render options
const controlCategories = async function() {
    try {
        await homeModel.eCommerceData(); // Start data fetching
        const categories = homeModel.getCategories(); // Get categories from the model
        homeView.renderOptions(categories); // Render options in the dropdown
    } catch (error) {
        console.error('Error fetching data:', error); // Handle any errors
    }
};

// Function to initialize map-related handlers
const initMapHandlers = function() {
    // Remove existing handlers first
    const locationBtn = document.querySelector('.location');
    const backBtn = document.querySelector('.back');
    
    if (locationBtn._mapToggleHandler) {
        locationBtn.removeEventListener('click', locationBtn._mapToggleHandler);
    }
    if (backBtn._mapToggleHandler) {
        backBtn.removeEventListener('click', backBtn._mapToggleHandler);
    }

    // Add new handlers
    homeView.toggleMap('.location', 'show');
    homeView.toggleMap('.back', 'hide');

    // Handle locate me button
    const locateButton = document.querySelector('.locateme');
    if (locateButton) {
        locateButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            try {
                const { latitude, longitude } = await homeModel.getLocateUser();
                homeView.renderMap(latitude, longitude);
                homeView.hasUsedLocateMe = true;
                homeView.enableConfirmButton();
                
                if (homeView.mapModal.classList.contains('from-manage')) {
                    manageAccountView.hasUsedLocateMe = true;
                }
            } catch (error) {
                console.error('Error locating user:', error);
                toastView.error('Could not get your location');
                homeView.hasUsedLocateMe = false;
                homeView.disableConfirmButton();
                if (homeView.mapModal.classList.contains('from-manage')) {
                    manageAccountView.hasUsedLocateMe = false;
                }
            }
        });
    }
};
const controlLogins = async function({ email, password }) {
    try {
        await loginModel.usersData();
        const user = loginModel.loginFunctionality(email, password);
        
        if (user) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            loginView.displayMessage('Login successful!', true);
            homeView.renderMap(
                user.address.geolocation.lat, 
                user.address.geolocation.long
            );
            productsView.updateLoginState(true);
            updateCartCount();
            // toastView.success('Login successful!');
        } else {
            loginView.displayMessage('Invalid email or password.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        loginView.displayMessage('An error occurred.', false);
    }
};
const controlLogout = function() {
    try {
        const success = logoutModel.logout();
        if (success) {
            manageAccountView.resetMapState();
            logoutView.displayLogoutMessage('Logged out successfully!', true);
            homeView.renderMap();
            productsView.updateLoginState(false);
            toastView.success('Successfully logged out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        logoutView.displayLogoutMessage('Logout failed. Please try again.', false);
    }
};
const controlManageAccount = function() {
    try {
        const userData = loginModel.getCurrentUser();
        
        if (!userData) {
            throw new Error('No user data found');
        }
        
        manageAccountView.fillUserData(userData);
        manageAccountView.showModal();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        loginView.displayMessage('Error loading account details', false);
    }
};



// In your controller functions:
const controlUpdateAccount = function(formData) {
    try {
        const success = manageAccountModel.updateUserData(formData);
        if (success) {
            toastView.success('Profile updated successfully!');
            const updatedUser = manageAccountModel.getCurrentUser();
            manageAccountView.fillUserData(updatedUser);
        } else {
            toastView.error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        toastView.error('An error occurred while updating profile');
    }
};

// const controlProducts = async function() {
//     try {
//         // Use existing homeModel to fetch data
//         await homeModel.eCommerceData();
//         // Pass the data to productsModel
//         productsModel.setProducts(homeModel.eCommerceObject.products);
//         // Render initial products
//         productsView.renderProducts(productsModel.products);
//     } catch (error) {
//         console.error('Error loading products:', error);
//         toastView.error('Failed to load products');
//     }
// };

// const controlFilter = function(category) {
//     const filteredProducts = productsModel.filterByCategory(category);
//     productsView.renderProducts(filteredProducts);
// };

const controlProducts = async function() {
    try {
        await homeModel.eCommerceData();
        productsModel.setProducts(homeModel.eCommerceObject.products);
        productsView.renderProducts(productsModel.products);
    } catch (error) {
        console.error('Error loading products:', error);
        toastView.error('Failed to load products');
    }
};

const controlCategoriess = async function(category) {
    try {
        // Fetch data if not already fetched
        if (!productsModel.products) {
            await homeModel.eCommerceData();
            productsModel.setProducts(homeModel.eCommerceObject.products);
        }
        const filteredProducts = productsModel.filterByCategory(category);
        productsView.renderProducts(filteredProducts);
    } catch (error) {
        console.error('Error filtering products:', error);
        toastView.error('Failed to load products');
    }
};

const controlSearch = async function(searchData) {
    const { query, category, type } = searchData;

    try {
        // Make sure products are loaded
        await homeModel.eCommerceData();

        // Set products in the products model
        productsModel.setProducts(homeModel.eCommerceObject.products);
        if (!homeModel.eCommerceObject.products.length) {
            return;
        }

        // Make sure search model has products
        if (!searchModel.products) {
            searchModel.setProducts(homeModel.eCommerceObject.products);
        }

        if (type === 'suggestion') {
            const suggestions = searchModel.getSuggestions(query, category);
            searchView.renderSuggestions(suggestions);
        } else {
            // Handle full search
            const results = searchModel.search(query, category);
            productsView.renderProducts(results);

        }
    } catch (error) {
        console.error('Search error:', error);
        toastView.error('Error performing search');
    }
};

const controlAddToCart = function(event) {
    const { productId, button } = event.detail;
    
    if (!sessionStorage.getItem('loggedInUser')) {
        toastView.error('Please login to add items to cart');
        return;
    }

    try {
        // Get product details from productsModel
        console.log(productId)
        const product = productsModel.getProductById(productId);
        console.log(product)
        if (!product) {
            throw new Error('Product not found');
        }

        // Prepare product data for cart
        const cartProduct = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
        };

        const success = cartModel.addToCart(cartProduct);
        
        if (success) {
            toastView.success('Product added to cart successfully');
            updateCartCount();
        }

        if (button) {
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
            }, 3000);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        toastView.error('Failed to add product to cart');
        if (button) {
            button.disabled = false;
        }
    }
    // console.log(cartProduct)
};

const updateCartCount = function() {
    const count = cartModel.getCartCount();
    // Update cart count in UI if you have a cart counter element
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count || '';
        cartCountElement.classList.toggle('hidden', count === 0);
    }
};

// Add these new controller functions
const controlRenderCart = function() {
    cartView.renderCart(cartModel.carts);
};

const controlUpdateQuantity = function(event) {
    const { productId, action } = event.detail;
    const success = cartModel.updateQuantity(productId, action);
    
    if (success) {
        cartView.renderCart(cartModel.carts);
        updateCartCount();
    }
};

const controlRemoveFromCart = function(event) {
    const { productId } = event.detail;
    const success = cartModel.removeFromCart(productId);
    
    if (success) {
        toastView.success('Item removed from cart');
        cartView.renderCart(cartModel.carts);
        updateCartCount();
    }
};
const controlCheckout = async function() {
    try {
        // Check if user is logged in
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            toastView.error('Please login to checkout');
            return;
        }

        // Get cart total
        const cartItems = cartModel.getCart();
        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        if (totalAmount <= 0) {
            toastView.error('Your cart is empty');
            return;
        }

        // Disable checkout button while processing
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Processing...';
        }

        // Pass only the total amount to stripe service
        await stripeService.createCheckoutSession(totalAmount);

    } catch (error) {
        console.error('Checkout error:', error);
        toastView.error('Checkout failed. Please try again.');
        
        // Reset button state
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Proceed to Checkout';
        }
    }
};

// Add these control functions
export const controlPaymentSuccess = function() {
    if (!paymentStatusModel.isUserLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    const orderId = paymentStatusModel.generateOrderId();
    paymentStatusView.displayOrderId(orderId);

    paymentStatusView.addHandlerHome(() => {
        // Clear cart and update all related states
        paymentStatusModel.clearCart();
        
        // Force cart view to show empty state
        cartView.renderCart(cartModel.carts);
        
        // Update cart counter
        updateCartCount();
        
        window.location.href = 'index.html';
    });
};

const controlPaymentCancel = function() {
    if (!paymentStatusModel.isUserLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    paymentStatusView.addHandlerHome(() => {
        window.location.href = 'index.html';
    });

    paymentStatusView.addHandlerRetry(() => {
        window.location.href = 'index.html#cart';
    });
};
// Initialization function to kick off the application
const init = async function() {
    // Check for logged-in state first
    homeView.checkAndRenderLoginState();

    homeView.addHandlerCategories(controlCategories); // Initialize category handler
    initMapHandlers(); // Initialize map handlers
    homeView.renderMap(); // Ensure the map is rendered
    homeView.toggleButtons(homeView.account,homeView.drop)
    homeView.toggleButtons(homeView.login,homeView.modallogin)
    homeView.toggleButtons(homeView.close,homeView.modallogin)
    homeView.toggleButtons(homeView.signup,homeView.signupmodal)
    homeView.toggleButtons(homeView.closet,homeView.signupmodal)
    homeView.initSwitchModalHandler(homeView.linkto,homeView.modallogin,homeView.signupmodal)
    loginModel.usersData()
    loginView.addHandlerLogin(controlLogins)
    logoutView.addHandlerLogout(controlLogout)
    manageAccountView.addHandlerManage(controlManageAccount)
    manageAccountView.addHandlerSave(controlUpdateAccount)
    productsView.addHandlerCat(controlCategoriess);
    // productsView.addHandlerFilter(controlFilter);
    // productsView.addHandlerSearch(controlSearch);
    
    // Add cart event listeners
    document.addEventListener('addToCart', controlAddToCart);
    document.addEventListener('updateCartQuantity', controlUpdateQuantity);
    document.addEventListener('removeFromCart', controlRemoveFromCart);
    
    // Initial cart render if needed
    controlRenderCart();
    
 

        // Add search handler
        searchView.addHandlerSearch(controlSearch);
        cartView.addHandlerCheckout(controlCheckout); // Add checkout handler

}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
