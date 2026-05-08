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
      isDark: false,
    };
  },
  computed: {
    isProjectSelection() {
      return !this.$route.params.projectId;
    },
    menuItems() {
      const projectId = this.$route.params.projectId;
      const projectName = this.$route.query.projectName;

      if (!projectId) return [];

      return [
        {
          label: 'Project Nodes',
          icon: 'pi pi-image',
          to: { name: 'nodes', params: { projectId }, query: { projectName } }
        },
        {
          label: 'Connect Nodes',
          icon: 'pi pi-external-link',
          to: { name: 'links', params: { projectId }, query: { projectName } }
        },
        {
          label: 'Manage Markers',
          icon: 'pi pi-map-marker',
          to: { name: 'markers', params: { projectId }, query: { projectName } }
        }
      ];
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleDarkMode() {
      this.isDark = !this.isDark;
      const element = document.querySelector('html');
      element.classList.toggle('my-app-dark');
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDark = true;
      document.querySelector('html').classList.add('my-app-dark');
    }
  }
}
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>

  <div class="layout-wrapper flex min-h-screen transition-colors duration-300">

    <TheSideBar
        v-if="!isProjectSelection"
        :is-collapsed="isCollapsed"
        v-model:mobileVisible="mobileMenuVisible"
        :menu-items="menuItems"
        @toggle="toggleSidebar"
        class="layout-sidebar"
    />

    <div class="layout-content flex-grow-1 flex flex-column overflow-x-hidden">

      <TheHeader
          :is-dark="isDark"
          :show-menu-button="!isProjectSelection"
          @menu-click="mobileMenuVisible = true"
          @toggle-dark="toggleDarkMode"
      />

      <div class="p-3 md:p-4 lg:p-5 flex-grow-1 overflow-y-auto">
        <div :class="[
          'surface-card border-round-xl shadow-sm p-4 md:p-6 min-h-full border-1 border-surface-200 dark:border-surface-800 transition-all duration-200',
          isProjectSelection ? 'max-w-7xl mx-auto w-full' : ''
        ]">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.layout-sidebar {
  z-index: 1100;
}
</style>
