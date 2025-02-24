class LogoutModel {
    logout() {
        sessionStorage.removeItem('loggedInUser');
        return true;
    }
}

export default new LogoutModel();
