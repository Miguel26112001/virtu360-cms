<script>
export default {
  name: 'MarkerFormPanel',
  props: {
    modelValue: Object,
    loading: Boolean,
    disabled: Boolean
  },
  emits: ['update:modelValue', 'save', 'cancel', 'type-change'],
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
    <div class="flex align-items-center justify-content-between">
      <span class="font-bold"><i class="pi pi-tag mr-2"></i>Nuevo {{ modelValue.type }}</span>
      <div class="surface-200 px-2 py-1 border-round font-mono text-xs">
        {{ modelValue.position.yaw.toFixed(2) }}°
      </div>
    </div>

    <SelectButton
        :modelValue="modelValue.type"
        @update:modelValue="$emit('type-change', $event)"
        :options="[
          {label: 'Info', value: 'INFO'},
          {label: 'Video', value: 'VIDEO'},
          {label: 'Galería', value: 'GALLERY'}
        ]"
        optionLabel="label"
        optionValue="value"
        class="w-full"
    />

    <div class="grid grid-nogutter gap-2">
      <InputText v-model="modelValue.title" placeholder="Título del marcador" class="w-full" />
      <InputText v-model="modelValue.tooltip" placeholder="Texto del Tooltip" class="w-full" />
      <InputText v-model="modelValue.summary" placeholder="Resumen corto" class="w-full" />

      <template v-if="modelValue.type === 'INFO'">
        <Textarea v-model="modelValue.content" placeholder="Contenido principal" class="w-full" rows="3" />
        <Textarea v-model="modelValue.description" placeholder="Descripción extendida" class="w-full" rows="2" />
      </template>

      <template v-if="modelValue.type === 'VIDEO'">
        <InputText v-model="modelValue.videoUrl" placeholder="URL de Video (Youtube/Vimeo)" class="w-full" />
        <div class="flex align-items-center gap-2">
          <Checkbox v-model="modelValue.youtube" :binary="true" inputId="isYt" />
          <label for="isYt">Es enlace de YouTube</label>
        </div>
      </template>

      <template v-if="modelValue.type === 'GALLERY'">
        <p class="text-xs text-500">URLs de imágenes (separadas por coma)</p>
        <Textarea :modelValue="modelValue.imageUrls.join(',')"
                  @update:modelValue="val => modelValue.imageUrls = val.split(',').map(s => s.trim())"
                  placeholder="url1, url2..." class="w-full" />
      </template>
    </div>

    <div class="flex gap-2">
      <Button icon="pi pi-times" severity="secondary" text @click="$emit('cancel')" />
      <Button label="Guardar" icon="pi pi-check" class="flex-1" :loading="loading" :disabled="disabled" @click="$emit('save')" />
    </div>
  </div>
</template>

<style scoped>
:deep(.custom-selectbutton .p-button) {
  padding: 0.5rem;
  font-size: 0.875rem;
}
</style>