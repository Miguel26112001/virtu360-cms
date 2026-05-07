<script>
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default {
  name: 'LinkViewer',
  props: {
    panorama: String,
    caption: String,
    existingLinks: { type: Array, default: () => [] }
  },
  emits: ['coords-captured'],
  data: () => ({
    viewer: null,
    markersPlugin: null,
    loadingImage: false
  }),
  watch: {
    panorama() { this.initViewer(); },
    existingLinks: {
      handler(links) {
        this.renderExistingLinks(links);
      },
      deep: true
    }
  },
  methods: {
    initViewer() {
      if (!this.panorama) return;
      if (this.viewer) this.viewer.destroy();

      this.$nextTick(() => {
        this.viewer = new Viewer({
          container: this.$refs.canvas,
          panorama: this.panorama,
          loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif',
          touchmoveTwoFingers: true,
          mousewheel: true,
          plugins: [
            [MarkersPlugin, {
              // Configuración opcional del plugin
            }]
          ]
        });

        this.markersPlugin = this.viewer.getPlugin(MarkersPlugin);

        this.viewer.addEventListener('ready', () => {
          this.loadingImage = false;
        });

        this.viewer.addEventListener('click', ({ data }) => {
          this.updateTemporaryMarker(data.yaw, data.pitch);
          this.$emit('coords-captured', { yaw: data.yaw, pitch: data.pitch });
        });
      });
    },
    updateTemporaryMarker(yaw, pitch) {
      if (!this.markersPlugin) return;
      const markerId = 'temp-link-marker';

      try {
        this.markersPlugin.removeMarker(markerId);
      } catch (e) {

      }

      this.markersPlugin.addMarker({
        id: markerId,
        position: { yaw, pitch },
        html: `
          <div class="custom-marker">
            <i class="pi pi-map-marker text-red-500 text-3xl"></i>
          </div>
        `,
        anchor: 'bottom center',
        width: 32,
        height: 32,
        tooltip: 'New Link Position',
        data: { generated: true }
      });
    },
    clearTemporaryMarker() {
      if (this.markersPlugin) {
        try {
          this.markersPlugin.removeMarker('temp-link-marker');
        } catch (e) {

        }
      }
    },
    renderExistingLinks(links) {
      if (!this.markersPlugin) return;

      const allMarkers = this.markersPlugin.getMarkers();
      allMarkers.forEach(m => {
        if (m.id !== 'temp-link-marker') this.markersPlugin.removeMarker(m.id);
      });

      links.forEach(link => {
        this.markersPlugin.addMarker({
          id: `link-${link.id}`,
          position: { yaw: link.yaw, pitch: link.pitch },
          html: `
            <div class="existing-link-marker">
              <i class="pi pi-directions text-blue-500 text-3xl"></i>
            </div>
          `,
          anchor: 'bottom center',
          size: { width: 32, height: 32 },
          tooltip: `Enlace existente a: ${link.toNodeId}`
        });
      });
    }
  },
  mounted() {
    this.initViewer();
  },
  beforeUnmount() {
    if (this.viewer) this.viewer.destroy();
  }
}
</script>

<template>
  <div class="viewer-wrapper relative border-round-xl overflow-hidden bg-black shadow-4 h-full">
    <div v-if="loadingImage" class="absolute inset-0 flex flex-column align-items-center justify-content-center z-3 bg-black-alpha-50 text-white">
      <ProgressSpinner style="width: 50px; height: 50px" />
      <p class="mt-2">Cargando Escena...</p>
    </div>

    <div ref="canvas" class="w-full h-full"></div>

    <div v-if="!panorama" class="absolute inset-0 flex flex-column align-items-center justify-content-center text-white p-4">
      <div class="surface-card p-5 border-round-circle mb-4 bg-white-alpha-10">
        <i class="pi pi-map-marker text-6xl text-primary"></i>
      </div>
      <h2 class="text-2xl font-light">Configurador de Enlaces</h2>
      <p class="text-gray-400">Selecciona una escena de origen para comenzar a marcar</p>
    </div>
  </div>
</template>

<style scoped>
:deep(.custom-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  animation: marker-bounce 0.3s ease-out;
}

@keyframes marker-bounce {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.viewer-wrapper {
  background: #000;
}

:deep(.existing-link-marker) {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
  transition: transform 0.2s;
  cursor: pointer;
}

:deep(.existing-link-marker:hover) {
  transform: scale(1.2);
}
</style>