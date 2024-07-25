/**
 * Represents a keyboard shortcut.
 * @member {String} name the name of the shortcut.
 * @member {String} description a short description of what the shortcut does.
 * @member {Set<String>} keys a list of strings representing keyboard keys.
 * @member {Function} func the function called when the shorcut is activated.
 */
export default class KeyboardShortcut {
    #name;
    #description;
    #keys;
    #func;
    #contextElement;
    #onUp;
    #throttle;
    #timerID;
    
    
    /**
     * @param {String} name name of the shortcut
     * @param {[String]} keys names of keys for this shortcut
     */
    constructor(name, keys, func, contextElement, throttle, onUp, description) {
        this.#keys = new Set();
        if (!keys) {
            console.warn(`No keys given, can't make a shortcut for: ${name}`);
        }
        else {
            for(const key of keys) {
                this.#keys.add(key.toLowerCase());
            }
        }
        this.#name = name;
        this.#description = description;
        this.#func = func;
        this.#contextElement = contextElement || document;
        this.#throttle = throttle || 0;
        this.#onUp = onUp || false;
    }

    contains(key) {
        return this.keyNames.includes(keyName);
    }

    changeKeys(newKeys) {
        this.#keys = newKeys;
    }

    /**
     * 
     * @param {Event} e the event object 
     */
    perform(e) {
        let didPerform = false;
        if (this.#contextElement.contains(e.target)) {
            // if we aren't repeating, we should call
            let shouldCall = true;
            if (!e.repeat) {
                clearTimeout(this.#timerID);
                this.#timerID = undefined;
            }
            // if throttle is defined (we count 0 as non-defined) then:
            else if (this.#throttle > 0 && (shouldCall = this.#timerID === undefined)) {
                this.#timerID = setTimeout(() => this.#timerID = undefined, this.#throttle);
            }
            // else: (event is repeating, and there is no throttle) we should call the function
            if (shouldCall) {
                this.#func(e, this.#contextElement);
                didPerform = true;
            }
        }
        return didPerform;
    }

    /** getters **/
    get name() {
        return this.#name;
    }

    get keys() {
        return new Set(this.#keys);
    }

    get fullKey() {
        return ShortcutManager.set2key(this.#keys);
    }

    get onUp() {
        return this.#onUp;
    }

    get contextElement() {
        return this.#contextElement;
    }

    get description() {
        return this.#description;
    }

    /** setters **/

    set func(func) {
        this.#func = func;
    }
}




