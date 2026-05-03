<script>
export default {
  name: 'MarkerFormPanel',
  props: {
    modelValue: Object,
    loading: Boolean,
    disabled: Boolean
  },
  emits: ['update:modelValue', 'save', 'cancel'],
  data() {
    return {
      typeOptions: [
        { label: 'Información', value: 'info', icon: 'pi pi-info-circle' },
        { label: 'Detalle', value: 'detail', icon: 'pi pi-search-plus' }
      ]
    }
  }
}
</script>

<template>
  <div class="flex flex-column gap-3">
    <!-- Header más compacto para mobile -->
    <div class="flex align-items-center justify-content-between">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-tag text-primary"></i>
        <span class="font-bold">Nuevo Marcador</span>
      </div>
      <!-- Chip de coordenadas pequeño -->
      <div class="surface-200 px-2 py-1 border-round text-xs font-mono">
        {{ modelValue.position.yaw.toFixed(2) }}, {{ modelValue.position.pitch.toFixed(2) }}
      </div>
    </div>

    <!-- Selector de Tipo: Botones grandes para dedos -->
    <SelectButton
        :modelValue="modelValue.type"
        @update:modelValue="$emit('update:modelValue', { ...modelValue, type: $event })"
        :options="typeOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full custom-selectbutton"
    />

    <div class="grid grid-gutter-2">
      <div class="col-12">
        <InputText v-model="modelValue.title" placeholder="Título" class="w-full p-inputtext-sm" />
      </div>
      <div class="col-12">
        <InputText v-model="modelValue.tooltip" placeholder="Texto corto (Tooltip)" class="w-full p-inputtext-sm" />
      </div>

      <div class="col-12">
        <Textarea v-if="modelValue.type === 'info'"
                  v-model="modelValue.content"
                  rows="3"
                  placeholder="Contenido breve..."
                  class="w-full p-inputtext-sm" />

        <Textarea v-else
                  v-model="modelValue.description"
                  rows="4"
                  placeholder="Descripción detallada..."
                  class="w-full p-inputtext-sm" />
      </div>
    </div>

    <div class="flex gap-2 pt-2">
      <Button icon="pi pi-trash" severity="danger" text @click="$emit('cancel')" aria-label="Descartar" />
      <Button label="Guardar Marcador"
              icon="pi pi-check"
              class="flex-1"
              :loading="loading"
              :disabled="disabled || !modelValue.title"
              @click="$emit('save')" />
    </div>
  </div>
</template>

<style scoped>
:deep(.custom-selectbutton .p-button) {
  padding: 0.5rem;
  font-size: 0.875rem;
}
</style>