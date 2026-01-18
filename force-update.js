// GitHub Pages Cache Buster
(function() {
    // Questo file viene aggiornato ad ogni deploy
    const GITHUB_BUILD_VERSION = '{{GITHUB_BUILD_ID}}';
    const DEPLOY_TIME = '{{DEPLOY_TIMESTAMP}}';
    
    console.log('⚡ GitHub Pages Force Update v2');
    console.log('🏗️ Build:', GITHUB_BUILD_VERSION);
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isGitHub = window.location.hostname.includes('github.io');
    
    if (isGitHub) {
        // Controlla il file .build per verificare se è stato aggiornato
        fetch('/.build')
            .then(response => response.text())
            .then(buildInfo => {
                const lines = buildInfo.split('\n');
                const buildTimestamp = lines[0];
                const storedTimestamp = localStorage.getItem('github_build_timestamp');
                
                if (storedTimestamp !== buildTimestamp) {
                    console.log('🔄 Nuova build rilevata! Forzando refresh...');
                    localStorage.setItem('github_build_timestamp', buildTimestamp);
                    
                    const url = new URL(window.location.href);
                    url.searchParams.set('gh_build', GITHUB_BUILD_VERSION);
                    url.searchParams.set('t', Date.now());
                    url.searchParams.set('force_update', 'true');
                    
                    if (isMobile) {
                        url.searchParams.set('mobile', 'force');
                    }
                    
                    setTimeout(() => {
                        window.location.replace(url.toString());
                    }, 300);
                }
            })
            .catch(error => {
                console.log('⚠️ Impossibile verificare build info:', error);
            });
    }
})();
