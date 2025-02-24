import toastView from "../views/toastView.js";

class StripeService {
    constructor() {
        this.stripe = Stripe('pk_test_51QLa8B2Lu5T2jQnWqrnhcwuJ2HklBqwAZx4biFaPjwYsdqtnRRKytDHDpqO60nh9O20UqeWlo5SGO2ne18Pc20hO00Z4SA480t');
    }

    async createCheckoutSession(totalAmount) {
        try {
            if (totalAmount <= 0) {
                toastView.error('Your cart is empty');
                return;
            }

            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                lineItems: [{
                    // Replace this with your price ID from Stripe Dashboard
                    price: 'price_1QLkKa2Lu5T2jQnW9xRvJrOm',
                    quantity: 1
                }],
                mode: 'payment',
                successUrl: `${window.location.origin}/success.html`,
                cancelUrl: `${window.location.origin}/cancel.html`
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toastView.error('Failed to redirect to payment.');
            throw error;
        }
    }
}

export default new StripeService();
