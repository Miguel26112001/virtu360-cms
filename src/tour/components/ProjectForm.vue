<script>
export default {
  name: 'ProjectForm',
  props: {
    visible: Boolean,
    modelValue: Object,
    loading: Boolean
  },
  methods: {
    updateField(field, value) {
      this.$emit('update:modelValue', { ...this.modelValue, [field]: value });
    }
  }
}
</script>

<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)"
          header="New Project" :style="{width: '450px'}" modal>
    <div class="flex flex-column gap-3">
      <div class="flex flex-column gap-2">
        <label for="title" class="font-bold">Title</label>
        <InputText id="title" v-bind:value="modelValue.title"
                   @input="updateField('title', $event.target.value)" placeholder="e.g. My House Tour" />
      </div>

      <div class="flex flex-column gap-2">
        <label for="desc" class="font-bold">Description</label>
        <Textarea id="desc" v-bind:value="modelValue.description"
                  @input="updateField('description', $event.target.value)" rows="3" />
      </div>

      <div class="flex align-items-center gap-2">
        <Checkbox :modelValue="modelValue.published" @update:modelValue="updateField('published', $event)" :binary="true" inputId="published" />
        <label for="published">Publish immediately?</label>
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="$emit('update:visible', false)" />
      <Button label="Save" icon="pi pi-check" :loading="loading" @click="$emit('save')" />
    </template>
  </Dialog>
</template>

<style scoped>

</style>