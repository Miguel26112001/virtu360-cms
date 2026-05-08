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
  },
  computed: {
    isEditing() {
      return !!this.modelValue.id;
    },
    typeConfig() {
      const configs = {
        'INFO': { icon: 'pi-info-circle', color: 'text-blue-500' },
        'VIDEO': { icon: 'pi-video', color: 'text-red-500' },
        'GALLERY': { icon: 'pi-images', color: 'text-green-500' }
      };
      return configs[this.modelValue.type] || configs.INFO;
    }
  }
}
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="flex align-items-center justify-content-between pb-2 border-bottom-1 border-200">
      <div class="flex align-items-center gap-2">
        <i :class="['pi', typeConfig.icon, typeConfig.color, 'text-xl']"></i>
        <span class="font-bold text-lg">
          {{ isEditing ? 'Editar' : 'Nuevo' }} {{ modelValue.type }}
        </span>
      </div>
      <div class="surface-200 px-2 py-1 border-round font-mono text-xs shadow-1">
        {{ modelValue.position.yaw.toFixed(2) }}° , {{ modelValue.position.pitch.toFixed(2) }}°
      </div>
    </div>

    <div class="flex flex-column gap-1">
      <label class="text-xs font-semibold text-500">TIPO DE MARCADOR</label>
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
          class="w-full custom-selectbutton"
          :disabled="isEditing"
      />
      <small v-if="isEditing" class="text-400 italic">El tipo no se puede cambiar al editar</small>
    </div>

    <div class="grid grid-nogutter gap-2">
      <span class="p-float-label">
        <InputText id="title" v-model="modelValue.title" class="w-full" />
        <label for="title">Título del marcador</label>
      </span>
      <span class="p-float-label">
        <InputText id="tooltip" v-model="modelValue.tooltip" class="w-full" />
        <label for="tooltip">Texto del Tooltip (al pasar el mouse)</label>
      </span>
      <span class="p-float-label">
        <InputText id="summary" v-model="modelValue.summary" class="w-full" />
        <label for="summary">Resumen corto</label>
      </span>

      <Divider align="left" v-if="modelValue.type !== 'DEFAULT'">
        <span class="text-xs text-500 font-bold italic uppercase">Detalles del {{ modelValue.type }}</span>
      </Divider>

      <template v-if="modelValue.type === 'INFO'">
        <Textarea v-model="modelValue.content" placeholder="Contenido principal (HTML soportado)" class="w-full" rows="4" />
        <Textarea v-model="modelValue.description" placeholder="Notas adicionales o descripción" class="w-full" rows="2" />
      </template>

      <template v-if="modelValue.type === 'VIDEO'">
        <InputText v-model="modelValue.videoUrl" placeholder="URL: youtube.com/watch?v=..." class="w-full" />
        <div class="flex align-items-center gap-2 surface-100 p-2 border-round">
          <Checkbox v-model="modelValue.youtube" :binary="true" inputId="isYt" />
          <label for="isYt" class="text-sm cursor-pointer">Usar reproductor de YouTube</label>
        </div>
      </template>

      <template v-if="modelValue.type === 'GALLERY'">
        <p class="text-xs text-500 m-0">URLs de imágenes (una por línea o separadas por coma)</p>
        <Textarea :modelValue="modelValue.imageUrls.join('\n')"
                  @update:modelValue="val => modelValue.imageUrls = val.split(/[,\n]/).map(s => s.trim()).filter(s => s)"
                  placeholder="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                  class="w-full font-mono text-sm" rows="5" />
      </template>
    </div>

    <div class="flex gap-2 mt-3 pt-3 border-top-1 border-100">
      <Button
          icon="pi pi-trash"
          severity="danger"
          text
          @click="$emit('cancel')"
          v-tooltip.bottom="'Descartar cambios'"
      />
      <Button
          :label="isEditing ? 'Actualizar Marcador' : 'Guardar Marcador'"
          :icon="isEditing ? 'pi pi-refresh' : 'pi pi-check'"
          class="flex-1"
          :severity="isEditing ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="disabled"
          @click="$emit('save')"
      />
    </div>
  </div>
</template>

<style scoped>
.p-float-label label {
  font-size: 0.9rem;
}

:deep(.custom-selectbutton .p-button) {
  flex: 1;
}
</style>