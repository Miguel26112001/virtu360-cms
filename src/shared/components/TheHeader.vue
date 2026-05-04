<script>
export default {
  name: 'TheHeader',
  props: {
    isDark: Boolean
  },
  emits: ['menu-click', 'toggle-dark'],
  computed: {
    currentLabel() {
      const pathName = this.$route.path.replace('/', '');
      return pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Dashboard';
    },
    items() {
      return [{ label: 'CMS' }, { label: this.currentLabel }];
    }
  }
}
</script>

<template>
  <header
      class="header-dinamico h-4rem border-bottom-1 flex align-items-center px-3 sm:px-4 justify-content-between sticky top-0 z-5 transition-colors transition-duration-300"
  >
    <div class="flex align-items-center gap-3">
      <Button
          icon="pi pi-bars"
          @click="$emit('menu-click')"
          variant="text"
          rounded
          severity="secondary"
          class="md:hidden"
      />

      <Breadcrumb :model="items" class="bg-transparent border-none p-0 hidden md:block">
        <template #separator>
          <i class="pi pi-chevron-right text-xs text-surface-400"></i>
        </template>
        <template #item="{ item }">
          <!-- Clases de texto dinámicas -->
          <span :class="['text-sm transition-colors', item.class === 'font-bold' ? 'text-primary font-bold' : 'text-surface-500 dark:text-surface-400']">
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>

      <span class="font-bold md:hidden text-surface-900 dark:text-surface-0">{{ currentLabel }}</span>
    </div>

    <div class="flex align-items-center gap-2 sm:gap-3">
      <span class="p-input-icon-left hidden lg:block">
        <i class="pi pi-search text-surface-400" />
        <InputText
            placeholder="Buscar..."
            class="p-inputtext-sm border-round-pill border-none w-15rem buscador-fondo"
        />
    </span>

      <div class="flex align-items-center gap-1">
        <OverlayBadge value="2" severity="primary" size="small">
          <Button
              icon="pi pi-bell"
              variant="text"
              rounded
              severity="secondary"
          />
        </OverlayBadge>
        <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            @click="$emit('toggle-dark')"
            variant="text"
            rounded
            severity="secondary"
        />
      </div>

      <Divider layout="vertical" class="hidden sm:block mx-0" />

      <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          shape="circle"
          size="medium"
          class="cursor-pointer hover:shadow-2 transition-shadow"
      />
    </div>
  </header>
</template>

<style scoped>

</style>