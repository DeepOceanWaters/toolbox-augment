import Settings, {  } from "../AuditSettings.js";
import generateUniqueId from "../idGenerator.js";
import createRemoveEvent from "../RemoveEvent.js";
import CustomButton from "./Button.js";
import Component from "./Component.js";
import Disclosure from "./Disclosure.js";
import Fieldset from "./Fieldset.js";
import TextInput from "./TextInput.js";

export default class TestingEnvironmentsSection extends Component {

}

export class TestingEnvironmentGroup extends Disclosure {
    environment: Settings;

    constructor(environment: Settings) {
        super('Testing Environment');
        this.environment = environment;

        let heading = document.createElement('h3');
        heading.textContent = 'Testing Environment';

        this.controller.innerHTML = '';
        this.controller.appendChild(heading);
        this.controller.addEventListener('click', () => this.update());
        
        this.update();
    }

    private createInputSection(inputs: string[], label: string) {
        let addButton = new CustomButton('Add ' + label);
        let group = new Fieldset('Testing Software');
        group.items = inputs.map((s, i) => new RemovableComponent(new TextInput(`Software ${i + 1}`, { value: s})));
        group.items.push(addButton);
        group.update();

        addButton.button.addEventListener('click', (e) => {
            group.items.pop();
            let newItem = new RemovableComponent(new TextInput(`Software ${group.items.length}`))
            group.items.push(newItem);
            group.items.push(addButton);
            group.update();
            newItem.focus();
        });

        group.component.addEventListener('removeComponent', (e: CustomEvent) => {
            let item = e.detail;
            let index = group.items.indexOf(item);
            let itemToFocus: Component;
            if (index === 0) {
                itemToFocus = group.items[1];
            }
            else {
                itemToFocus = group.items[index - 1];
            }
            group.items.splice(index, 1);
            item.remove();
            group.update();
            itemToFocus.focus();
        });

        return group;
    }

    update() {
        let deviceModel = new TextInput('Device Model');
        let operatingSystem = new TextInput('Operating System');

        deviceModel.input.value = this.environment.settings["deviceModel"] || '';
        operatingSystem.input.value = this.environment.settings["operatingSystem"] || '';

        let envGroup = document.createElement('div');
        envGroup.append(
            deviceModel.component,
            operatingSystem.component
        );

        let softwareGroup = this.createInputSection(
            this.environment.settings["software"], 
            'Software'
        );

        let atGroup = this.createInputSection(
            this.environment.settings["assistiveTech"],
            'Assistive Technology'
        );

        let techGroup = document.createElement('div');
        techGroup.append(
            softwareGroup.component,
            atGroup.component
        );

        let save = new CustomButton('Save');
        save.button.addEventListener('click', () => {
            const groupToValue = (group: Fieldset) => {
                return group
                        .items
                        .filter(i => i instanceof RemovableComponent)
                        .filter(i => i.nestedComponent.input.value.trim() !== '')
                        .map(c => c.nestedComponent.input.value);
            }
            this.environment.settings["software"] = groupToValue(softwareGroup);
            this.environment.settings["assistiveTech"] = groupToValue(atGroup);
            this.environment.settings["operatingSystem"] = operatingSystem.input.value;
            this.environment.settings["deviceModel"] = deviceModel.input.value;
            this.environment.updateSettings();
        });

        this.controlled.innerHTML = '';
        this.controlled.append(
            envGroup,
            techGroup,
            save.component
        );
    }
}

class RemovableComponent<T extends Component> extends Component {
    nestedComponent: T;
    remove: CustomButton;
    removed: boolean;

    constructor(component: T) {
        super();
        this.removed = false;
        this.nestedComponent = component;
        this.remove = new CustomButton('Remove');
        this.component.append(
            this.nestedComponent.component,
            this.remove.component
        );

        this.remove.button.addEventListener('click', () => {
            this.component.dispatchEvent(createRemoveEvent(this));
        });
    }

    focus() {
        this.nestedComponent.focus();
    }
}