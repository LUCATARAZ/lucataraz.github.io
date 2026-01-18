// force-update.js
(function() {
    const VERSION = '20240119.2';
    const IS_MOBILE = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const MOBILE_KEY = 'mobile_version_force';
    const DESKTOP_KEY = 'desktop_version_force';
    
    console.log(`📱 Sistema di Force Update - Versione: ${VERSION}`);
    console.log(`📱 Dispositivo: ${IS_MOBILE ? 'MOBILE' : 'DESKTOP'}`);
    
    function forceRefresh() {
        const currentUrl = new URL(window.location.href);
        const timestamp = Date.now();
        
        // Rimuovi tutti i vecchi parametri cache
        currentUrl.searchParams.delete('v');
        currentUrl.searchParams.delete('t');
        currentUrl.searchParams.delete('cache');
        currentUrl.searchParams.delete('mobile');
        currentUrl.searchParams.delete('mobile_force');
        currentUrl.searchParams.delete('force');
        
        // Aggiungi nuovi parametri
        currentUrl.searchParams.set('v', VERSION);
        currentUrl.searchParams.set('t', timestamp);
        currentUrl.searchParams.set('cache', 'bust');
        currentUrl.searchParams.set('force', 'true');
        
        if (IS_MOBILE) {
            currentUrl.searchParams.set('mobile', 'force');
            currentUrl.searchParams.set('mobile_force', timestamp);
            console.log('📱 FORCING MOBILE REFRESH');
        }
        
        const newUrl = currentUrl.toString();
        
        if (newUrl !== window.location.href) {
            console.log('🔄 Reindirizzamento forzato alla nuova versione');
            
            // Force clear localStorage per mobile
            if (IS_MOBILE) {
                const importantKeys = [
                    'artistaPoliglotta_user',
                    'artistaPoliglotta_logo', 
                    'artistaPoliglotta_books',
                    'artistaPoliglotta_texts',
                    'artistaPoliglotta_backgrounds'
                ];
                
                Object.keys(localStorage).forEach(key => {
                    if (!importantKeys.includes(key)) {
                        localStorage.removeItem(key);
                    }
                });
                
                if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                        cacheNames.forEach(cacheName => {
                            caches.delete(cacheName);
                        });
                    });
                }
            }
            
            // Redirect con replace (non aggiunge alla history)
            setTimeout(() => {
                window.location.replace(newUrl);
            }, 500);
        }
    }
    
    // Controlla se è necessario forzare il refresh
    const storedVersion = localStorage.getItem(IS_MOBILE ? MOBILE_KEY : DESKTOP_KEY);
    const urlParams = new URLSearchParams(window.location.search);
    const hasForceParam = urlParams.has('force') || urlParams.has('mobile_force');
    
    if (!storedVersion || storedVersion !== VERSION || !hasForceParam) {
        localStorage.setItem(IS_MOBILE ? MOBILE_KEY : DESKTOP_KEY, VERSION);
        forceRefresh();
    } else {
        console.log('✅ Versione già aggiornata');
    }
    
    // Forza reload su back/forward
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('🔄 Pagina ricaricata dalla cache, forzo refresh');
            forceRefresh();
        }
    });
    
    // Forza refresh su visibility change
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            const currentTime = Date.now();
            const lastRefresh = parseInt(localStorage.getItem('last_refresh') || '0');
            
            // Se è passato più di 1 minuto, forza refresh
            if (currentTime - lastRefresh > 60000) {
                localStorage.setItem('last_refresh', currentTime.toString());
                forceRefresh();
            }
        }
    });
    
    console.log('✅ Sistema anti-cache attivo');
})();
