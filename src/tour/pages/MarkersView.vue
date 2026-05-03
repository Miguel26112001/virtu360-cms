<script>
import MarkerViewer from "@/tour/components/MarkerViewer.vue";
import MarkerFormPanel from "@/tour/components/MarkerFormPanel.vue";
import { NodeService } from "@/tour/services/node.service.js";
import { AddMarkerRequest } from "@/tour/model/add-marker.request.js";

export default {
  name: "MarkersView",
  computed: {
    AddMarkerRequest() {
      return AddMarkerRequest
    }
  },
  components: { MarkerViewer, MarkerFormPanel },
  data() {
    return {
      nodeService: new NodeService(),
      nodes: [],
      selectedNode: null,
      newMarker: new AddMarkerRequest(),
      loading: false,
      existingMarkers: []
    };
  },
  methods: {
    async fetchNodes() {
      this.nodes = await this.nodeService.getAll();
    },
    handlePosition({ yaw, pitch }) {
      this.newMarker.position.yaw = yaw;
      this.newMarker.position.pitch = pitch;
    },
    async saveMarker() {
      if (!this.selectedNode) return;
      this.loading = true;

      try {
        const savedMarker = await this.nodeService.addMarkerToNode(this.selectedNode.id, this.newMarker);
        this.$toast.add({ severity: 'success', summary: 'Guardado', detail: 'Punto de interés creado', life: 3000 });
        this.existingMarkers.push(savedMarker);
        this.newMarker = new AddMarkerRequest();
        if (this.$refs.viewerRef) {
          this.$refs.viewerRef.currentTempPos = null;
          this.$refs.viewerRef.renderMarkersState();
        }
      } catch (e) {
        console.error(e);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el marcador', life: 3000 });
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
  <div class="p-4">
    <div class="flex flex-column sm:flex-row justify-content-between align-items-center mb-4 gap-3">
      <h1 class="text-3xl font-bold m-0">Gestión de Marcadores</h1>
      <Select v-model="selectedNode" :options="nodes" optionLabel="caption"
              placeholder="Cambiar Escena" class="w-full sm:w-20rem shadow-2" />
    </div>

    <div class="grid">
      <!-- Visor (Izquierda) -->
      <div class="col-12 lg:col-8" style="height: 70vh">
        <MarkerViewer
            ref="viewerRef"
            :panorama="selectedNode?.panorama"
            :markers="existingMarkers.filter(m => m.nodeId == selectedNode?.id)"
            @position-selected="handlePosition"
        />
      </div>

      <!-- Formulario (Derecha) -->
      <div class="col-12 lg:col-4">
        <MarkerFormPanel
            v-model="newMarker"
            :loading="loading"
            :disabled="!selectedNode || newMarker.position.yaw === 0"
            @save="saveMarker"
            @cancel="newMarker = new AddMarkerRequest()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>