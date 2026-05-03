import httpInstance from "@/shared/services/http.instance.js";
import { Node } from "@/tour/model/node.entity.js";

const BASE = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class NodeService {
    /**
     * Obtiene la lista de todos los nodos disponibles.
     * Mapea los datos recibidos al modelo NodeResource definido en Java.
     */
    async getAll() {
        const response = await httpInstance.get(`/${BASE}`);
        return response.data.map(item =>
            new Node(item.id, item.panorama, item.thumbnail, item.caption)
        );
    }

    /**
     * Crea un nuevo nodo enviando un CreateNodeResource (MultipartFile).
     * Sobrescribe el header a multipart/form-data.
     */
    create(resource) {
        const formData = new FormData();
        formData.append('caption', resource.caption);
        formData.append('file', resource.file);

        return httpInstance.post(`/${BASE}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    /**
     * Crea un enlace entre dos nodos.
     * @param {number} fromNodeId - ID del nodo actual (Path Variable).
     * @param {ConnectNodeRequest} request - Datos de la conexión (RequestBody).
     */
    async connectNodes(fromNodeId, request) {
        const response = await httpInstance.post(`/${BASE}/${fromNodeId}/links`, request);
        return response.data;
    }

    /**
     * Agrega un marcador a un nodo específico.
     * @param {number|string} nodeId - ID del nodo (PathVariable).
     * @param {AddMarkerRequest} markerRequest - Datos del marcador (RequestBody).
     */
    async addMarkerToNode(nodeId, markerRequest) {
        try {
            const response = await httpInstance.post(
                `/${BASE}/${nodeId}/markers`,
                markerRequest
            );
            return response.data;
        } catch (error) {

            console.error("Error en el servicio de markers:", error);
            throw error;
        }
    }
}