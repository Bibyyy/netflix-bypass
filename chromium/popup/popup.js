document.getElementById('code-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/Bibyyy/netflix-bypass' });
});

document.getElementById('bug-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/Bibyyy/netflix-bypass/issues/new?template=bug_report.md' });
});

document.addEventListener("DOMContentLoaded", async () => {
    const versionEl = document.getElementById("version");
    if (versionEl) {
        const manifestData = chrome.runtime.getManifest();
        versionEl.textContent = `v${manifestData.version}`;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url) return;

    const url = new URL(tab.url);

    const container = document.getElementById('popup-content');

    if (url.hostname.includes('netflix.com')) {
        container.innerHTML = `<p>Netflix detected, extension active.</p>`;
    } else {
        container.innerHTML = `<p>Site not supported, works only on Netflix.</p>`;
    }
});
