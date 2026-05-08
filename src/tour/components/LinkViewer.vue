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
  emits: ['coords-captured', 'node-navigate', 'link-delete'],
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
          this.renderExistingLinks(this.existingLinks);
        });

        this.viewer.addEventListener('click', ({ data }) => {
          this.updateTemporaryMarker(data.yaw, data.pitch);
          this.$emit('coords-captured', { yaw: data.yaw, pitch: data.pitch });
        });

        this.viewer.container.addEventListener('click', (e) => {
          const deleteBtn = e.target.closest('.delete-link-tooltip-btn');
          if (deleteBtn) {
            const linkId = deleteBtn.getAttribute('data-link-id');
            this.$emit('link-delete', linkId);
            this.markersPlugin.hideTooltip();
          }

          const navigateBtn = e.target.closest('.navigate-link-btn');
          if (navigateBtn) {
            const toId = navigateBtn.getAttribute('data-to-id');
            this.$emit('node-navigate', toId);
            this.markersPlugin.hideTooltip();
          }
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
      if (!this.markersPlugin || !this.viewer) return;

      this.markersPlugin.clearMarkers();

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
          tooltip: {
            content: `
              <div class="p-3 flex flex-column gap-2" style="min-width: 150px;">
                <span class="font-bold text-sm mb-1 block text-center">Opciones de Enlace</span>

                <button class="p-button p-button-primary p-button-sm navigate-link-btn"
                        data-to-id="${link.toNodeId}">
                  <i class="pi pi-external-link mr-2"></i> Viajar
                </button>

                <button class="p-button p-button-danger p-button-sm delete-link-tooltip-btn"
                        data-link-id="${link.id}">
                  <i class="pi pi-trash mr-2"></i> Eliminar
                </button>
              </div>
            `,
            position: 'top center',
            trigger: 'click'
          },
          data: { toNodeId: link.toNodeId, linkId: link.id }
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
  position: relative;
  cursor: pointer;
}

:deep(.existing-link-marker:hover) {
  transform: scale(1.2);
}

:deep(.navigate-link-btn) {
  cursor: pointer;
  background-color: var(--p-primary-500);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

:deep(.navigate-link-btn:hover) {
  background-color: var(--p-primary-600);
}

:deep(.delete-link-tooltip-btn) {
  cursor: pointer;
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>