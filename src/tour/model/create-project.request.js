/**
 * Represents the data required to create a new project.
 * Matches CreateProjectResource.java
 */
export class CreateProjectRequest {
    /**
     * @param {string} title
     * @param {string} description
     */
    constructor(title = '', description = '') {
        this.title = title;
        this.description = description;
    }
}