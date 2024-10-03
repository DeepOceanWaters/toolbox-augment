
enum AuditType {
    AUDIT = 'Audit',
    FINAL_CHECKS = 'Final Checks',
    SPOT_CHECK = 'Spot Check'
}

enum StorageType {
    SESSION,
    LOCAL,
    SYNC
}

const listOfNames: string[] = []; 

abstract class Settings {
    storageType: StorageType;
    settings: {};
    protected type: string;
    protected name: string;
    protected isUpdating: boolean;

    constructor(name: string, storageType: StorageType) {
        this.storageType = storageType;
        this.isUpdating = false;
        this.setName(name);
    }

    async retrieveSettings() {
        if (this.isUpdating) return false;
        this.isUpdating = true;
        let settings;
        switch(this.storageType) {
            case StorageType.SESSION:
                settings = await chrome.storage.session.get(this.name);
                break;
            case StorageType.LOCAL:
                settings = chrome.storage.local.get(this.name);
                break;
            case StorageType.SYNC:
                settings = await chrome.storage.sync.get(this.name);
                break;
        }
        this.settings = settings;
        this.isUpdating = false;
        return true;
    }

    async updateSettings() {
        if (this.isUpdating) return false;
        this.isUpdating = true;
        let settings = {};
        settings[`${this.name}`] = this.settings;
        switch(this.storageType) {
            case StorageType.SESSION:
                await chrome.storage.session.set(settings);
                break;
            case StorageType.LOCAL:
                await chrome.storage.local.set(settings);
                break;
            case StorageType.SYNC:
                await chrome.storage.sync.set(settings);
                break;
        }
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
        Settings.addName(name);
        this.name = name;
    }

    getName() {
        return this.name;
    }

    static checkName(name: string) {
        return listOfNames.includes(name);
    }

    static addName(name: string) {
        listOfNames.push(name);
    }
}

class TestingEnvironment extends Settings {
    auditSettings: {
        operatingSystem?: string,
        computerModel?: string,
        assistiveTech: string[],
        software: string[],    
    }

    constructor(name: string, assistiveTech: string[], software: string[]) {
        super(name, StorageType.LOCAL);
        this.auditSettings.assistiveTech = assistiveTech;
        this.auditSettings.software = software;
        this.type = 'testing-environment';
    }

    addSoftware(software: string) {
        this.auditSettings.software.push(software);
        this.setSetting("software", this.auditSettings.software);
    }

    removeSoftware(software: string) {
        this.setSetting('software', this.auditSettings.software.filter(s => s !== software));
    }

    addAssistiveTech(tech: string) {
        this.auditSettings.assistiveTech.push(tech);
        this.setSetting("assistiveTech", this.auditSettings.assistiveTech);
    }

    removeAssistiveTech(assistiveTech: string) {
        this.setSetting('assistiveTech', this.auditSettings.assistiveTech.filter(s => s !== assistiveTech));
    }

    setStorageType(type: StorageType) {
        this.storageType = type;
    }
}

class AuditSettings extends Settings {
    auditSettings: {
        auditId: string
        auditType: AuditType
        auditNumber: number
    }

    constructor(auditId: string) {
        super(`audit-${auditId}`, StorageType.SYNC);
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