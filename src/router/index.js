import { createRouter, createWebHistory } from 'vue-router';
import ProjectsView from "@/tour/pages/ProjectsView.vue";
import NodesView from "@/tour/pages/NodesView.vue";
import LinksView from "@/tour/pages/LinksView.vue";
import MarkersView from "@/tour/pages/MarkersView.vue";

const routes = [
    {
        path: '/',
        redirect: '/projects'
    },
    {
        path: '/projects',
        name: 'projects',
        component: ProjectsView
    },
    {
        path: '/projects/:projectId/nodes',
        name: 'nodes',
        component: NodesView
    },
    {
        path: '/projects/:projectId/links',
        name: 'links',
        component: LinksView
    },
    {
        path: '/projects/:projectId/markers',
        name: 'markers',
        component: MarkersView
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
