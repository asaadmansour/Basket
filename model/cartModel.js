class CartModel {
    constructor() {
        this.loadCart();
    }

    loadCart() {
        this.carts = JSON.parse(localStorage.getItem('userCarts')) || {};
    }

    saveCart() {
        localStorage.setItem('userCarts', JSON.stringify(this.carts));
    }

    getCurrentUserId() {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        return user ? user.id : null;
    }

    addToCart(productData) {
        const userId = this.getCurrentUserId();
        if (!userId) return false;

        if (!this.carts[userId]) {
            this.carts[userId] = [];
        }

        const existingProduct = this.carts[userId].find(item => item.id === productData.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.carts[userId].push({
                ...productData,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        this.saveCart();
        return true;
    }

    updateQuantity(productId, action) {
        const userId = this.getCurrentUserId();
        if (!userId || !this.carts[userId]) return false;

        const product = this.carts[userId].find(item => item.id === Number(productId));
        if (!product) return false;

        if (action === 'increase') {
            product.quantity += 1;
        } else if (action === 'decrease' && product.quantity > 1) {
            product.quantity -= 1;
        }

        this.saveCart();
        return true;
    }

    removeFromCart(productId) {
        const userId = this.getCurrentUserId();
        if (!userId || !this.carts[userId]) return false;

        const index = this.carts[userId].findIndex(item => item.id === Number(productId));
        if (index === -1) return false;

        this.carts[userId].splice(index, 1);
        this.saveCart();
        return true;
    }

    getCartCount() {
        const userId = this.getCurrentUserId();
        if (!userId || !this.carts[userId]) return 0;
        
        return this.carts[userId].reduce((total, item) => total + item.quantity, 0);
    }

    getCart() {
        const userId = this.getCurrentUserId();
        return userId ? this.carts[userId] || [] : [];
    }
}

export default new CartModel(); 