import httpInstance from "@/shared/services/http.instance.js";
import { ProjectSummaryResource } from "@/tour/model/project-summary.resource.js";
import { CreateProjectRequest } from "@/tour/model/create-project.request.js";
import {ProjectDetails} from "@/tour/model/project-details.entity.js";

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
     * Obtiene el detalle completo de un proyecto incluyendo sus nodos.
     * @param {string} projectId - UUID del proyecto
     * @returns {Promise<ProjectDetails>}
     */
    async getById(projectId) {
        const response = await httpInstance.get(`/${BASE}/${projectId}`);
        return ProjectDetails.fromResponse(response.data);
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

    /**
     * Actualiza los datos básicos del proyecto.
     * @param {string} projectId
     * @param {UpdateProjectRequest} updateProjectRequest
     */
    async update(projectId, updateProjectRequest) {
        const response = await httpInstance.put(`/${BASE}/${projectId}`, updateProjectRequest);
        return response.data;
    }

    /**
     * Publica el proyecto para que sea visible globalmente.
     * @param {string} projectId
     */
    async publish(projectId) {
        const response = await httpInstance.post(`/${BASE}/${projectId}/publish`);
        return response.data;
    }

    /**
     * Despublica el proyecto (vuelve a modo borrador).
     * @param {string} projectId
     */
    async unpublish(projectId) {
        const response = await httpInstance.post(`/${BASE}/${projectId}/unpublish`);
        return response.data;
    }
}