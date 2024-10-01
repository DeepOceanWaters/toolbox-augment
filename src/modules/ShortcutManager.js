import KeyboardShortcut from "./KeyboardShortcut.js";

/**
 * @member {Set} shortcuts all shortcuts currently available.
 * @member {Set} currentlyPressed currently pressed keys.
 * @member {Map<String, Set<KeyboardShortcut>>} key2shortcuts map of single key to a set of shortcuts
 *                                                            that use that key in their shortcut.
 * @member {Map<String, KeyboardShortcut>} keys2shortcut map of full keys to shortcut.
 * @member {[KeyboardShortcut]} log log of events fired.
 * @member {Integer} maxLogs max number of events logged. When full and placing 
 *                           a new event in the log, will remove oldest event.
 * @member {Function} onEventLog function called when an event is logged.
 */
export default class ShortcutManager {
    #shortcuts;
    #currentlyPressed;
    #key2shortcuts;
    #keys2shortcut;
    #log;
    #maxLogs;
    #onEventLog;

    /**
     * @param {[KeyboardShortcut]} shortcuts list of KeyboardShortcuts to initialize with.
     */
    constructor() {
        this.#shortcuts = new Set();
        this.#key2shortcuts = {};
        this.#keys2shortcut = {};
        this.#log = [];
        this.#maxLogs = 5;
        this.#currentlyPressed = new Set();

        /*
        for(const shortcut of shortcuts) {
            this.#shortcuts.add(shortcut);
            this.addFromShortcut(shortcut);
        }
        */
        window.addEventListener('keydown', (e) => { 
            this.#addKeypress(e);
        });
        window.addEventListener('keyup', (e) => { 
            this.#removeKeypress(e) 
        });
        window.addEventListener('blur', (e) => { this.#resetKeypresses(e) });
    }


    /**
     * Get the combined keys string that's used as a key for kyes2shortcut.
     * @param {KeyboardShortcut} shortcut 
     */
    static toFullKey(shortcut) {
        return ShortcutManager.set2key(shortcut.keys);
    }

    /**
     * Takes a set of strings that represent keys and combines them into a
     * key for the #keys2shortcut variable
     * @param {Set<String>} keys 
     */
    static set2key(keys) {
        let fullKey = "";
        for(const key of keys) {
            fullKey += "-" + key;
        }
        return fullKey;
    }

    /**
     * Adds a key down to the map
     * @param {Event} e event given by an event handler
     */
    #addKeypress(e) {
        this.#currentlyPressed.add(e.key.toLowerCase());
        this.#performShortcut(e, false);
    }

    /**
     * Removes a key press from the currentlyPressed set.
     * @param {Event} e 
     */
    #removeKeypress(e) {
        const keysKey = ShortcutManager.set2key(this.#currentlyPressed);
        this.#performShortcut(e, true);
        if (this.#currentlyPressed.has(e.key.toLowerCase())) {
            this.#currentlyPressed.delete(e.key.toLowerCase());
        }
    }

    /**
     * Used for the onBlur event. Clears the currently pressed when window loses focus.
     * @param {Event} e  the blur event object
     */
    #resetKeypresses(e) {
        this.#currentlyPressed.clear();
    }

    #performShortcut(e, onUp) {
        const keysKey = ShortcutManager.set2key(this.#currentlyPressed);
        if (this.#keys2shortcut.hasOwnProperty(keysKey)) {
            for(const shortcut of this.#keys2shortcut[keysKey]) {
                // js will not call shorcut.perform(e) if onUp === shorcut.onUp evals to false
                if (onUp === shortcut.onUp && shortcut.perform(e)) this.#logEvent(shortcut);
            }
        }
    }

