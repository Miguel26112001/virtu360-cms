import httpInstance from "@/shared/services/http.instance.js";
import { ProjectSummaryResource } from "@/tour/model/project-summary.resource.js";

const BASE = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;

export class ProjectService {
    /**
     * Obtiene los proyectos filtrados por el ID del propietario.
     * Mapea la respuesta al ProjectSummaryResource.
     * @param {string} ownerId - El identificador del dueño (por defecto 'demo-user').
     * @returns {Promise<ProjectSummaryResource[]>}
     */
    async getByOwnerId(ownerId = 'demo-user') {
        const response = await httpInstance.get(`/${BASE}`, {
            params: { ownerId }
        });

        return response.data.map(item => new ProjectSummaryResource(item));
    }

    /**
     * Crea un nuevo proyecto.
     * @param {Object} projectData - Datos del proyecto (title, description).
     */
    async create(projectData) {
        const payload = {
            ...projectData,
            ownerId: 'demo-user'
        };
        const response = await httpInstance.post(`/${BASE}`, payload);
        return response.data;
    }
}