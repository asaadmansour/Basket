import stripeService from "../services/stripeService.js";
import toastView from "./toastView.js";
class CartView {
    constructor() {
        this.cartSection = document.querySelector('.cart-section');
        this.cartItems = document.querySelector('.cart-items');
        this.cartLink = document.querySelector('li a[href="#"]:has(i.fa-shopping-cart)');
        this.subtotalElement = document.querySelector('.subtotal');
        this.totalElement = document.querySelector('.total-amount');
        this.reasonsSection = document.querySelector('.reasons');
        this.productsSection = document.querySelector('.products-section');
        this.homepageBody = document.querySelector('.homepagebody');
        this.productsTitle = document.querySelector('.products-title');
        this.checkoutBtn = document.querySelector('.cart-summary .checkout-btn');
        this.backBtn = document.querySelector('button.continue-shopping.two')
        // Bind event listeners
        if (this.cartLink) {
            this.cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }

        // Delegate events for cart items
        if (this.cartItems) {
            this.cartItems.addEventListener('click', (e) => {
                const target = e.target;
                const cartItem = target.closest('.cart-item');
                if (!cartItem) return;

                if (target.classList.contains('increase-quantity')) {
                    this.handleQuantityChange(cartItem.dataset.id, 'increase');
                } else if (target.classList.contains('decrease-quantity')) {
                    this.handleQuantityChange(cartItem.dataset.id, 'decrease');
                } else if (target.classList.contains('remove-item')) {
                    this.handleRemoveItem(cartItem.dataset.id);
                }
            });
        }
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
               this.toggleCart()
            });
        }
    }

    hideSection(section) {
        if (!section) return;
        // section.style.display = 'none';
        section.classList.add('hidden');
    }

    showSection(section) {
        if (!section) return;
        // section.style.display = 'block';
        section.classList.remove('hidden');
    }

    toggleCart() {
        const isCartVisible = !this.cartSection.classList.contains('hidden');
        
        if (isCartVisible) {
            // Hide cart
            this.cartSection.classList.add('hidden');
            document.querySelector('.homepagebody').classList.remove('hidden');

            // Check if we were showing products before
            const activeCategory = document.querySelector('.typecat.active');
            if (activeCategory) {
                // Show products section
                const productsSection = document.querySelector('.products-section');
                productsSection.classList.remove('hidden');
                productsSection.classList.add('active');
                document.querySelector('.products-title').classList.remove('hidden');
                
                // Hide reasons section
                const reasonsSection = document.querySelector('.reasons');
                reasonsSection.classList.add('hidden');
                reasonsSection.classList.remove('active');
            } else {
                // Show reasons section
                const reasonsSection = document.querySelector('.reasons');
                reasonsSection.classList.remove('hidden');
                reasonsSection.classList.add('active');
                
                // Hide products section
                const productsSection = document.querySelector('.products-section');
                productsSection.classList.add('hidden');
                productsSection.classList.remove('active');
                document.querySelector('.products-title').classList.add('hidden');
            }
        } else {
            // Show cart and hide everything else
            this.cartSection.classList.remove('hidden');
            document.querySelector('.homepagebody').classList.add('hidden');
            
            // Hide products section
            const productsSection = document.querySelector('.products-section');
            productsSection.classList.add('hidden');
            productsSection.classList.remove('active');
            document.querySelector('.products-title').classList.add('hidden');
            
            // Hide reasons section
            const reasonsSection = document.querySelector('.reasons');
            reasonsSection.classList.add('hidden');
            reasonsSection.classList.remove('active');
            
            // Refresh cart content
            const carts = JSON.parse(localStorage.getItem('userCarts')) || {};
            this.renderCart(carts);
        }
    }

    renderCart(carts) {
        const userId = this.getCurrentUserId();
        const userCart = carts[userId] || [];

        if (userCart.length === 0) {
            this.renderEmptyCart();
            return;
        }

        const markup = userCart.map(item => this.generateCartItemMarkup(item)).join('');
        this.cartItems.innerHTML = markup;
        this.updateCartTotals(userCart);
    }

    getCurrentUserId() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        return user ? user.id : null;
    }

    generateCartItemMarkup(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p class="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-quantity" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity">+</button>
                    </div>
                </div>
                <button class="remove-item" aria-label="Remove item">×</button>
            </div>
        `;
    }

    renderEmptyCart() {
        this.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="continue-shopping">Continue Shopping</button>
            </div>
        `;
        this.updateCartTotals([]);

        // Add event listener for continue shopping button
        const continueBtn = this.cartItems.querySelector('.continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.toggleCart());
        }
    }

    updateCartTotals(cartItems) {
        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        this.totalElement.textContent = `$${subtotal.toFixed(2)}`; // Add shipping if needed
    }

    handleQuantityChange(productId, action) {
        const event = new CustomEvent('updateCartQuantity', {
            detail: { productId, action }
        });
        document.dispatchEvent(event);
    }

    handleRemoveItem(productId) {
        const event = new CustomEvent('removeFromCart', {
            detail: { productId }
        });
        document.dispatchEvent(event);
    }

    addHandlerCheckout(handler) {
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => {
                const userId = this.getCurrentUserId();
                if (!userId) {
                    toastView.error('Please login to checkout');
                    return;
                }
                handler();
            });
        }
    }
}

export default new CartView(); 
//i need to reset the view ofthe cart when the user logs out
// i need to fix the icons inthe cart section
// i need to rerender the cart number when the user logs in and he have already items in the cart
