<script>
import { NodeService } from "@/tour/services/node.service.js";
import { ConnectNodeRequest } from "@/tour/model/connect-node.request.js";

import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

export default {
  name: "LinksView",
  data() {
    return {
      nodeService: new NodeService(),
      nodes: [],
      selectedFromNode: null,
      linkForm: new ConnectNodeRequest(),
      loading: false,
      viewer: null
    };
  },
  computed: {
    availableDestinations() {
      return this.nodes.filter(n => n.id !== this.selectedFromNode?.id);
    }
  },
  mounted() {
    this.loadNodes();
  },
  methods: {
    async loadNodes() {
      try {
        this.nodes = await this.nodeService.getAll();
      } catch (error) {
        console.error("Error al cargar nodos");
      }
    },
    async createConnection() {
      if (!this.selectedFromNode || !this.linkForm.toNodeId) return;

      this.loading = true;
      try {
        await this.nodeService.connectNodes(this.selectedFromNode.id, this.linkForm);
        this.linkForm.yaw = 0;
        this.linkForm.pitch = 0;

        console.log("Conexión creada exitosamente");
      } catch (error) {
        console.error("Error al crear la conexión");
      } finally {
        this.loading = false;
      }
    },
    initViewer() {
      if (!this.selectedFromNode) return;

      if (this.viewer) {
        this.viewer.destroy();
      }

      this.$nextTick(() => {
        this.viewer = new Viewer({
          container: this.$refs.viewerCanvas,
          panorama: this.selectedFromNode.panorama,
          caption: this.selectedFromNode.caption,
          loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif',
          touchmoveTwoFingers: true,
          mousewheel: true,
        });

        this.viewer.addEventListener('click', ({ data }) => {
          // Actualizamos los valores para el RequestBody
          this.linkForm.yaw = data.yaw;
          this.linkForm.pitch = data.pitch;

          // Log para depuración en consola
          console.log(`Coordenadas capturadas -> Yaw: ${data.yaw}, Pitch: ${data.pitch}`);
        });
      });
    }
  },
  beforeUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
}
</script>

<template>
  <div class="links-container">
    <div class="flex flex-column lg:flex-row gap-4">

      <!-- Panel de Datos -->
      <div class="flex-grow-0 w-full lg:w-22rem flex flex-column gap-3">
        <Card class="shadow-3">
          <template #title>Nueva Conexión</template>
          <template #content>
            <div class="flex flex-column gap-4 mt-2">

              <div class="flex flex-column gap-2">
                <label class="font-bold text-sm">1. Nodo Origen (Escena actual)</label>
                <Select
                    v-model="selectedFromNode"
                    :options="nodes"
                    optionLabel="caption"
                    placeholder="Seleccionar origen"
                    class="w-full"
                    @change="initViewer"
                />
              </div>

              <div class="flex flex-column gap-2">
                <label class="font-bold text-sm">2. Nodo Destino (A dónde va)</label>
                <Select
                    v-model="linkForm.toNodeId"
                    :options="availableDestinations"
                    optionValue="id"
                    optionLabel="caption"
                    placeholder="Seleccionar destino"
                    class="w-full"
                    :disabled="!selectedFromNode"
                />
              </div>

              <!-- Visualización de valores capturados -->
              <div class="surface-100 p-3 border-round-lg flex flex-column gap-2">
                <span class="text-xs font-bold text-500 uppercase">Coordenadas del Clic</span>
                <div class="flex justify-content-between">
                  <span class="text-sm font-medium">Yaw:</span>
                  <span class="text-sm font-mono text-primary font-bold">{{ linkForm.yaw.toFixed(4) }}</span>
                </div>
                <div class="flex justify-content-between">
                  <span class="text-sm font-medium">Pitch:</span>
                  <span class="text-sm font-mono text-primary font-bold">{{ linkForm.pitch.toFixed(4) }}</span>
                </div>
              </div>

              <Button
                  label="Registrar Enlace"
                  icon="pi pi-save"
                  class="w-full mt-2"
                  :loading="loading"
                  :disabled="!linkForm.toNodeId || linkForm.yaw === 0"
                  @click="createConnection"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Área del Visor -->
      <div class="flex-grow-1 relative border-round-xl overflow-hidden bg-black shadow-4"
           style="min-height: 500px; height: calc(100vh - 250px);">

        <div ref="viewerCanvas" class="w-full h-full"></div>

        <div v-if="!selectedFromNode" class="absolute inset-0 flex flex-column align-items-center justify-content-center text-white z-2" style="background: rgba(0,0,0,0.7)">
          <i class="pi pi-mouse text-5xl mb-3"></i>
          <p class="text-lg px-4 text-center">Selecciona un nodo de origen y haz clic en la imagen para capturar la posición.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>