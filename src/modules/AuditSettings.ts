
enum AuditType {
    AUDIT = 'Audit',
    FINAL_CHECKS = 'Final Checks',
    SPOT_CHECK = 'Spot Check'
}

enum StorageType {
    SESSION = 'session',
    LOCAL = 'local',
    SYNC = 'sync'
}


export class Settings {
    storageType: StorageType;
    settings: {};
    protected type: string;
    protected name: string;
    protected isUpdating: boolean;
    static settingsID = 'ability-settings';
    static settingsNamesId = 'settings-names';

    constructor(name: string, storageType: StorageType) {
        this.storageType = storageType;
        this.isUpdating = false;
        this.settings["name"] = name;
    }

    static async getSettings(types: StorageType[] = Object.values(StorageType)) {
        let settings = {};
        for (let storageType of types) {
            let storage = chrome.storage[storageType];
            let typeSettings = await storage.get(Settings.settingsID);
            settings[storageType] = typeSettings[Settings.settingsID];
        }
        return settings;
    }

    static async fromName(name: string, storageType: StorageType) {
        let settings = await chrome.storage[storageType].get(name);
        return settings;
    }

    async retrieveSettings() {
        if (this.isUpdating) return false;
        this.isUpdating = true;
        this.settings = await chrome.storage[this.storageType].get(this.name)[this.name];
        this.isUpdating = false;
        return true;
    }

    async updateSettings() {
        if (this.isUpdating) return false;
        this.isUpdating = true;
        let settings = {};
        settings[`${this.name}`] = this.settings;
        await chrome.storage[this.storageType].set(settings);
        this.isUpdating = false;
        return true;
    }

    setSetting(name: string, data: any) {
        if (!Object.keys(this.settings).includes(name)) {
            return false;
        }
        this.settings[name] = data;
        this.updateSettings();
    }

    setName(name: string) {
        let nameExists = Settings.checkName(name);
        if (nameExists) return false;
        Settings.addName(name, this.storageType);
        this.name = name;
    }

    getName() {
        return this.name;
    }

    copySettings(settings) {
        for(let key in settings) {
            this.settings[key] = settings[key];
        }
    }

    static checkName(name: string, types = Object.values(StorageType)) {
        let settingsNames = Settings.getSettings(types);
        let names = [];
        for(let type of Object.keys(settingsNames)) {
            let settings: object[] = settingsNames[type];
            if (settings.find(o => o["name"] === name)) return true;
        }
        return false;
    }

    static addName(name: string, storageType: StorageType) {

        let names = chrome.storage[storageType].get()
    }
}

interface TestingEnvironmentObject {
    name: string,
    operatingSystem?: string,
    deviceModel?: string,
    assistiveTech: string[],
    software: string[],
}

export class TestingEnvironment extends Settings {
    settings: TestingEnvironmentObject

    constructor(name: string) {
        super(name, StorageType.LOCAL);
        this.settings.operatingSystem = '';
        this.settings.deviceModel = '';
        this.settings.assistiveTech = [];
        this.settings.software = [];
        this.type = 'testing-environment';
    }

    static fromSettings(settings: TestingEnvironmentObject) {
        let environment = new TestingEnvironment(settings.name);
        environment.copySettings(settings);
        return environment;
    }

    addSoftware(software: string) {
        this.settings.software.push(software);
        this.setSetting("software", this.settings.software);
    }

    removeSoftware(software: string) {
        this.setSetting('software', this.settings.software.filter(s => s !== software));
    }

    setSoftware(software: string[]) {
        this.setSetting('software', software);
    }

    addAssistiveTech(tech: string) {
        this.settings.assistiveTech.push(tech);
        this.setSetting("assistiveTech", this.settings.assistiveTech);
    }

    removeAssistiveTech(assistiveTech: string) {
        this.setSetting('assistiveTech', this.settings.assistiveTech.filter(s => s !== assistiveTech));
    }

    setAssistiveTech(assistiveTech: string[]) {
        this.setSetting('assistiveTech', assistiveTech);
    }

    setStorageType(type: StorageType) {
        this.storageType = type;
    }
}

interface AuditSettingsObject {
    name: string,
    auditId: string
    auditType: AuditType,
    auditNumber: number
}

export class AuditSettings extends Settings {
    settings: AuditSettingsObject

    constructor(auditId: string) {
        super(`audit-${auditId}`, StorageType.SYNC);
        this.settings.auditId = auditId;
    }

    static fromSettings(settings: AuditSettingsObject) {
        let environment = new AuditSettings(settings.name);
        environment.copySettings(settings);
        return environment;
    }

    set auditId(id: string) {
        this.setSetting("auditId", id);
    }

    set auditType(type: AuditType) {
        this.setSetting("auditId", type);
    }

    set auditNumber(num: number) {
        this.setSetting("auditNumber", num);
    }
}