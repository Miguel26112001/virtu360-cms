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
  <Card class="shadow-3 border-round-xl overflow-hidden">
    <template #title>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-map-marker text-primary text-2xl"></i>
        <span>Configurar Marcador</span>
      </div>
    </template>

    <template #content>
      <div class="flex flex-column gap-4 mt-2">
        <!-- Selector de Tipo -->
        <div class="flex flex-column gap-2">
          <label class="font-bold text-sm text-700">Tipo de Contenido</label>
          <SelectButton
              :modelValue="modelValue.type"
              @update:modelValue="$emit('update:modelValue', { ...modelValue, type: $event })"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              aria-labelledby="basic"
          >
            <template #option="slotProps">
              <i :class="slotProps.option.icon" class="mr-2"></i>
              <span>{{ slotProps.option.label }}</span>
            </template>
          </SelectButton>
        </div>

        <!-- Campos Comunes -->
        <div class="flex flex-column gap-2">
          <label class="font-bold text-sm text-700">Título</label>
          <InputText v-model="modelValue.title" placeholder="Ej: Recepción" class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-bold text-sm text-700">Tooltip (Texto rápido)</label>
          <InputText v-model="modelValue.tooltip" placeholder="Ej: Ver más..." class="w-full" />
        </div>

        <!-- Campo Condicional: INFO -->
        <div v-if="modelValue.type === 'info'" class="flex flex-column gap-2 animate-fadein">
          <label class="font-bold text-sm text-700 text-blue-600">Contenido Breve</label>
          <Textarea v-model="modelValue.content" rows="3" placeholder="Información rápida del punto..." />
        </div>

        <!-- Campo Condicional: DETAIL -->
        <div v-if="modelValue.type === 'detail'" class="flex flex-column gap-2 animate-fadein">
          <label class="font-bold text-sm text-700 text-purple-600">Descripción Detallada</label>
          <Textarea v-model="modelValue.description" rows="5" placeholder="Especificaciones técnicas o detalles extensos..." />
        </div>

        <!-- Coordenadas (Lectura) -->
        <div class="surface-100 p-2 border-round flex justify-content-between text-xs font-mono">
          <span>Y: {{ modelValue.position.yaw.toFixed(3) }}</span>
          <span>P: {{ modelValue.position.pitch.toFixed(3) }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <Button label="Cancelar" icon="pi pi-times" text class="flex-1" @click="$emit('cancel')" />
        <Button
            label="Guardar"
            icon="pi pi-check"
            class="flex-1 shadow-2"
            :loading="loading"
            :disabled="disabled || !modelValue.title"
            @click="$emit('save')"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>

</style>