import { createRouter, createWebHistory } from 'vue-router';
import NodeView from "@/tour/pages/NodeView.vue";
import LinksView from "@/tour/pages/LinksView.vue";
import MarkersView from "@/tour/pages/MarkersView.vue";

const routes = [
    { path: '/', redirect: '/nodos' },
    { path: '/nodos', name: 'nodos', component: NodeView },
    { path: '/links', name: 'links', component: LinksView },
    { path: '/markers', name: 'markers', component: MarkersView },
];

export default createRouter({
    history: createWebHistory(),
    routes
})
