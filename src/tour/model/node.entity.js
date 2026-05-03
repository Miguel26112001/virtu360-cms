/**
 * Representa el recurso que devuelve el backend (NodeResource)
 */
export class Node {
    constructor(id = '', panorama = '', thumbnail = '', caption = '') {
        this.id = id;
        this.panorama = panorama;
        this.thumbnail = thumbnail;
        this.caption = caption;
    }
}