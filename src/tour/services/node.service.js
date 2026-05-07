import httpInstance from "@/shared/services/http.instance.js";
import { Node } from "@/tour/model/node.entity.js";

const PROJECTS_PATH = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;
const NODES_PATH = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class NodeService {
    /**
     * Helper privado para construir la URL base: /projects/{projectId}/nodes
     */
    _getNodesUrl(projectId) {
        return `/${PROJECTS_PATH}/${projectId}/${NODES_PATH}`;
    }

    /**
     * Obtiene todos los nodos de un proyecto.
     */
    async getNodesByProjectId(projectId) {
        const response = await httpInstance.get(this._getNodesUrl(projectId));
        return response.data.map(item => Node.fromResponse(item));
    }

    /**
     * Crea un nodo enviando un CreateNodeRequest (MultipartFormData).
     */
    async createNode(projectId, createNodeRequest) {
        const formData = new FormData();
        formData.append('caption', createNodeRequest.caption);
        formData.append('file', createNodeRequest.file);

        const response = await httpInstance.post(
            this._getNodesUrl(projectId),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return Node.fromResponse(response.data);
    }

    /**
     * Elimina un nodo específico.
     */
    async deleteNode(projectId, nodeId) {
        await httpInstance.delete(`${this._getNodesUrl(projectId)}/${nodeId}`);
    }

    /**
     * Conecta nodos (Links).
     */
    async connectNodes(projectId, fromNodeId, connectNodeResource) {
        const response = await httpInstance.post(
            `${this._getNodesUrl(projectId)}/${fromNodeId}/links`,
            connectNodeResource
        );
        return response.data;
    }

    /**
     * Agrega un marcador a un nodo.
     */
    async addMarker(projectId, nodeId, addMarkerResource) {
        const response = await httpInstance.post(
            `${this._getNodesUrl(projectId)}/${nodeId}/markers`,
            addMarkerResource
        );
        return response.data;
    }
}