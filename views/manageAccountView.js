import homeModel from "../model/homeModel.js";
import homeView from "./homeView.js";
import toastView from "./toastView.js";
import manageAccountModel from "../model/manageAccountModel.js";

class ManageAccountView {
    constructor() {
        this.modal = document.getElementById('manage-account-modal');
        this.form = document.getElementById('manage-account-form');
        this.closeBtn = document.getElementById('close-manage-modal');
        this.formActions = this.form ? this.form.querySelector('.form-actions') : null;
        this.mapModal = document.querySelector('.map-modal');
        this.locationBtn = document.querySelector('.location-picker-btn');
        this.confirmBtn = document.querySelector('.confirm');
        this.backBtn = document.querySelector('.back');
        this.locatemeBtn = document.querySelector('.locateme');
        this.hasUsedLocateMe = false;

        if(this.locationBtn) {
            this.locationBtn.addEventListener('click', () => {
                // Hide manage account modal
                this.modal.classList.add('hidden');
                
                // Show and setup map modal with special class
                this.mapModal.classList.remove('hidden');
                this.mapModal.classList.add('overlay', 'from-manage');
                
                // Get current user's location
                const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
                
                // Render map with appropriate location
                setTimeout(() => {
                    if (currentUser?.address?.geolocation) {
                        homeView.renderMap(
                            currentUser.address.geolocation.lat,
                            currentUser.address.geolocation.long,
                            15
                        );
                    } else {
                        homeView.renderMap();
                    }
                    homeView.map.resize();
                    // Reset states when opening map
                    homeView.resetMapState();
                    this.hasUsedLocateMe = false;
                }, 100);
            });
        }

        if(this.locatemeBtn) {
            this.locatemeBtn.addEventListener('click', () => {
                this.hasUsedLocateMe = true;
                homeView.hasUsedLocateMe = true; // Also set homeView state
                homeView.enableConfirmButton();
            });
        }

        // Add close button handler
        this?.closeBtn?.addEventListener('click', () => {
            this.hideModal();
        });

        // Add edit button handlers
        this?.form?.querySelectorAll('.edit-btn')?.forEach(btn => {
            btn?.addEventListener('click', (e) => {
                const field = e.currentTarget.dataset.field;
                this.makeFieldEditable(field);
            });
        });

        // Add cancel button handler
        this?.form?.querySelector('.cancel-edit')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.cancelEdit();
        });

        // Add save button handler
        this?.addHandlerSave(this.saveUserData.bind(this));
    }

    makeFieldEditable(fieldId) {
        const input = this.form.querySelector(`#${fieldId}`);
        input.removeAttribute('readonly');
        input.focus();
        this.formActions.classList.remove('hidden');
    }

    cancelEdit() {
        // Reset all fields to readonly
        this.form.querySelectorAll('input').forEach(input => {
            input.setAttribute('readonly', true);
        });
        this.formActions.classList.add('hidden');
    }

    hideModal() {
        this.modal.classList.add('hidden');
        // Reset form state when closing
        this.cancelEdit();
    }

    addHandlerManage(handler) {
        document.addEventListener('click', function(e) {
            const manageBtn = e.target.closest('.manage');
            if (!manageBtn) return;
            
            handler();
        });
    }

    fillUserData(userData) {
        // Fill basic info
        this.form.querySelector('#username').value = userData.username;
        this.form.querySelector('#email').value = userData.email;
        this.form.querySelector('#firstname').value = userData.name.firstname;
        this.form.querySelector('#lastname').value = userData.name.lastname;
        this.form.querySelector('#phone').value = userData.phone;
        
        // Fill address info
        this.form.querySelector('#street').value = userData.address.street;
        this.form.querySelector('#city').value = userData.address.city;
        this.form.querySelector('#zipcode').value = userData.address.zipcode;
        this.form.querySelector('#country').value = userData.address.number;
    }

    showModal() {
        // Hide login modal if it's open
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.add('hidden');
        }
        
        this.modal.classList.remove('hidden');
    }

    addHandlerSave(handler) {
        this?.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: {
                    firstname: this?.form?.querySelector('#firstname')?.value,
                    lastname: this?.form?.querySelector('#lastname')?.value
                },
                phone: this.form.querySelector('#phone').value,
                address: {
                    street: this?.form?.querySelector('#street')?.value,
                    city: this?.form?.querySelector('#city')?.value,
                    number: this?.form?.querySelector('#country')?.value,
                    zipcode: this?.form?.querySelector('#zipcode')?.value
                }
            };

            handler(formData);
            this.cancelEdit();
        });
    }

    saveUserData(userData) {
        // Implement your saveUserData logic here
    }

    resetMapState() {
        this.hasUsedLocateMe = false;
        homeView.resetMapState();
    }
}

export default new ManageAccountView();