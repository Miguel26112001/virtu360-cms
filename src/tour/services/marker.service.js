import httpInstance from "@/shared/services/http.instance.js";
import { Marker } from "@/tour/model/marker.entity.js";

const PROJECTS_PATH = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;
const NODES_PATH = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class MarkerService {
    /**
     * Helper privado para construir la base: /api/v1/projects/{projectId}/nodes/{nodeId}
     */
    _getMarkersBaseUrl(projectId, nodeId) {
        return `/${PROJECTS_PATH}/${projectId}/${NODES_PATH}/${nodeId}`;
    }

    /**
     * Obtiene todos los marcadores de un nodo (usando el endpoint genérico)
     */
    async getMarkersByNodeId(projectId, nodeId) {
        const response = await httpInstance.get(`${this._getMarkersBaseUrl(projectId, nodeId)}/markers`);
        return response.data.map(item => Marker.fromResponse(item));
    }

    /**
     * Agrega un Info Marker
     */
    async addInfoMarker(projectId, nodeId, infoMarkerRequest) {
        const response = await httpInstance.post(
            `${this._getMarkersBaseUrl(projectId, nodeId)}/info-markers`,
            infoMarkerRequest
        );
        return Marker.fromResponse(response.data);
    }

    /**
     * Agrega un Video Marker
     */
    async addVideoMarker(projectId, nodeId, videoMarkerRequest) {
        const response = await httpInstance.post(
            `${this._getMarkersBaseUrl(projectId, nodeId)}/video-markers`,
            videoMarkerRequest
        );
        return Marker.fromResponse(response.data);
    }

    /**
     * Agrega un Gallery Marker
     */
    async addGalleryMarker(projectId, nodeId, galleryMarkerRequest) {
        const response = await httpInstance.post(
            `${this._getMarkersBaseUrl(projectId, nodeId)}/gallery-markers`,
            galleryMarkerRequest
        );
        return Marker.fromResponse(response.data);
    }

    /**
     * Elimina cualquier tipo de marcador
     */
    async deleteMarker(projectId, nodeId, markerId) {
        await httpInstance.delete(`${this._getMarkersBaseUrl(projectId, nodeId)}/markers/${markerId}`);
    }
}