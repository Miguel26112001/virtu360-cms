<script>
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default {
  name: 'MarkerViewer',
  props: {
    panorama: String,
    markers: { type: Array, default: () => [] }
  },
  emits: ['position-selected'],
  data: () => ({
    viewer: null,
    markersPlugin: null,
    currentTempPos: null
  }),
  watch: {
    panorama: 'initViewer',
    markers: {
      handler: 'refreshMarkers',
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
          plugins: [[MarkersPlugin, {}]]
        });

        this.markersPlugin = this.viewer.getPlugin(MarkersPlugin);

        this.viewer.addEventListener('click', ({ data }) => {
          this.currentTempPos = { yaw: data.yaw, pitch: data.pitch };
          this.renderMarkersState();
          this.$emit('position-selected', this.currentTempPos);
        });

        this.refreshMarkers();
      });
    },

    renderMarkersState() {
      if (!this.markersPlugin) return;

      this.markersPlugin.clearMarkers();

      this.markers.forEach(m => {
        this.markersPlugin.addMarker({
          id: m.id,
          position: m.position,
          html: `<div class="marker-circle ${m.type === 'info' ? 'bg-blue' : 'bg-purple'}"></div>`,
          anchor: 'center center',
          tooltip: m.tooltip
        });
      });

      if (this.currentTempPos) {
        this.markersPlugin.addMarker({
          id: 'temp-new',
          position: this.currentTempPos,
          html: `<div class="marker-circle bg-red pulse"></div>`,
          anchor: 'center center',
          tooltip: 'Nuevo Marcador'
        });
      }
    },

    refreshMarkers() {
      this.renderMarkersState();
    }
  },
  beforeUnmount() { if (this.viewer) this.viewer.destroy(); }
}
</script>

<template>
  <div class="relative w-full h-full bg-black overflow-hidden">
    <div ref="canvas" class="w-full h-full"></div>

    <!-- Overlay de Instrucciones para Mobile -->
    <div v-if="panorama && currentTempPos === null"
         class="absolute bottom-0 left-0 w-full p-3 pointer-events-none flex justify-content-center">
      <div class="bg-black-alpha-60 text-white text-xs py-2 px-4 border-round-3xl flex align-items-center gap-2">
        <i class="pi pi-info-circle"></i>
        <span>Toca cualquier punto para colocar un marcador</span>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="!panorama" class="absolute inset-0 flex flex-column align-items-center justify-content-center text-white p-4 text-center">
      <i class="pi pi-map text-6xl mb-3 opacity-20"></i>
      <p>Selecciona una escena arriba para comenzar</p>
    </div>
  </div>
</template>
<style scoped>
:deep(.marker-circle) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
}

:deep(.bg-blue) { background-color: #3b82f6; }
:deep(.bg-purple) { background-color: #a855f7; }
:deep(.bg-red) { background-color: #ef4444; }

/* Efecto de pulso para el marcador nuevo */
:deep(.pulse) {
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0% { box-shadow: 0 0 0 0px rgba(239, 68, 68, 0.7); }
  100% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
}
</style>