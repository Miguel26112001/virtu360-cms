export class Link {
    /**
     * @param {string} from - ID o nombre del nodo origen.
     * @param {string} to - ID o nombre del nodo destino.
     * @param {number} textureX - Coordenada X en la textura (Panorama).
     * @param {number} textureY - Coordenada Y en la textura (Panorama).
     */
    constructor(from = '', to = '', textureX = 0, textureY = 0) {
        this.from = from;
        this.to = to;
        this.textureX = textureX;
        this.textureY = textureY;
    }
}