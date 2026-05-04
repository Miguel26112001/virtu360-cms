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
    resetForm(silent = false) {
      this.newMarker = new AddMarkerRequest();

      if (this.$refs.viewerRef) {
        this.$refs.viewerRef.currentTempPos = null;
        this.$refs.viewerRef.renderMarkersState();
      }
    },
    async saveMarker() {
      if (!this.selectedNode) return;
      this.loading = true;

      try {
        const savedMarker = await this.nodeService.addMarkerToNode(this.selectedNode.id, this.newMarker);

        this.$toast.add({ severity: 'success', summary: 'Guardado', detail: 'Punto de interés creado', life: 3000 });

        this.existingMarkers.push(savedMarker);

        this.resetForm();

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
      <!-- Visor (Prioridad en Mobile: Ocupa más espacio) -->
      <div class="col-12 lg:col-8 viewer-container">
        <MarkerViewer
            ref="viewerRef"
            :panorama="selectedNode?.panorama"
            :markers="existingMarkers.filter(m => m.nodeId == selectedNode?.id)"
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

/* Altura del Visor */
.viewer-container {
  height: 50vh; /* Altura por defecto (móvil) */
}

/* Altura del Formulario */
.form-container {
  max-height: 40vh; /* Altura por defecto (móvil) */
}

/* Media Query para pantallas grandes (lg = 992px en PrimeFlex) */
@media screen and (min-width: 992px) {
  .viewer-container {
    height: 75vh;
  }

  .form-container {
    max-height: 75vh;
  }
}
</style>