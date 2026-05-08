export class UpdateProjectRequest {
    /**
     * @param {string} title
     * @param {string} description
     * @param {string|null} startingNodeId - UUID del nodo inicial
     */
    constructor(title, description, startingNodeId = null) {
        this.title = title;
        this.description = description;
        this.startingNodeId = startingNodeId;
    }
}