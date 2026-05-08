import { Node } from "./node.entity.js";

export class ProjectDetails {
    constructor(data = {}) {
        this.id = data.id || '';
        this.ownerId = data.ownerId || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.published = data.published || false;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.nodes = Array.isArray(data.nodes)
            ? data.nodes.map(nodeData => Node.fromResponse(nodeData))
            : [];
    }

    /**
     * Helper para transformar la respuesta de la API
     */
    static fromResponse(data) {
        return new ProjectDetails(data);
    }
}