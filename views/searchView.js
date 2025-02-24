class SearchView {
    constructor() {
        this.searchBar = document.querySelector('.search-bar');
        this.searchInput = document.getElementById('search');
        this.searchButton = document.querySelector('.search-button');
        this.categorySelect = document.getElementById('category');
        this.suggestionsContainer = document.querySelector('.search-suggestions');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.mainContent = document.querySelector('.homepagebody');
        this.productsSection = document.querySelector('.products-section');
        this.productsTitle = document.querySelector('.products-title');
        this.reasonsSection = document.querySelector('.reasons');
        this.cartSection = document.querySelector('.cart-section')
        this._handleInput = this._handleInput.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
    }

    addHandlerSearch(handler) {
        this.searchHandler = handler;

        // Input handler for suggestions
        this.searchInput.addEventListener('input', this._handleInput);

        // Search button click handler
        this.searchButton.addEventListener('click', this._handleSearch);

        // Enter key handler
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this._handleSearch(e);
            }
        });

        // Handle suggestion clicks
        this.suggestionsContainer.addEventListener('click', (e) => {
            const suggestionItem = e.target.closest('.suggestion-item');
            if (suggestionItem) {
                this.searchInput.value = suggestionItem.querySelector('.suggestion-title').textContent;
                this._handleSearch(e);
            }
        });

        // Hide overlay when clicking outside
        this.searchOverlay.addEventListener('click', () => {
            this.hideOverlay();
            this.hideSuggestions();
        });

        // Category change handler
        this.categorySelect.addEventListener('change', () => {
            if (this.searchInput.value.trim()) {
                this._handleInput({ target: this.searchInput });
            }
        });
    }

    _handleInput(e) {
        const query = e.target.value.trim();
        const category = this.categorySelect.value;
        
        if (query.length > 0) {
            this.showOverlay();
            this.searchHandler({ query, category, type: 'suggestion' });
        } else {
            this.hideOverlay();
            this.hideSuggestions();
        }
    }

    _handleSearch(e) {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        const category = this.categorySelect.value;
        
        if (query.length > 0) {
            this.mainContent.classList.add('hidden');
            this.reasonsSection.classList.remove('active');
            this.reasonsSection.classList.add('hidden');
            this.productsSection.classList.remove('hidden');
            this.productsSection.classList.add('active');
            this.productsTitle.classList.remove('hidden');
            this.productsTitle.classList.add('active');
            this.cartSection.classList.add('hidden')
            this.productsTitle.textContent = `Search results for "${query}"`;
            this.searchHandler({ query, category, type: 'search' });
            this.hideOverlay();
            this.hideSuggestions();
        }
    }

    renderSuggestions(suggestions) {
        if (!suggestions.length) {
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-item">
                    <span>No results found</span>
                </div>`;
            return;
        }

        const html = suggestions.map(item => `
            <div class="suggestion-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="suggestion-image">
                <div class="suggestion-details">
                    <span class="suggestion-title">${item.title}</span>
                    <span class="suggestion-category">${item.category}</span>
                </div>
            </div>
        `).join('');

        this.suggestionsContainer.innerHTML = html;
        this.showSuggestions();
    }

    showOverlay() {
        this.searchOverlay.classList.remove('hidden');
    }

    hideOverlay() {
        this.searchOverlay.classList.add('hidden');
    }

    showSuggestions() {
        this.suggestionsContainer.classList.remove('hidden');
    }

    hideSuggestions() {
        this.suggestionsContainer.classList.add('hidden');
    }
}

export default new SearchView(); 