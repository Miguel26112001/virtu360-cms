<script>
import TheSideBar from "@/shared/components/TheSideBar.vue";
import TheHeader from "@/shared/components/TheHeader.vue";

export default {
  name: 'App',
  components: { TheSideBar, TheHeader },
  data() {
    return {
      isCollapsed: false,
      mobileMenuVisible: false,
      menuItems: [
        { label: 'Crear Nodos', icon: 'pi pi-image', to: '/nodos' },
        { label: 'Conectar Nodos', icon: 'pi pi-external-link', to: '/links' },
        { label: 'Añadir Markers', icon: 'pi pi-map-marker', to: '/markers' }
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>

<template>
  <Toast/>
  <div class="flex min-h-screen surface-ground">
    <TheSideBar
        :is-collapsed="isCollapsed"
        v-model:mobileVisible="mobileMenuVisible"
        :menu-items="menuItems"
        @toggle="toggleSidebar"
    />

    <main class="flex-grow-1 flex flex-column overflow-hidden">
      <!-- Escuchamos el evento menu-click del header -->
      <TheHeader @menu-click="mobileMenuVisible = true" />

      <div class="p-2 sm:p-4 flex-grow-1 overflow-auto">
        <!-- Ajustamos el padding en mobile (p-2) vs escritorio (p-4) -->
        <div class="bg-white border-round-xl shadow-2 p-3 sm:p-5 min-h-full">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
a {
  text-decoration: none;
}

:deep(.p-button:focus) {
  box-shadow: none;
}
</style>
