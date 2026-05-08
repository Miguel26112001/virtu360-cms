<script>
import NodeCard from "@/tour/components/NodeCard.vue";
import NodeForm from "@/tour/components/NodeForm.vue";
import { NodeService } from "@/tour/services/node.service.js";
import { CreateNodeRequest } from "@/tour/model/create-node.request.js";

export default {
  name: 'NodesView',
  components: { NodeCard, NodeForm },
  data() {
    return {
      nodeService: new NodeService(),
      nodes: [],
      nodeDialog: false,
      newNode: new CreateNodeRequest(),
      loading: false,
      projectId: this.$route.params.projectId,
      projectName: this.$route.query.projectName
    };
  },
  methods: {
    async fetchNodes() {
      this.loading = true;
      try {
        this.nodes = await this.nodeService.getNodesByProjectId(this.projectId);
      } catch (error) {
        console.error("Error al obtener nodos del proyecto:", error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los nodos',
          life: 3000
        });
      } finally {
        this.loading = false;
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
        await this.nodeService.createNode(this.projectId, this.newNode);

        this.nodeDialog = false;
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Nodo creado correctamente',
          life: 3000
        });
        await this.fetchNodes();
      } catch (error) {
        console.error("Error al crear el nodo:", error);
      } finally {
        this.loading = false;
      }
    },
    async handleDeleteNode(nodeId) {
      this.$confirm.require({
        message: '¿Estás seguro de que quieres eliminar este nodo?',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            await this.nodeService.deleteNode(this.projectId, nodeId);
            this.$toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Nodo eliminado',
              life: 3000
            });
            await this.fetchNodes();
          } catch (error) {
            console.error("Error al eliminar nodo:", error);
          }
        }
      });
    }
  },
  mounted() {
    if (!this.projectId) {
      this.$router.push({ name: 'projects' });
      return;
    }
    this.fetchNodes();
  }
};
</script>

<template>
  <div class="nodes-container">
    <div class="flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold m-0 text-900">Nodos del Proyecto</h1>
        <p class="text-primary font-medium m-0">{{ projectName || 'Cargando proyecto...' }}</p>
      </div>
      <Button label="Nuevo Nodo" icon="pi pi-plus"
              class="w-full sm:w-auto shadow-2"
              @click="openDialog" />
    </div>

    <Divider />

    <div class="grid mt-2">
      <div v-if="loading && nodes.length === 0" class="col-12 text-center py-8">
        <ProgressSpinner />
      </div>

      <template v-else>
        <div v-for="node in nodes" :key="node.id" class="col-12 sm:col-6 lg:col-4 p-2 sm:p-3">
          <NodeCard :node="node" @delete="handleDeleteNode" />
        </div>

        <div v-if="nodes.length === 0" class="col-12 text-center py-8">
          <i class="pi pi-images text-300 text-6xl mb-3"></i>
          <p class="text-500 text-xl">Este proyecto aún no tiene nodos.</p>
        </div>
      </template>
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

</style>