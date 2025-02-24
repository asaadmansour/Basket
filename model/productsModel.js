class ProductsModel {
    constructor() {
        this.filteredProducts = [];
        this.currentCategory = 'all';
    }

     setProducts(products) {
        this.products = products;
        this.filteredProducts = products;
    }

    filterByCategory(category) {
        this.currentCategory = category;
        if (category.toLowerCase() === 'all') {
            this.filteredProducts = this.products;
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.category.toLowerCase() === category.toLowerCase()
            );
        }
        return this.filteredProducts;
    }

    searchProducts(query) {
        if (!query) {
            return this.filterByCategory(this.currentCategory);
        }
        
        const searchResults = this.filteredProducts.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        return searchResults;
    }

    getProductById(productId) {
        if (!this.products) {
            console.error('Products are not set in the ProductsModel');
            return null; // or handle this case as needed
        }
        return this.products.find(product => Number(product.id) === Number(productId));
    }
}

export default new ProductsModel();