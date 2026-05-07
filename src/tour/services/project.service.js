import httpInstance from "@/shared/services/http.instance.js";
import { ProjectSummaryResource } from "@/tour/model/project-summary.resource.js";
import { CreateProjectRequest } from "@/tour/model/create-project.request.js";

const BASE = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;

export class ProjectService {
    /**
     * Obtiene los proyectos filtrados por el ID del propietario.
     * @param {string} ownerId
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
     * @param {CreateProjectRequest} createProjectRequest - Datos del proyecto.
     */
    async create(createProjectRequest) {
        const response = await httpInstance.post(`/${BASE}`, createProjectRequest);
        return response.data;
    }

    /**
     * Elimina un proyecto por su UUID.
     * @param {string} projectId - El UUID del proyecto a eliminar.
     * @returns {Promise<void>}
     */
    async delete(projectId) {
        await httpInstance.delete(`/${BASE}/${projectId}`);
    }
}