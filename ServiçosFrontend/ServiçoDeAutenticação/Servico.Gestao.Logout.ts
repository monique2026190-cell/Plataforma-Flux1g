
import ClienteBackend from '../Cliente.Backend';
import { config } from '../ValidaçãoDeAmbiente/config';

// --- Real Logout Service ---
const realLogoutService = {
    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        delete ClienteBackend.defaults.headers.common['Authorization'];
    },
};

// --- Simulated Logout Service ---
const simulatedLogoutService = {
    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    },
};

// --- Exporting the correct service based on environment ---
export const servicoGestaoLogout = config.VITE_APP_ENV === 'simulation'
    ? simulatedLogoutService
    : realLogoutService;
