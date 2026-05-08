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
      if (this.viewer) {
        try {
          this.viewer.destroy();
        } catch (e) {
          console.warn("Error destruyendo el visor", e);
        }
        this.viewer = null;
      }

      this.$nextTick(() => {
        if (!this.panorama || !this.$refs.canvas) return;

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
        const iconMap = {
          'INFO': { icon: 'pi-info-circle', color: '#3b82f6' },
          'VIDEO': { icon: 'pi-video', color: '#ef4444' },
          'GALLERY': { icon: 'pi-images', color: '#10b981' }
        };

        const config = iconMap[m.type] || iconMap.INFO;

        this.markersPlugin.addMarker({
          id: m.id,
          position: m.position,
          html: `
            <div class="custom-poi" style="background: ${config.color}">
              <i class="pi ${config.icon}"></i>
            </div>
          `,
          anchor: 'bottom center',
          tooltip: `<b>${m.title}</b><br>${m.tooltip}`
        });
      });

      if (this.currentTempPos) {
        this.markersPlugin.addMarker({
          id: 'temp-new',
          position: this.currentTempPos,
          html: '<div class="marker-temp-pulse"></div>',
          anchor: 'center center'
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

    <div v-if="panorama && currentTempPos === null"
         class="absolute bottom-0 left-0 w-full p-3 pointer-events-none flex justify-content-center">
      <div class="bg-black-alpha-60 text-white text-xs py-2 px-4 border-round-3xl flex align-items-center gap-2">
        <i class="pi pi-info-circle"></i>
        <span>Toca cualquier punto para colocar un marcador</span>
      </div>
    </div>

    <div v-if="!panorama" class="absolute inset-0 flex flex-column align-items-center justify-content-center text-white p-4 text-center">
      <i class="pi pi-map text-6xl mb-3 opacity-20"></i>
      <p>Selecciona una escena arriba para comenzar</p>
    </div>
  </div>
</template>
<style scoped>
:deep(.custom-poi) {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

:deep(.custom-poi i) {
  transform: rotate(45deg);
  font-size: 14px;
}

:deep(.marker-temp-pulse) {
  width: 15px;
  height: 15px;
  background: #ff3e3e;
  border-radius: 50%;
  box-shadow: 0 0 0 rgba(255, 62, 62, 0.4);
  animation: pulse 2s infinite;
}
</style>