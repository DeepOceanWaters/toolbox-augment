export default function createRemoveEvent(data: any) {
    let event = new CustomEvent('removeComponent', { bubbles: true, detail: data });
    return event;
}