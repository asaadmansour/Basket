class SearchModel {
    constructor() {
        this.searchResults = [];
        this.suggestions = [];
    }

    setProducts(products) {
        this.products = products;
    }

    // Get search suggestions as user types
    getSuggestions(query, category = 'all') {
        if (!query) return [];
        
        query = query.toLowerCase();
        let filteredProducts = this.products;

        // Filter by category if specified
        if (category !== 'all') {
            filteredProducts = this.products.filter(product => 
                product.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Get suggestions based on title and category
        this.suggestions = filteredProducts
            .filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            )
            .slice(0, 5) // Limit to 5 suggestions
            .map(product => ({
                id: product.id,
                title: product.title,
                category: product.category,
                image: product.image
            }));

        return this.suggestions;
    }

    // Full search functionality
    search(query, category = 'all') {
        if (!query) return this.products;

        query = query.toLowerCase();
        let searchResults = this.products;

        // Filter by category if specified
        if (category !== 'all') {
            searchResults = searchResults.filter(product => 
                product.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Search in title, description and category
        this.searchResults = searchResults.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        return this.searchResults;
    }
}

export default new SearchModel(); 