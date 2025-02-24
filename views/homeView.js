import { MY_MAP_TOKEN } from '../config.js';
import toastView from './toastView.js';
import manageAccountModel from '../model/manageAccountModel.js';
import manageAccountView from './manageAccountView.js';
import cartModel from '../model/cartModel.js';

class HomeView {
    dropdown = document.querySelector('.dropdown-cat');
    account = document.querySelector('.account')
    drop = document.querySelector('.dropdownlist')
    login = document.querySelector('.login')
    modallogin = document.getElementById('login-modal')
    close = document.getElementById('close-login-modal')
    signup = document.querySelector('.signup')
    closet = document.getElementById('close-signup-modal')
    signupmodal = document.getElementById('signup-modal')
    linkto = document.getElementById('linktosignup')
    confirmBtn = document.querySelector('.confirm');
    
    constructor() {
        this.map = null;
        this.mapContainer = document.querySelector('.map-content');
        this.marker = null;
        this.mapModal = document.querySelector('.map-modal');
        this.backBtn = document.querySelector('.back');
        this.hasUsedLocateMe = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.backBtn?.addEventListener('click', () => this.handleBackButton());

        this.confirmBtn?.addEventListener('click', () => {
            const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            
            if (!currentUser) {
                toastView.error('Please login to confirm your location');
                return;
            }

            if (!this.hasUsedLocateMe) {
                toastView.error('Please use "Locate Me" first to get your location');
                return;
            }

            const lngLat = this.marker?.getLngLat();
            if(!lngLat) {
                this.hasUsedLocateMe = false;
                return;
            }
            const success = manageAccountModel.updateUserLocation(lngLat.lat, lngLat.lng);
            
            if (success) {
                toastView.success('Location updated successfully!');
                this.mapModal.className = 'map-modal hidden';
                
                if (this.mapModal?.classList.contains('from-manage')) {
                    document.getElementById('manage-account-modal')?.classList.remove('hidden');
                    manageAccountView.resetMapState();
                }

                this.hasUsedLocateMe = false;
                this.disableConfirmButton();
            }
        });
    }

    initializeMap() {
        if (typeof mapboxgl !== 'undefined') {
            mapboxgl.accessToken = MY_MAP_TOKEN;
        }
    }

    renderMap(lat = 30.059556, lng = 31.217264, zoom = 15) {
        this.initializeMap();

        if (!this.map && typeof mapboxgl !== 'undefined') {
            this.map = new mapboxgl.Map({
                container: this.mapContainer,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom,
            });

            this.marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(this.map);
        } else if (this.map) {
            this.map.setCenter([lng, lat]);
            this.map.setZoom(zoom);
            if (this.marker) this.marker.setLngLat([lng, lat]);
        }
    }

    handleBackButton() {
        if (this.mapModal.classList.contains('from-manage')) {
            this.mapModal.classList.add('hidden');
            this.mapModal.classList.remove('overlay', 'from-manage');
            document.getElementById('manage-account-modal').classList.remove('hidden');
        } else {
            this.mapModal.classList.add('hidden');
            this.mapModal.classList.remove('overlay');
        }
    }

    renderOptions(categories) {
        categories.forEach(category => {
            const markup = `<option value="${category}">${category}</option>`;
            this.dropdown.insertAdjacentHTML('beforeend', markup);
        });
    }

    addHandlerCategories(handler) {
        handler();
    }

    toggleMap(buttonSelector, action) {
        const button = document.querySelector(buttonSelector);
        if (!button) return;

        const handleMapToggle = (event) => {
            event.stopPropagation();
            if (action === 'show') {
                this.mapModal.classList.remove('hidden');
                this.mapModal.classList.add('overlay');
                setTimeout(() => this.map.resize(), 100);
            } else if (action === 'hide') {
                this.mapModal.className = 'map-modal hidden';
                if (this.mapModal.classList.contains('from-manage')) {
                    document.getElementById('manage-account-modal').classList.remove('hidden');
                }
            }
        };

        button._mapToggleHandler = handleMapToggle;
        button.addEventListener('click', button._mapToggleHandler);
    }
    

    toggleButtons(button,added ) {
        button.addEventListener('click',function() {
            added.classList.toggle('active')
            added.classList.toggle('hidden')
        })
    }

    switchModals(modalOne, modalTwo) {
        modalOne.classList.remove('active');
        modalOne.classList.add('hidden');
        modalTwo.classList.remove('hidden');
        modalTwo.classList.add('active');
    }
    
    initSwitchModalHandler(link, modalOne, modalTwo) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModals(modalOne, modalTwo);
        });
    }

    enableConfirmButton() {
        if (this.confirmBtn) {
            this.confirmBtn.disabled = false;
            this.confirmBtn.classList.remove('disabled');
            this.confirmBtn.style.backgroundColor = '#ef233c';
        }
    }

    disableConfirmButton() {
        if (this.confirmBtn) {
            this.confirmBtn.disabled = true;
            this.confirmBtn.classList.add('disabled');
            this.confirmBtn.style.backgroundColor = '#ccc';
        }
    }

    addConfirmHandler(handler) {
        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', handler);
        }
    }

    resetMapState() {
        this.hasUsedLocateMe = false;
        this.disableConfirmButton();
    }

    checkAndRenderLoginState() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            this.account = document.querySelector('.account');
            this.drop = document.querySelector('.dropdownlist');
            this.login = document.querySelector('.login');
            
            const markup = `
                <a href="#">
                    <i class="fa fa-user"></i> 
                    ${loggedInUser.name.firstname} 
                    <i class="fa-solid fa-caret-down"></i>
                </a>
                <ul class="dropdownlist hidden">
                    <li class="manage"><a href="#">Manage Account </a></li>
                    <li class="signout"><a href="#">Sign Out </a></li>
                </ul>`;
            
            this.account.textContent = '';
            this.account.insertAdjacentHTML('beforeend', markup);
            
            const newDropdownList = this.account.querySelector('.dropdownlist');
            this.toggleButtons(this.account, newDropdownList);
    
            const count = cartModel.getCartCount();
            const cartCountElement = document.querySelector('.cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = count || '';
                cartCountElement.classList.toggle('hidden', count === 0);
            }
        }
    }
}
export default new HomeView();
