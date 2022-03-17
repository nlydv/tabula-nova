import Dexie from "./vendor/dexie.min.js";

let logos;

async function getIcon(url) {
    let icon = null;

    const domain = new URL(url).hostname.replace(/^www\./, "");
    const path = new URL(url).pathname.substr(1);
    const match = logos.find(l => {
        let urlObj = new URL(l.url);
        return (urlObj.hostname + urlObj.pathname).match(`${domain}/${path}`);
    });

    if ( match ) {
        if ( match.files.length > 1 ) {
            icon = match.files.find(l => l.includes("icon.svg"))
                ?? match.files.find(l => ! l.includes("-"))
                ?? match.files[0];
        } else {
            icon = match.files[0];
        }

        icon = `url("/main/img/logos/logos/${icon}")`;
    }

    const fallback = `url("https://private-copper-impala.faviconkit.com/${new URL(url).host}/1024")`;
    return icon ?? fallback;
}

function insertBookmark(node) {
    const section = document.querySelector("main section.bookmarks");
    const button = document.createElement("A");

    button.setAttribute("id", node.id);
    button.setAttribute("href", node.url);

    getIcon(node.url).then(url => button.style.backgroundImage = url);
    button.innerHTML = `<p>${node.title}</p>`;

    section.appendChild(button);
    return true;
}

(async () => {
    logos = await fetch("/main/img/logos/logos.json").then(i => i.json());
    const shortcuts = await chrome.bookmarks.getChildren("5");
    shortcuts.forEach(b => insertBookmark(b));
})();
