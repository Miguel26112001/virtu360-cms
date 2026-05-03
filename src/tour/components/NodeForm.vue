<script>
export default {
  name: 'NodeForm',
  props: {
    visible: Boolean,
    modelValue: Object,
    loading: Boolean
  },
  emits: ['update:visible', 'update:modelValue', 'close', 'save'],
  methods: {
    onFileSelect(event) {
      const updatedValue = { ...this.modelValue, file: event.files[0] };
      this.$emit('update:modelValue', updatedValue);
    }
  }
}
</script>

<template>
  <Dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      header="Nuevo Nodo"
      :modal="true"
      :draggable="false"
      class="p-fluid shadow-8"
      :style="{ width: '30rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '100vw' }"
  >
  <ProgressBar v-if="loading" mode="indeterminate" style="height: 4px" class="mb-4" />

  <div class="flex flex-column gap-4">
    <div class="flex flex-column gap-2">
      <label for="caption" class="font-semibold">Nombre de la escena</label>
      <InputText
          id="caption"
          :modelValue="modelValue.caption"
          @update:modelValue="$emit('update:modelValue', { ...modelValue, caption: $event })"
          placeholder="Ej: Terraza Principal"
          :disabled="loading"
      />
    </div>

    <div class="flex flex-column gap-2">
      <label class="font-semibold">Imagen Panorama 360°</label>
      <FileUpload
          mode="basic"
          accept="image/*"
          :maxFileSize="52428800"
          @select="onFileSelect"
          :disabled="loading"
          chooseLabel="Subir Imagen"
          chooseIcon="pi pi-upload"
          class="w-full"
      />
      <!-- Miniatura de previsualización si existe archivo -->
      <div v-if="modelValue.file" class="text-primary text-sm mt-1">
        <i class="pi pi-file mr-1"></i> {{ modelValue.file.name }}
      </div>
    </div>
  </div>

  <template #footer>
    <!-- En móvil, botones alineados al ancho total -->
    <div class="flex flex-column-reverse sm:flex-row gap-2 w-full sm:w-auto">
      <Button label="Cancelar" icon="pi pi-times" text @click="$emit('close')" :disabled="loading" class="w-full sm:w-auto" />
      <Button label="Crear Nodo" icon="pi pi-check" @click="$emit('save')" :loading="loading" class="w-full sm:w-auto px-4" />
    </div>
  </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-fileupload-content) {
  padding: 0;
  border: none;
}

:deep(.p-fileupload-buttonbar) {
  padding: 0 0 1rem 0;
  background: transparent;
  border: none;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px red;
}

.custom-fileupload :deep(.p-button-icon) {
  margin-right: 0.5rem;
}
</style>