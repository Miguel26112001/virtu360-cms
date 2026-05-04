<script>
export default {
  name: 'TheSideBar',
  inheritAttrs: false,
  props: {
    isCollapsed: Boolean,
    mobileVisible: Boolean,
    menuItems: Array
  },
  emits: ['toggle', 'update:mobileVisible'],
  computed: {
    internalMobileVisible: {
      get() { return this.mobileVisible; },
      set(val) { this.$emit('update:mobileVisible', val); }
    }
  }
}
</script>

<template>
  <!-- Sidebar de Escritorio -->
  <aside
      v-bind="$attrs"
      :class="['hidden md:flex sidebar-transition bg-surface-0 dark:bg-surface-900 border-right-1 border-surface-200 dark:border-surface-800 flex-column overflow-hidden flex-shrink-0 transition-colors duration-300',
              isCollapsed ? 'w-5rem' : 'w-18rem']"
  >
    <div :class="['flex align-items-center h-4rem px-3 border-bottom-1 border-surface-100 dark:border-surface-800', isCollapsed ? 'justify-content-center' : 'justify-content-between']">
      <div v-if="!isCollapsed" class="flex align-items-center gap-2 fadein">
        <div class="bg-primary border-round-md p-1 flex align-items-center justify-content-center shadow-sm">
          <i class="pi pi-box text-white text-xl"></i>
        </div>
        <!-- Gradiente ajustado para que brille más en oscuro -->
        <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-300">
          VirtuPro
        </span>
      </div>
      <Button
          :icon="isCollapsed ? 'pi pi-chevron-right' : 'pi pi-bars'"
          @click="$emit('toggle')"
          variant="text"
          rounded
          severity="secondary"
      />
    </div>

    <nav class="flex flex-column gap-1 p-2 mt-2 flex-grow-1">
      <router-link v-for="item in menuItems" :key="item.to" :to="item.to" v-slot="{ navigate, isActive }">
        <Button
            @click="navigate"
            :icon="item.icon"
            :label="isCollapsed ? '' : item.label"
            v-tooltip.right="isCollapsed ? item.label : null"
            :severity="isActive ? 'primary' : 'secondary'"
            :variant="isActive ? 'default' : 'text'"
            :class="['w-full border-none transition-all duration-200 h-3rem',
                   isCollapsed ? 'justify-content-center' : 'justify-content-start px-3',
                   isActive ? 'shadow-sm' : 'text-surface-600 dark:text-surface-400']"
        />
      </router-link>
    </nav>

    <!-- Footer con colores de superficie oscuros -->
    <div class="p-2 border-top-1 border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/50 transition-colors">
      <Button
          icon="pi pi-cog"
          :label="isCollapsed ? '' : 'Configuración'"
          variant="text"
          severity="secondary"
          class="w-full justify-content-start h-3rem mb-1"
      />
      <div :class="['flex align-items-center gap-2 p-2 border-round-md hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors', isCollapsed ? 'justify-content-center' : '']">
        <Avatar icon="pi pi-user" shape="circle" class="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-200" />
        <div v-if="!isCollapsed" class="flex flex-column fadein overflow-hidden">
          <span class="text-sm font-bold text-surface-900 dark:text-surface-0 line-height-1">Admin</span>
          <span class="text-xs text-surface-500 dark:text-surface-400 truncate">admin@virtupro.com</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Sidebar Móvil -->
  <Drawer
      v-model:visible="internalMobileVisible"
      header="VirtuPro CMS"
      class="w-full sm:w-20rem custom-drawer"
  >
    <div class="flex flex-column gap-2 mt-2">
      <router-link v-for="item in menuItems" :key="item.to" :to="item.to" v-slot="{ navigate, isActive }">
        <Button
            @click="() => { navigate(); internalMobileVisible = false; }"
            :icon="item.icon"
            :label="item.label"
            :severity="isActive ? 'primary' : 'secondary'"
            :variant="isActive ? 'default' : 'text'"
            class="w-full justify-content-start border-none h-3.5rem"
        />
      </router-link>
    </div>
  </Drawer>
</template>

<style scoped>
.fadein { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; transform: translateX(0); } }

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--p-primary-600), var(--p-primary-400));
}
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.custom-drawer) {
  background-color: var(--p-surface-0);
  color: var(--p-surface-900);
}

.my-app-dark :deep(.custom-drawer) {
  background-color: var(--p-surface-900);
  color: var(--p-surface-0);
}
</style>

<style>
.my-app-dark .p-drawer {
  background-color: var(--p-surface-900) !important;
  color: var(--p-surface-0) !important;
  border-left: 1px solid var(--p-surface-800);
}

.my-app-dark .p-drawer-header {
  background-color: var(--p-surface-900) !important;
}

.my-app-dark .p-drawer .p-drawer-title {
  color: var(--p-surface-0);
}
</style>