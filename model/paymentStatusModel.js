class PaymentStatusModel {
    constructor() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    }

    isUserLoggedIn() {
        return !!this.loggedInUser;
    }

    generateOrderId() {
        return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    clearCart() {
        const userId = this.loggedInUser?.id;
        console.log('Clearing cart for user:', userId);
        
        if (userId) {
            try {
                const carts = JSON.parse(localStorage.getItem('userCarts')) || {};
                delete carts[userId];
                localStorage.setItem('userCarts', JSON.stringify(carts));
                return true;
            } catch (error) {
                console.error('Error clearing cart:', error);
                return false;
            }
        }
        return false;
    }
}

export default new PaymentStatusModel();