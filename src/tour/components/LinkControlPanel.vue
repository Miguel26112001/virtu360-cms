<script>
export default {
  name: 'LinkControlPanel',
  props: {
    nodes: Array,
    availableDestinations: Array,
    modelValue: Object,
    selectedFromNode: Object,
    loading: Boolean
  },
  emits: ['update:selectedFromNode', 'update:modelValue', 'save'],
  methods: {
    updateFromNode(val) {
      this.$emit('update:selectedFromNode', val);
    },
    updateToNode(val) {
      this.$emit('update:modelValue', { ...this.modelValue, toNodeId: val });
    }
  }
}
</script>

<template>
  <Card class="shadow-3">
    <template #title>Nueva Conexión</template>
    <template #content>
      <div class="flex flex-column gap-4 mt-2">

        <!-- Origen: Resaltar si no hay nada seleccionado -->
        <div class="flex flex-column gap-2">
          <label class="font-bold text-sm" :class="{'text-red-500': !selectedFromNode}">
            1. Escena de Origen
          </label>
          <Select
              :modelValue="selectedFromNode"
              @update:modelValue="updateFromNode"
              :options="nodes"
              optionLabel="caption"
              placeholder="Seleccionar origen"
              :invalid="!selectedFromNode"
              class="w-full"
          />
        </div>

        <!-- Destino: Deshabilitado hasta que haya origen -->
        <div class="flex flex-column gap-2">
          <label class="font-bold text-sm" :class="{'text-500': !selectedFromNode}">
            2. Escena de Destino
          </label>
          <Select
              :modelValue="modelValue.toNodeId"
              @update:modelValue="updateToNode"
              :options="availableDestinations"
              optionValue="id"
              optionLabel="caption"
              placeholder="¿A dónde apunta el marcador?"
              :disabled="!selectedFromNode"
              :invalid="selectedFromNode && !modelValue.toNodeId"
              class="w-full"
          />
        </div>

        <!-- Coordenadas: Cambio de color si faltan -->
        <div class="p-3 border-round-lg transition-colors duration-300"
             :class="modelValue.yaw === 0 ? 'bg-yellow-50 border-1 border-yellow-200' : 'bg-green-50 border-1 border-green-200'">
          <div class="flex align-items-center gap-2 mb-2">
            <i :class="modelValue.yaw === 0 ? 'pi pi-exclamation-triangle text-yellow-600' : 'pi pi-check-circle text-green-600'"></i>
            <span class="text-xs font-bold uppercase" :class="modelValue.yaw === 0 ? 'text-yellow-700' : 'text-green-700'">
              {{ modelValue.yaw === 0 ? 'Falta posición 360°' : 'Posición capturada' }}
            </span>
          </div>
          <div class="flex justify-content-between text-sm">
            <span class="font-mono">Y: {{ modelValue.yaw.toFixed(4) }}</span>
            <span class="font-mono">P: {{ modelValue.pitch.toFixed(4) }}</span>
          </div>
        </div>

        <Button
            :label="loading ? 'Guardando...' : 'Confirmar Enlace'"
            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            class="w-full p-button-lg"
            :loading="loading"
            :disabled="!modelValue.toNodeId || modelValue.yaw === 0 || !selectedFromNode"
            @click="$emit('save')"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>

</style>