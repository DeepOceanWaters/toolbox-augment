export default function generateUniqueId() {
    let id = 1000;
    while (document.getElementById(`a${++id}`));
    return `a${id}`;
}