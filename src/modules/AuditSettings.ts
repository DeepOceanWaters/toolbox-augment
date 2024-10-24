export enum AuditType {
    AUDIT = 'Audit',
    FINAL_CHECKS = 'Final Checks',
    SPOT_CHECK = 'Spot Check'
}

export enum StorageType {
    SESSION = 'session',
    LOCAL = 'local',
    SYNC = 'sync'
}

type PossibleSettings = TestingEnvironment | AuditSettings;

interface SettingsObject {
    name: string,
    type: StorageType
}

export interface TestingEnvironment extends SettingsObject {
    operatingSystem?: string,
    deviceModel?: string,
    assistiveTech: string[],
    software: string[],
}

export interface AuditSettings extends SettingsObject {
    auditId: string
    auditType: AuditType,
    auditNumber: number
}


export default class Settings {
    storageType: StorageType;
    settings: {};
    protected type: string;
    static settingsID = 'ability-settings';

    constructor(name: string, storageType: StorageType) {
        this.storageType = storageType;
        this.settings["name"] = name;
        this.setupSettings();
    }

    static fromSettings(settings: PossibleSettings, storageType: StorageType = StorageType.LOCAL) {
        let environment = new Settings(settings.name, storageType);
        environment.copySettings(settings);
        return environment;
    }

    static async fromName(name: string) {
        let typeSettings = await Settings.getSettings();
        let settings, type;
        for (let key in typeSettings) {
            if (typeSettings[key].hasProperty(name)) {
                settings = typeSettings[key][name];
                type = key;
            }
        }
        if (!settings) return null;
        let environment = Settings.fromSettings(settings, type);
        return environment;
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

    async setValue(target, prop, newValue, receiver) {
        if (prop === 'name') {
            let storageTypeSettings = await Settings.getSettings([target.type]);
            // ensure that new name is not already present, if it is we modify it
            // @ts-ignore
            if (storageTypeSettings.hasProperty(newValue)) {
                let count = 0;
                // @ts-ignore
                while (storageTypeSettings.hasProperty(newValue + count++));
                newValue += count;
            }
            // @ts-ignore
            if (storageTypeSettings.hasProperty(target.name)) {
                delete storageTypeSettings[target.name];
            }
        }
        else if (prop === 'type') {
            let storageSettingsType = await Settings.getSettings([this.storageType]);
            delete storageSettingsType[this.storageType][this.settings["name"]]
            this.storageType = newValue;
        }
        let returnValue = Reflect.set(target, prop, newValue, receiver);
        await this.updateSettings();
        return returnValue;
    }

    private async setupSettings() {
        let currentSettings = this;
        this.settings = new Proxy(this.settings, {
            set(target, prop, newValue, receiver) {
                currentSettings.setValue(target, prop, newValue, receiver);
                return true;
            }
        });
    }

    async updateSettings() {
        let settings = (await Settings.getSettings([this.storageType]))[this.storageType];
        settings[`${this.settings["name"]}`] = this.settings;
        await chrome.storage[this.storageType].set(settings);
        return true;
    }

    copySettings(settings) {
        for (let key in settings) {
            this.settings[key] = settings[key];
        }
    }
}


