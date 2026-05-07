<script>
export default {
  name: 'ProjectCard',
  props: {
    project: { type: Object, required: true }
  }
}
</script>

<template>
  <div class="p-3 border-round-lg shadow-1 surface-card border-1 border-200 flex flex-column h-full transition-all transition-duration-200 hover:border-primary">
    <div class="flex justify-content-between align-items-start mb-2">
      <h3 class="m-0 text-xl font-semibold">{{ project.title }}</h3>
      <Tag :severity="project.published ? 'success' : 'warn'" :value="project.published ? 'Published' : 'Draft'" />
    </div>

    <p class="text-600 line-height-3 mb-2 flex-grow-1">
      {{ project.description || 'No description provided' }}
    </p>

    <div class="text-sm text-400 mb-4">
      <i class="pi pi-images mr-1"></i> {{ project.totalNodes }} nodes
    </div>

    <div class="flex gap-2 mt-auto">
      <Button icon="pi pi-trash" class="p-button-danger p-button-text" @click="$emit('delete', project.id)" />
      <Button label="View Nodes" icon="pi pi-arrow-right" class="p-button-outlined ml-auto" @click="$emit('open', project.id)" />
    </div>
  </div>
</template>

<style scoped>

</style>