    #updatekey2shortcuts(shortcut) {
        for(const key in shortcut.keys) {
            if (!this.#key2shortcuts.hasOwnProperty(key)) {
                this.#key2shortcuts[key] = new Set();
            }
            if (!this.#key2shortcuts[key].has(shortcut)) {
                this.#key2shortcuts[key].add(shortcut);
            }
        }
    }

    /**
     * Logs which shortcut was activated. Only the order in which the 
     * shortcuts were activated.
     * @param {KeyboardShortcut} shortcut 
     */
    #logEvent(shortcut) {
        // if above max logs, remove oldest event
        if (this.#log.length >= this.#maxLogs) {
            this.#log.shift();
        }
        // add the current shortcut 
        this.#log.push(shortcut);
        // if an on event log function exists, then call it.
        if (this.#onEventLog) {
            this.#onEventLog.call();
        }
    }

    /**
     * issues: 
     *      - order of eventhandler execution (if the users event executes before keyboard, 
     *        then th)
     *          answers :
     *              - create our own event when a shortcut is made.
     *                  Questions:
     *                      - can users restrict shortcut to particular elements? e.g. if 
     */
    
    /**
     * Returns 
     * @param {Boolean} completeOnly return only shortcuts that currently activated/complete
     * @returns a list of possible shortcuts given the currently pressed keys. If completeOnly
     *          then return only shortcuts that are complete (should only be one);
     */
    #currentShortcuts(completeOnly = true) {
        // get each key-[shorcut] combo
        // possible shortcuts will be present in EACH key-[shortcut] combo
        if (this.#currentlyPressed.length < 1) {
            return [];
        }
        else {
            let complete
        }
        // start with a base of all possible shortcuts 
        let possibleShortcuts = [...this.#currentlyPressed][0];
        // update possible shortcuts.
        for (let i = 1; i < this.#currentlyPressed.length; i++) {
            // get the next currently pressed key
            const key = this.#currentlyPressed[i];
            // get the list of associated shortcuts
            const shortcuts = this.#key2shortcuts[key];
            // remove any previously possible shortcuts if that shortcut does
            // not also appear in the list shortcuts related to the current key
            if (completeOnly) {
                possibleShortcuts = possibleShortcuts.filter(s => shortcuts.includes(s));
            }
            else {
                possibleShortcuts.push(...shortcuts);
            }
        }
        return possibleShortcuts;
    }

    #currentlyPressedKey() {
        return [...this.#currentlyPressed]
                    .sort()
                    .reduce((fullKey, curKey) => fullKey + curKey + '+', '');
    }

    /**
     * Add a keyboard shorcut to the manager.
     * @param {KeyboardShortcut} shortcut 
     */
    addFromShortcut(shortcut) {
        if (!shortcut) {
            console.warn('Could not add shortcut, there is no shortcut');
        }
        // add to this.#shortcuts
        this.#shortcuts.add(shortcut);
        // add to this.#key2shortcuts
        for(const key in shortcut.keys) {
            if (!this.#key2shortcuts.hasOwnProperty(key)) {
                this.#key2shortcuts[key] = new Set();
            }
            this.#key2shortcuts[key].add(shortcut);
        }
        // add to this.#keys2shortcut
        const shortcutKeysKey = ShortcutManager.toFullKey(shortcut);
        if (!this.#keys2shortcut.hasOwnProperty(shortcutKeysKey)) {
            this.#keys2shortcut[shortcutKeysKey] = [];
        }
        this.#keys2shortcut[shortcutKeysKey].push(shortcut);
        const addedShortcutEvent = new CustomEvent('addedShortcut', {
            detail: { 
                shortcut: shortcut
            }
        });
        document.dispatchEvent(addedShortcutEvent);
    }

    /**
     * Add a shortcut to the manager.
     * @param {[String]} keys an array of key names.
     * @param {Function} func the function to call when the shortcut is pressed
     * @param {String} name the name of the shortcut.
     * @param {HTMLElement} context the element scope. Will only activate func 
     *      if the shortcut is pressed while in the element scope.
     * @param {Number} throttle the amount of time (in ms) to throttle input before 
     *      repeating the command
     * @param {Boolean} onUp determines whether the to fire on keyup; true is on keyup;
     *      false is on keydown.
     * @param {String} description describes the shortcut in more detail.
     */
    add(keys, func, { name, context, throttle, onUp, description }) {
        const shortcut = new KeyboardShortcut(
            name, 
            keys, 
            func, 
            context, 
            throttle, 
            onUp, 
            description
        );
        this.addFromShortcut(shortcut);
        return shortcut;
    }

    /**
     * Remove a shortcut from the 
     * @param {KeyboardShortcut} shortcut 
     */
    remove(shortcut) {
        this.#shortcuts.delete(shortcut);
    }

    /**
     * Removes a keyboard shortcut based on it's name.
     * @param {String} name KeyboardShortcut name
     */
    removeByName(name) {
        const shortcutsWithName = [...this.#shortcuts].filter(s => s.name === name);
        if (shortcutsWithName < 1) {
            console.warn(`No shortcut found with name: ${name}`);
        }
        else if (shortcutsWithName > 1) {
            console.warn(`${shortcutsWithName.length} shortcuts with the same name found. Name: ${name}`);
        }
        else {
            // only executes if there is a single shortcut with the name found
            this.remove(shortcutsWithName[0]);
        }
    }

    /**
     * Changes the keys used to activate the shorcut.
     * @param {Shorcut} shortcut the shortcut
     * @param {Array<String>} newKeys an array of strings that represent keys. The
     *      combination of these keys will be the new way to activate this shortcut. 
     * @returns [0, 1]: 0 means it did not change; 1 means it successfully changed.
     */
    changeShortcut(shortcut, newKeys) {
        let returnCode = 1;
        if (!shortcut) {
            console.warn(`No shorcut given`);
            returnCode = 0;
        }
        else {
            shortcut.changeShortcut(newKeys);
        }
        const changeShortcutEvent = new CustomEvent('changeShortcut', {
            detail: {
                shortcut: shortcut
            }
        });
        document.dispatchEvent(changeShortcutEvent);
        return returnCode;
    }

    /**
     * Searchs for all Shorcuts that include the searched text in their name.
     * @param {String} text text to search
     * @returns an array of all shortcuts that include the text in their name.
     */
    searchShorcuts(text) {
        return [...this.#shortcuts]
            .filter(shorcut => shorcut.name.toLowerCase().includes(text.toLowerCase()));
    } 

    #shortcut2Key(shortcut) {
        return [...shortcut.keys].sort().reduce((prev, key) => { prev + key }, "");
    }

    /**
     * Return only shortcuts that are currently active.
     */
    get currentValidShortcuts() {
        return this.#currentShortcuts(true);
    }

    get currentPotentialShortcuts() {
        return this.#currentShortcuts(false);
    }

    get currentlyPress() {
        return [...this.#currentlyPressed];
    }

    get eventLog() {
        return [...this.#log];
    }

    get shortcuts() {
        return this.#shortcuts;
    }

}