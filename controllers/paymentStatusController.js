import paymentStatusModel from '../model/paymentStatusModel.js';
import paymentStatusView from '../views/paymentStatusView.js';

export const controlPaymentSuccess = function() {
    if (!paymentStatusModel.isUserLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    const orderId = paymentStatusModel.generateOrderId();
    paymentStatusView.displayOrderId(orderId);

    paymentStatusView.addHandlerHome(() => {
        paymentStatusModel.clearCart();
        window.location.href = 'index.html';
    });
};

export const controlPaymentCancel = function() {
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