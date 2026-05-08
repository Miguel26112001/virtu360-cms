/**
 * Representa los datos necesarios para conectar dos nodos (ConnectNodeResource).
 */
export class ConnectNodeRequest {
    /**
     * @param {string} toNodeId - UUID del nodo destino.
     * @param {number} yaw - Coordenada horizontal (esférica).
     * @param {number} pitch - Coordenada vertical (esférica).
     */
    constructor(toNodeId = '', yaw = 0, pitch = 0) {
        this.toNodeId = toNodeId;
        this.yaw = yaw;
        this.pitch = pitch;
    }
}