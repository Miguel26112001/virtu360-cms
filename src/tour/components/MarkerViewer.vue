<script>
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default {
  name: 'MarkerViewer',
  props: {
    panorama: String,
    markers: { type: Array, default: () => [] },
    editingMarkerId: { type: [String, Number], default: null }
  },
  emits: ['position-selected', 'marker-delete', 'marker-edit'],
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
          plugins: [[MarkersPlugin, {}]],
          mousewheel: true,
        });

        this.markersPlugin = this.viewer.getPlugin(MarkersPlugin);

        this.viewer.container.addEventListener('click', (e) => {
          const deleteBtn = e.target.closest('.del-marker-tooltip-btn');
          if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-marker-id');
            this.$emit('marker-delete', id);
          }

          const editBtn = e.target.closest('.edit-marker-tooltip-btn');
          if (editBtn) {
            const id = editBtn.getAttribute('data-marker-id');
            this.$emit('marker-edit', id);
          }
        });

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
        const isEditing = m.id === this.editingMarkerId;

        const typeConfigs = {
          'INFO': { icon: 'pi-info-circle', color: '#3b82f6', label: 'Información' },
          'VIDEO': { icon: 'pi-video', color: '#ef4444', label: 'Video' },
          'GALLERY': { icon: 'pi-images', color: '#10b981', label: 'Galería' }
        };

        const config = typeConfigs[m.type] || typeConfigs.INFO;

        this.markersPlugin.addMarker({
          id: m.id,
          position: m.position,
          html: `
            <div class="custom-poi ${isEditing ? 'is-editing' : ''}"
                 style="background: ${config.color}; border-color: ${isEditing ? '#fff' : config.color}">
              <i class="pi ${isEditing ? 'pi-pencil' : config.icon}"></i>
            </div>
          `,
          anchor: 'bottom center',
          tooltip: isEditing ? null : {
            content: `
              <div class="m-tooltip-content p-3 flex flex-column gap-2" style="min-width: 180px;">
                <div class="flex align-items-center gap-2 mb-1">
                   <div class="m-type-badge" style="background: ${config.color}">
                      <i class="pi ${config.icon} text-white"></i>
                   </div>
                   <span class="font-bold text-sm text-900">${config.label}</span>
                </div>
                <p class="text-xs text-600 m-0 pb-1 border-bottom-1 border-200">${m.title}</p>

                <div class="flex gap-2 pt-1">
                  <button class="p-button p-button-sm p-button-secondary p-button-outlined edit-marker-tooltip-btn flex-1"
                          data-marker-id="${m.id}" title="Editar (Próximamente)">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="p-button p-button-sm p-button-danger del-marker-tooltip-btn flex-1"
                          data-marker-id="${m.id}" title="Eliminar este marcador">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </div>
            `,
            position: 'top center',
            trigger: 'click',
            moveThreshold: 10
          }
        });
      });

      if (this.currentTempPos && !this.editingMarkerId) {
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
  <div class="relative w-full h-full bg-black overflow-hidden border-round-xl">
    <div ref="canvas" class="w-full h-full"></div>

    <div v-if="panorama && currentTempPos === null"
         class="absolute bottom-0 left-0 w-full p-3 pointer-events-none flex justify-content-center">
      <div class="bg-black-alpha-70 text-white text-xs py-2 px-4 border-round-3xl flex align-items-center gap-2 shadow-4">
        <i class="pi pi-hand-pointer"></i>
        <span>Haz clic en un marcador para opciones o toca el panorama para situar uno nuevo</span>
      </div>
    </div>

    <div v-if="!panorama" class="absolute inset-0 flex flex-column align-items-center justify-content-center text-white p-4 text-center">
      <i class="pi pi-map text-6xl mb-3 opacity-20"></i>
      <p>Selecciona una escena arriba para comenzar a gestionar POIs</p>
    </div>
  </div>
</template>
<style scoped>
:deep(.custom-poi) {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: transform 0.2s;
}

:deep(.custom-poi:hover) {
  transform: rotate(-45deg) scale(1.15);
}

:deep(.custom-poi i) {
  transform: rotate(45deg);
  font-size: 13px;
}

:deep(.m-tooltip-content) {
  background: white;
  border-radius: 12px;
  color: #333;
}

:deep(.m-type-badge) {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

:deep(.p-button.p-button-sm) {
  padding: 0.35rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

:deep(.del-marker-tooltip-btn) {
  color: white;
  background-color: #ef4444;
  border: 1px solid #ef4444;
}
:deep(.del-marker-tooltip-btn:hover) {
  background-color: #b91c1c;
}

:deep(.marker-temp-pulse) {
  width: 14px;
  height: 14px;
  background: #ff3e3e;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 rgba(255, 62, 62, 0.5);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 62, 62, 0.5); }
  100% { box-shadow: 0 0 0 12px rgba(255, 62, 62, 0); }
}

:deep(.custom-poi.is-editing) {
  border: 3px solid white !important;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
  animation: bounce 1s infinite;
  z-index: 100;
}

@keyframes bounce {
  0%, 100% { transform: rotate(-45deg) scale(1.2); }
  50% { transform: rotate(-45deg) scale(1.4); }
}
</style>