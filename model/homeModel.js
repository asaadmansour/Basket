// model/homeModel.js
import { capitalizeCategory } from "../helpers.js"; // Ensure this path is correct
import { priceMapping } from "../priceMapping.js";
class HomeModel {
    constructor() {
        this.eCommerceObject = {
            products: [],
        };
    }

    async eCommerceData() {
        try {
            const res = await fetch(`https://fakestoreapi.com/products`);
            if (!res.ok) throw new Error('Failed to fetch data');
            this.data = await res.json(); // Store fetched data

            this.eCommerceObject.products = this.data.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                image: item.image,
                rating: {
                    rate: item.rating.rate,
                    count: item.rating.count
                },
                priceId: priceMapping[item.id] || null
            }));
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error to be handled in the controller
        }
        console.log(this.eCommerceObject)
    }

    getCategories() {
        if (!this.eCommerceObject.products.length) throw new Error('Data has not been fetched yet');
        const categories = [...new Set(this.eCommerceObject.products.map(item => capitalizeCategory(item.category)))];
        return categories;
    }
    

    async getLocateUser() {
        // Simplified to return location as a promise
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords; // Destructure coordinates
                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);
                    resolve({ latitude, longitude }); // Resolve with coordinates
                },
                () => {
                
                    reject(new Error('Cannot get location')); // Reject the promise
                    
                }
            );
        });
    }
}

// Export an instance of the class
const homeModel = new HomeModel();
export default homeModel;
