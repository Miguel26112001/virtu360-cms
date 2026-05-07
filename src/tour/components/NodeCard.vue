<script>
export default {
  name: 'NodeCard',
  props: {
    node: { type: Object, required: true }
  },
  emits: ['delete']
}
</script>

<template>
  <Card class="h-full shadow-1 hover:shadow-3 transition-duration-200 border-round-xl overflow-hidden">
    <template #header>
      <div class="relative">
        <img :src="node.thumbnailUrl || node.panoramaUrl"
             class="w-full h-8rem sm:h-10rem object-cover" alt=""/>
        <Tag value="360°" severity="info" class="absolute top-0 right-0 m-2 shadow-2" />
      </div>
    </template>
    <template #title>
      <span class="text-xl sm:text-2xl white-space-nowrap overflow-hidden text-overflow-ellipsis block">
        {{ node.caption }}
      </span>
    </template>
    <template #content>
      <p class="m-0 text-500 text-xs sm:text-sm font-mono">ID: {{ node.id }}</p>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-content-end border-top-1 surface-border pt-3">
        <Button icon="pi pi-trash" severity="danger" text
                class="p-button-rounded sm:p-button-text"
                @click="$emit('delete', node.id)" />
      </div>
    </template>
  </Card>
</template>

<style scoped>

</style>