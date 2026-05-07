import httpInstance from "@/shared/services/http.instance.js";
import { Node } from "@/tour/model/node.entity.js";

const PROJECTS_PATH = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;
const NODES_PATH = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class NodeService {
    /**
     * Private helper to build the base URL: /projects/{projectId}/nodes
     */
    _getNodesUrl(projectId) {
        return `/${PROJECTS_PATH}/${projectId}/${NODES_PATH}`;
    }

    /**
     * Get all nodes belonging to a project.
     */
    async getNodesByProjectId(projectId) {
        const response = await httpInstance.get(this._getNodesUrl(projectId));
        return response.data.map(item => Node.fromResponse(item));
    }

    /**
     * Create a new node using MultipartFormData (Panorama Image and Caption).
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
     * Delete a specific node from a project.
     */
    async deleteNode(projectId, nodeId) {
        await httpInstance.delete(`${this._getNodesUrl(projectId)}/${nodeId}`);
    }

    /**
     * Connect two nodes by creating a link.
     */
    async connectNodes(projectId, fromNodeId, connectNodeRequest) {
        const response = await httpInstance.post(
            `${this._getNodesUrl(projectId)}/${fromNodeId}/links`,
            connectNodeRequest
        );
        return response.data;
    }

    /**
     * Get all links for a specific node.
     */
    async getNodeLinks(projectId, nodeId) {
        const response = await httpInstance.get(
            `${this._getNodesUrl(projectId)}/${nodeId}/links`
        );
        return response.data;
    }

    /**
     * Deletes a link from the node
     */
    async deleteLink(projectId, nodeId, linkId) {
        await httpInstance.delete(`${this._getNodesUrl(projectId)}/${nodeId}/links/${linkId}`);
    }

    /**
     * Add a marker to a specific node.
     */
    async addMarker(projectId, nodeId, addMarkerRequest) {
        const response = await httpInstance.post(
            `${this._getNodesUrl(projectId)}/${nodeId}/markers`,
            addMarkerRequest
        );
        return response.data;
    }

    /**
     * Get all markers for a specific node.
     */
    async getNodeMarkers(projectId, nodeId) {
        const response = await httpInstance.get(
            `${this._getNodesUrl(projectId)}/${nodeId}/markers`
        );
        return response.data;
    }
}