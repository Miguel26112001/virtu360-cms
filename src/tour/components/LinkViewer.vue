<script>
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

export default {
  name: 'LinkViewer',
  props: {
    panorama: String,
    caption: String
  },
  emits: ['coords-captured'],
  data: () => ({
    viewer: null,
    loadingImage: false
  }),
  watch: {
    panorama() {
      this.loadingImage = true;
      this.initViewer();
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
        });

        this.viewer.addEventListener('ready', () => {
          this.loadingImage = false;
        });

        this.viewer.addEventListener('click', ({ data }) => {
          this.$emit('coords-captured', { yaw: data.yaw, pitch: data.pitch });
        });
      });
    }
  },
  mounted() { this.initViewer(); },
  beforeUnmount() { if (this.viewer) this.viewer.destroy(); }
}
</script>

<template>
  <div class="viewer-wrapper relative border-round-xl overflow-hidden bg-black shadow-4 h-full">
    <!-- Capa de carga si el panorama está definido pero el visor aún no está listo -->
    <div v-if="loadingImage" class="absolute inset-0 flex flex-column align-items-center justify-content-center z-3 bg-black-alpha-50 text-white">
      <ProgressSpinner style="width: 50px; height: 50px" />
      <p class="mt-2">Cargando Escena...</p>
    </div>

    <div ref="canvas" class="w-full h-full"></div>

    <!-- Estado vacío -->
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

</style>