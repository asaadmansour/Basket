class PaymentStatusView {
    constructor() {
        this.orderId = document.getElementById('orderId');
        this.homeBtn = document.querySelector('.home-btn');
        this.retryBtn = document.querySelector('.retry-btn');
    }

    displayOrderId(orderId) {
        if (this.orderId) {
            this.orderId.textContent = orderId;
        }
    }

    addHandlerHome(handler) {
        if (this.homeBtn) {
            this.homeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    }

    addHandlerRetry(handler) {
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    }
}

export default new PaymentStatusView();