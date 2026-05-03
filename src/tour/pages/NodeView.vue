<script>
import NodeCard from "@/tour/components/NodeCard.vue";
import NodeForm from "@/tour/components/NodeForm.vue";
import { NodeService } from "@/tour/services/node.service.js";
import { CreateNodeRequest   } from "@/tour/model/create-node.request.js";

export default {
  name: 'NodesView',
  components: { NodeCard, NodeForm },
  data() {
    return {
      nodeService: new NodeService(),
      nodes: [],
      nodeDialog: false,
      newNode: new CreateNodeRequest(),
      loading: false
    };
  },
  methods: {
    async fetchNodes() {
      try {
        this.nodes = await this.nodeService.getAll();
      } catch (error) {
        console.error("Error al obtener nodos");
      }
    },
    openDialog() {
      this.newNode = new CreateNodeRequest();
      this.nodeDialog = true;
    },
    async handleSaveNode() {
      if (!this.newNode.caption || !this.newNode.file) return;

      this.loading = true;
      try {
        await this.nodeService.create(this.newNode);
        this.nodeDialog = false;
        await this.fetchNodes();
      } catch (error) {
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchNodes();
  }
};
</script>

<template>
  <div class="nodes-container">
    <!-- Header: Flexible para mobile vertical -->
    <div class="flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold m-0 text-900">Gestión de Nodos</h1>
        <p class="text-500 m-0 hidden sm:block">Administra los puntos de interés de tu tour</p>
      </div>
      <Button label="Nuevo Nodo" icon="pi pi-plus"
              class="w-full sm:w-auto shadow-2"
              @click="openDialog" />
    </div>

    <Divider />

    <!-- Lista de Nodos: 1 columna en móvil, 2 en tablets, 3 en desktop -->
    <div class="grid mt-2">
      <div v-for="node in nodes" :key="node.id" class="col-12 sm:col-6 lg:col-4 p-2 sm:p-3">
        <NodeCard :node="node" @delete="fetchNodes" />
      </div>

      <!-- Estado vacío (Empty State) -->
      <div v-if="nodes.length === 0 && !loading" class="col-12 text-center py-8">
        <i class="pi pi-images text-300 text-6xl mb-3"></i>
        <p class="text-500 text-xl">No hay nodos creados aún.</p>
      </div>
    </div>

    <NodeForm
        v-model:visible="nodeDialog"
        v-model="newNode"
        :loading="loading"
        @close="nodeDialog = false"
        @save="handleSaveNode"
    />
  </div>
</template>

<style scoped>
.object-cover {
  object-fit: cover;
}
</style>