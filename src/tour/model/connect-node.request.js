export class ConnectNodeRequest {
    /**
     * @param {number} toNodeId - ID del nodo destino.
     * @param {number} yaw - Coordenada horizontal (esférica).
     * @param {number} pitch - Coordenada vertical (esférica).
     */
    constructor(toNodeId = 0, yaw = 0, pitch = 0) {
        this.toNodeId = toNodeId;
        this.yaw = yaw;
        this.pitch = pitch;
    }
}