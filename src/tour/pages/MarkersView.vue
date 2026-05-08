<script>
import MarkerViewer from "@/tour/components/MarkerViewer.vue";
import MarkerFormPanel from "@/tour/components/MarkerFormPanel.vue";
import { NodeService } from "@/tour/services/node.service.js";
import { MarkerService } from "@/tour/services/marker.service.js"; // Nuevo
import {
  AddInfoMarkerRequest,
  AddGalleryMarkerRequest,
  AddVideoMarkerRequest,
  AddMarkerRequest
} from "@/tour/model/add-marker.request.js";

export default {
  name: "MarkersView",
  components: { MarkerViewer, MarkerFormPanel },
  data() {
    return {
      nodeService: new NodeService(),
      markerService: new MarkerService(),
      nodes: [],
      selectedNode: null,
      newMarker: new AddMarkerRequest(),
      loading: false,
      existingMarkers: [],
      projectId: this.$route.params.projectId
    };
  },
  watch: {
    async selectedNode(newNode) {
      if (newNode) {
        this.existingMarkers = await this.markerService.getMarkersByNodeId(this.projectId, newNode.id);
      }
    }
  },
  methods: {
    async fetchNodes() {
      this.nodes = await this.nodeService.getNodesByProjectId(this.projectId);
    },
    handlePosition({ yaw, pitch }) {
      this.newMarker.position.yaw = yaw;
      this.newMarker.position.pitch = pitch;
    },
    handleTypeChange(type) {
      const pos = { ...this.newMarker.position };
      if (type === 'INFO') this.newMarker = new AddInfoMarkerRequest();
      else if (type === 'VIDEO') this.newMarker = new AddVideoMarkerRequest();
      else if (type === 'GALLERY') this.newMarker = new AddGalleryMarkerRequest();

      this.newMarker.position = pos;
    },
    async saveMarker() {
      this.loading = true;
      try {
        let saved;
        const nodeId = this.selectedNode.id;

        if (this.newMarker.type === 'INFO')
          saved = await this.markerService.addInfoMarker(this.projectId, nodeId, this.newMarker);
        else if (this.newMarker.type === 'VIDEO')
          saved = await this.markerService.addVideoMarker(this.projectId, nodeId, this.newMarker);
        else
          saved = await this.markerService.addGalleryMarker(this.projectId, nodeId, this.newMarker);

        this.existingMarkers.push(saved);
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Marcador guardado'
        });
        this.resetForm();
      } catch (e) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar'
        });
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.handleTypeChange('INFO');
      if (this.$refs.viewerRef) this.$refs.viewerRef.currentTempPos = null;
    }
  },
  mounted() {
    this.fetchNodes();
  }
}
</script>

<template>
  <div class="p-2 md:p-4">
    <!-- Header Adaptable -->
    <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-3 gap-2">
      <div>
        <h1 class="text-xl md:text-3xl font-bold m-0">Marcadores</h1>
        <p class="text-sm text-500 hidden md:block">Gestiona puntos de interés en la escena</p>
      </div>
      <Select v-model="selectedNode" :options="nodes" optionLabel="caption"
              placeholder="Cambiar Escena" class="w-full md:w-20rem shadow-2" />
    </div>

    <div class="grid grid-nogutter shadow-2 border-round-xl overflow-hidden bg-white">
      <div class="col-12 lg:col-8 viewer-container">
        <MarkerViewer
            ref="viewerRef"
            :panorama="selectedNode?.panoramaUrl"
            :markers="existingMarkers"
            @position-selected="handlePosition"
        />
      </div>

      <!-- Formulario (En Mobile se siente como una tarjeta de acción inferior) -->
      <div class="col-12 lg:col-4 p-2 md:p-3 bg-faint border-top-1 lg:border-top-none lg:border-left-1 border-200 overflow-y-auto form-container">

        <div v-if="newMarker.position.yaw === 0 && !selectedNode" class="hidden lg:flex flex-column align-items-center justify-content-center h-full text-400">
          <i class="pi pi-touch-app text-4xl mb-2"></i>
          <p>Toca el panorama para situar un punto</p>
        </div>

        <MarkerFormPanel
            v-model="newMarker"
            :loading="loading"
            :disabled="!selectedNode || newMarker.position.yaw === 0"
            @type-change="handleTypeChange"
            @save="saveMarker"
            @cancel="resetForm"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-faint {
  background-color: #fafafa;
}

.viewer-container {
  height: 50vh;
}

.form-container {
  max-height: 40vh;
}

@media screen and (min-width: 992px) {
  .viewer-container {
    height: 75vh;
  }

  .form-container {
    max-height: 75vh;
  }
}
</style>