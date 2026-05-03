<script>
import LinkControlPanel from "@/tour/components/LinkControlPanel.vue";
import LinkViewer from "@/tour/components/LinkViewer.vue";
import { NodeService } from "@/tour/services/node.service.js";
import { ConnectNodeRequest } from "@/tour/model/connect-node.request.js";

export default {
  name: "LinksView",
  components: { LinkControlPanel, LinkViewer },
  data() {
    return {
      nodeService: new NodeService(),
      nodes: [],
      selectedFromNode: null,
      linkForm: new ConnectNodeRequest(),
      loading: false
    };
  },
  computed: {
    availableDestinations() {
      return this.nodes.filter(n => n.id !== this.selectedFromNode?.id);
    }
  },
  methods: {
    async fetchNodes() {
      try {
        this.nodes = await this.nodeService.getAll();
      } catch (e) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error de Carga',
          detail: 'No se pudieron obtener los nodos del servidor.',
          life: 5000
        });
      }
    },
    handleCoords({ yaw, pitch }) {
      this.linkForm.yaw = yaw;
      this.linkForm.pitch = pitch;
    },
    async onSave() {
      if (!this.linkForm.yaw || !this.linkForm.toNodeId) return;
      this.loading = true;

      try {
        await this.nodeService.connectNodes(this.selectedFromNode.id, this.linkForm);
        this.$toast.add({ severity: 'success', summary: 'Conectado', detail: 'El enlace se guardó correctamente', life: 3000 });

        this.linkForm = new ConnectNodeRequest();
      } catch (e) {

        const errorMessage = e.response?.data?.message || 'Error inesperado al conectar nodos';
        this.$toast.add({
          severity: 'error',
          summary: 'Fallo al Guardar',
          detail: errorMessage,
          life: 4000
        });
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchNodes();
  }
}
</script>

<template>
  <div class="links-page p-2 sm:p-4">
    <div class="flex flex-column lg:flex-row gap-4">
      <!-- Panel Izquierdo (Control) -->
      <div class="w-full lg:w-22rem">
        <LinkControlPanel
            v-model="linkForm"
            v-model:selectedFromNode="selectedFromNode"
            :nodes="nodes"
            :availableDestinations="availableDestinations"
            :loading="loading"
            @save="onSave"
        />
      </div>

      <!-- Panel Derecho (Visor) -->
      <div class="flex-grow-1" style="min-height: 500px; height: calc(100vh - 180px);">
        <LinkViewer
            :panorama="selectedFromNode?.panorama"
            :caption="selectedFromNode?.caption"
            @coords-captured="handleCoords"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>