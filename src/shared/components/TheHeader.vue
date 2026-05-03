<script>
export default {
  name: 'TheHeader',
  emits: ['menu-click'],
  computed: {
    currentLabel() {
      const pathName = this.$route.path.replace('/', '');
      return pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Dashboard';
    },
    items() {
      return [{ label: 'CMS' }, { label: this.currentLabel, class: 'font-bold' }];
    }
  }
}
</script>

<template>
  <header class="h-4rem bg-white border-bottom-1 surface-border flex align-items-center px-3 sm:px-4 justify-content-between">
    <div class="flex align-items-center gap-3">
      <!-- Botón móvil: Solo visible en pantallas menores a md -->
      <Button icon="pi pi-bars" @click="$emit('menu-click')" class="p-button-text p-button-rounded md:hidden" />

      <Breadcrumb :model="items" class="bg-transparent border-none p-0 hidden sm:block" />
      <!-- Label simplificado para móviles pequeños -->
      <span class="font-bold sm:hidden">{{ currentLabel }}</span>
    </div>

    <div class="flex align-items-center gap-2">
      <Button icon="pi pi-bell" text rounded class="p-button-plain" />
      <Avatar icon="pi pi-user" shape="circle" class="bg-primary text-white" />
    </div>
  </header>
</template>

<style scoped>

</style>