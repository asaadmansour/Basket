class ProductsView {
    constructor() {
        this.productsContainer = document.getElementById('products-container');
        this.productsSection = document.querySelector('.products-section');
        this.productsTitle = document.querySelector('.products-title');
        this.reasonsSection = document.querySelector('.reasons');
        this.isLoggedIn = false;
        
        // Initially hide products using classList
        if (this.productsSection) {
            this.productsSection.classList.add('hidden');
            this.productsSection.classList.remove('active');
        }
        if (this.productsTitle) this.productsTitle.classList.add('hidden');
    }
    updateLoginState(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        const cartButtons = document.querySelectorAll('.add-to-cart');
        cartButtons.forEach(button => {
            button.classList.toggle('hidden', !this.isLoggedIn);
            // Reset disabled state when login state changes
            button.disabled = false;
        });
    }

    showProducts() {
        if (this.reasonsSection) {
            this.reasonsSection.classList.add('hidden');
            this.reasonsSection.classList.remove('active');
        }
        if (this.productsSection) {
            this.productsSection.classList.remove('hidden');
            this.productsSection.classList.add('active');
        }
        if (this.productsTitle) this.productsTitle.classList.remove('hidden');
    }

    hideProducts() {
        if (this.reasonsSection) {
            this.reasonsSection.classList.remove('hidden');
            this.reasonsSection.classList.add('active');
        }
        if (this.productsSection) {
            this.productsSection.classList.add('hidden');
            this.productsSection.classList.remove('active');
        }
        if (this.productsTitle) this.productsTitle.classList.add('hidden');
    }

    renderProducts(products) {
        this.clearProducts();
        products.forEach(product => {
            const productElement = this.createProductElement(product);
            this.productsContainer.appendChild(productElement);
        });
    }

    clearProducts() {
        this.productsContainer.innerHTML = '';
    }

    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.dataset.productId = product.id;

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-info">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-price">${product.price}</p>
            <div class="rating-cart-container">
                <div class="rating-container">
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        <span class="rating-number">${product.rating.rate}</span>
                        <span class="review-count">(${product.rating.count} reviews)</span>
                    </span>
                </div>
                <button class="add-to-cart ${!this.isLoggedIn ? 'flex' : ''}" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
            </div>
        `;
        const cartButton = productDiv.querySelector('.add-to-cart');
        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAddToCart(product.id);
            });
        }
        return productDiv;
    }
    handleAddToCart(productId) {
        const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
        if (button) {
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
            }, 3000); // Re-enable after 3 seconds (matching toast duration)
        }

        const event = new CustomEvent('addToCart', {
            detail: { productId, button }
        });
        document.dispatchEvent(event);
    }

    addHandlerCat(handler) {
        const typecat = document.querySelectorAll('.typecat');
        let activeCategory = null;

        typecat.forEach(cat => {
            cat.addEventListener('click', async e => {
                const box = e.target.closest('.typecat');
                if (!box) return;

                if (activeCategory === box) {
                    // Clicking the active category again
                    box.classList.remove('active');
                    this.hideProducts();
                    activeCategory = null;
                } else {
                    // Clicking a new category
                    typecat.forEach(c => c.classList.remove('active'));
                    box.classList.add('active');
                    await handler(box.dataset.src);
                    this.showProducts();
                    activeCategory = box;
                }
            });
        });
    }
}

export default new ProductsView();
