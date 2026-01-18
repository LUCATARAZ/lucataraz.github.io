// FORZA UPDATE SU TUTTI I DISPOSITIVI
const FORCE_UPDATE_VERSION = '20240119_EMERGENCY';
const FORCE_UPDATE_KEY = 'artista_force_update';

// 1. Cancella TUTTA la cache
if (caches && caches.keys) {
    caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
    });
}

// 2. Cancella TUTTO il localStorage
localStorage.clear();
sessionStorage.clear();

// 3. Cancella TUTTI i cookie
document.cookie.split(";").forEach(cookie => {
    document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
});

// 4. Forza reload nucleare
const url = new URL(window.location.href);
url.searchParams.set('force', FORCE_UPDATE_VERSION);
url.searchParams.set('v', Date.now());
url.searchParams.set('emergency', 'true');
url.searchParams.set('cache', 'nuclear_bust');

// 5. Redirect
window.location.href = url.toString();
