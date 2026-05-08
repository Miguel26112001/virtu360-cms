<script>
export default {
  name: 'TheHeader',
  props: {
    isDark: Boolean,
    showMenuButton: Boolean
  },
  emits: ['menu-click', 'toggle-dark'],
  computed: {
    currentSection() {
      const name = this.$route.name;
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Dashboard';
    },
    projectId() {
      return this.$route.query.projectId;
    },
    items() {
      const breadcrumbs = [{ label: 'CMS', to: '/projects' }];

      const projectName = this.$route.query.projectName;

      if (projectName && this.$route.name !== 'projects') {
        breadcrumbs.push({
          label: projectName,
          class: 'font-bold'
        });
        breadcrumbs.push({ label: this.currentSection });
      } else {
        breadcrumbs.push({ label: 'Project Selection' });
      }

      return breadcrumbs;
    }
  }
}
</script>

<template>
  <header class="header-dinamico h-4rem border-bottom-1 flex align-items-center px-3 sm:px-4 justify-content-between sticky top-0 z-5 transition-colors transition-duration-300">
    <div class="flex align-items-center gap-3">
      <Button
          v-if="showMenuButton"
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
          <router-link v-if="item.to" :to="item.to" class="no-underline">
            <span class="text-sm text-surface-500 dark:text-surface-400 hover:text-primary transition-colors cursor-pointer">
              {{ item.label }}
            </span>
          </router-link>
          <span v-else :class="['text-sm transition-colors', item.class === 'font-bold' ? 'text-primary font-bold' : 'text-surface-500 dark:text-surface-400']">
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>

      <span class="font-bold md:hidden text-surface-900 dark:text-surface-0">{{ currentSection }}</span>
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