class ToastView {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    show(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Create content container
        const content = document.createElement('div');
        content.className = 'toast-content';

        // Add icon based on type
        const icon = document.createElement('i');
        icon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        content.appendChild(icon);

        // Add message
        const text = document.createElement('span');
        text.textContent = message;
        content.appendChild(text);

        // Add content to toast
        toast.appendChild(content);

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = () => this.removeToast(toast);
        toast.appendChild(closeBtn);

        // Add toast to container
        this.container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                this.removeToast(toast);
            }
        }, 3000);
    }

    removeToast(toast) {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }
}

export default new ToastView(); 