
(async () => {



    let componentsSelect = document.getElementById('component-id');
    const submitComponent = document.getElementById('add-component-submit');
    const log = document.getElementById('log');
    let testbtn = document.getElementById('test');
    testbtn.addEventListener('click', async (e) => {
        logIt('testbtn clicked, sending message');
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        logIt(tab.id);
        try {
            const response = await chrome.tabs.sendMessage(tab.id, {
                greeting: "hello",
            });
            logIt(response.farewell + '-response!');
        } catch (e) {
            logIt(e.message);
        }
    });

    let auditId = await getAuditId();
    logIt(auditId);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            logIt(request.farewell);
        }
    );



    function logIt(text) {
        let li = document.createElement('li');
        li.textContent = text;
        log.append(li);
    }

    function addComponent(e) {

    }

    /**
     * Side-effect. Populates the given <select> element with components relevant to the current audit.
     * @param {HTMLSelectElement} select the select elemnt to populate with component name values
     */
    async function populateComponentSelect(select) {
        const components = await getComponents();
        for (const [id, component] of Object.entries(components)) {
            let option = document.createElement('option');
            option.value = id;
            option.textContent = component.name;
            select.appendChild(option);
        }
    }

    /**
     * 
     */
    async function getComponents() {
        let tab = chrome.tabs.query({ active: true })[0];

        throw new Error('not yet complete');
        // components: { id: componentObject }
        return components;
    }

    async function getAuditId() {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
        logIt(response?.farewell);
        let tabs = await chrome.tabs.query({ active: true });
        //let tab = tabs[0];
        logIt(Object.keys(tab));
        logIt(tab.url);
        logIt(tab.title);
        let urlParts = tab.url.split('/');
        let id = urlParts[urlParts.length - 1];
        return id;
    }
})();