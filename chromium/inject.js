(function () {
    const HOOK_TAG = '[Extension@netflix-bypass]';
    const operationNamesToBlock = [
        "CLCSInterstitialLolomo",
        "CLCSInterstitialPlaybackAndPostPlayback",
    ];
    let lastUrl = location.href;

    function injectFetchHook() {
        if (window.fetch.toString().includes(HOOK_TAG)) return;
        console.log(`${HOOK_TAG} Injecting script into page`);

        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            console.debug(`${HOOK_TAG} Intercepted fetch request:`, input, init);

            try {
                const url = typeof input === 'string' ? input : input.url;

                if (
                    url.includes('web.prod.cloud.netflix.com/graphql') &&
                    init &&
                    typeof init.body === 'string'
                ) {
                    let parsed;
                    try {
                        parsed = JSON.parse(init.body);
                    } catch (e) {
                        console.warn(`${HOOK_TAG} Failed to parse request body:`, e);
                    }

                    if (
                        parsed &&
                        operationNamesToBlock.includes(parsed.operationName)
                    ) {
                        console.log(`${HOOK_TAG} Netflix request blocked: ${parsed.operationName}`);
                        return new Response("{}", {
                            status: 200,
                            statusText: 'OK',
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                }
            } catch (e) {
                console.error(`${HOOK_TAG} Error in fetch interception:`, e);
            }

            return originalFetch.apply(this, arguments);
        };

        console.log(`${HOOK_TAG} Fetch hook injected`);
    }

    function monitorSPAMutations() {
        const observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (lastUrl !== currentUrl && !window.fetch.toString().includes(HOOK_TAG)) {
                console.log(`${HOOK_TAG} SPA change detected, reinjecting fetch hook, current URL: ${currentUrl}`);
                lastUrl = currentUrl;
                injectFetchHook();
            }
        });

        observer.observe(document, {
            subtree: true,
            childList: true
        });
    }

    injectFetchHook();
    monitorSPAMutations();
})();