<script>
export default {
  name: 'TheSideBar',
  props: {
    isCollapsed: Boolean,
    mobileVisible: Boolean,
    menuItems: Array
  },
  emits: ['toggle', 'update:mobileVisible']
}
</script>

<template>
  <!-- Sidebar de Escritorio (Visible solo en md o superior) -->
  <aside
      :class="['hidden md:flex sidebar-container surface-section border-right-1 surface-border transition-all transition-duration-300 flex-column',
              { 'sidebar-collapsed': isCollapsed }]"
  >
    <div :class="['flex align-items-center py-4 mb-4 px-3', isCollapsed ? 'justify-content-center' : 'justify-content-between']">
      <div v-if="!isCollapsed" class="flex align-items-center gap-2 overflow-hidden fadein">
        <i class="pi pi-box text-primary text-3xl"></i>
        <span class="text-xl font-bold text-900">VirtuPro CMS</span>
      </div>
      <Button icon="pi pi-bars" @click="$emit('toggle')" class="p-button-text p-button-rounded p-button-plain" />
    </div>

    <nav class="flex flex-column gap-2 px-2 overflow-x-hidden">
      <router-link v-for="item in menuItems" :key="item.to" :to="item.to" v-slot="{ navigate, isActive }">
        <Button @click="navigate" :icon="item.icon" :label="isCollapsed ? '' : item.label"
                v-tooltip.right="isCollapsed ? item.label : null"
                :class="[isActive ? 'p-button-primary' : 'p-button-text p-button-plain', 'w-full border-none', isCollapsed ? 'justify-content-center px-0' : 'justify-content-start px-3']" />
      </router-link>
    </nav>
  </aside>

  <!-- Sidebar Móvil (Drawer de PrimeVue) -->
  <Drawer :visible="mobileVisible" @update:visible="$emit('update:mobileVisible', $event)" header="Menu" class="w-full sm:w-20rem">
    <div class="flex flex-column gap-2 mt-4">
      <router-link v-for="item in menuItems" :key="item.to" :to="item.to" v-slot="{ navigate, isActive }">
        <Button @click="() => { navigate(); $emit('update:mobileVisible', false); }"
                :icon="item.icon" :label="item.label"
                :class="[isActive ? 'p-button-primary' : 'p-button-text p-button-plain', 'w-full justify-content-start border-none']" />
      </router-link>
    </div>
  </Drawer>
</template>

<style scoped>
.sidebar-container { width: 280px; }
.sidebar-collapsed { width: 70px; }
.fadein { animation: fadeIn 0.3s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>