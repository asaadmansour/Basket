class ManageAccountModel {
    getCurrentUser() {
        const userString = sessionStorage.getItem('loggedInUser');
        if (!userString) return null;
        
        try {
            return JSON.parse(userString);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    updateUserData(updatedData) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return false;

            // Update only the editable fields based on the form
            const newUserData = {
                ...currentUser,
                name: {
                    ...currentUser.name,
                    firstname: updatedData.name?.firstname || currentUser.name.firstname,
                    lastname: updatedData.name?.lastname || currentUser.name.lastname
                },
                phone: updatedData.phone || currentUser.phone,
                address: {
                    ...currentUser.address,
                    street: updatedData.address?.street || currentUser.address.street,
                    city: updatedData.address?.city || currentUser.address.city,
                    number: updatedData.address?.number || currentUser.address.number,
                    zipcode: updatedData.address?.zipcode || currentUser.address.zipcode
                }
            };
            
            // Update in session storage
            sessionStorage.setItem('loggedInUser', JSON.stringify(newUserData));
            return true;
        } catch (error) {
            console.error('Error updating user data:', error);
            return false;
        }
    }

    updateUserLocation(lat, lng) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return false;

            const newUserData = {
                ...currentUser,
                address: {
                    ...currentUser.address,
                    geolocation: {
                        lat: lat,
                        long: lng
                    }
                }
            };

            sessionStorage.setItem('loggedInUser', JSON.stringify(newUserData));
            return true;
        } catch (error) {
            console.error('Error updating location:', error);
            return false;
        }
    }
}

export default new ManageAccountModel();