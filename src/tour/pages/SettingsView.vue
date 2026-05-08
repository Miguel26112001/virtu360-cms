<script>
import { ProjectService } from "@/tour/services/project.service.js";
import { UpdateProjectRequest } from "@/tour/model/update-project.request.js";

export default {
  name: "SettingsView",
  data() {
    return {
      projectService: new ProjectService(),
      projectId: this.$route.params.projectId,

      project: null,
      loading: false,
      saving: false,

      formData: {
        title: '',
        description: '',
        startingNodeId: null
      }
    };
  },
  computed: {
    selectedNodePreview() {
      if (!this.project || !this.formData.startingNodeId) return null;
      return this.project.nodes.find(n => n.id === this.formData.startingNodeId);
    }
  },
  methods: {
    async loadProjectData() {
      this.loading = true;
      try {
        const data = await this.projectService.getById(this.projectId);
        this.project = data;

        this.formData.title = data.title;
        this.formData.description = data.description;
        this.formData.startingNodeId = data.startingNodeId || (data.nodes.length > 0 ? data.nodes[0].id : null);
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el proyecto', life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async handleUpdate() {
      this.saving = true;
      try {
        const request = new UpdateProjectRequest(
            this.formData.title,
            this.formData.description,
            this.formData.startingNodeId
        );

        const updated = await this.projectService.update(this.projectId, request);
        this.project.title = updated.title;
        this.project.description = updated.description;

        this.$toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Ajustes guardados correctamente', life: 3000 });
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar', life: 3000 });
      } finally {
        this.saving = false;
      }
    },

    async togglePublish() {
      const isCurrentlyPublished = this.project.published;

      this.$confirm.require({
        message: `¿Estás seguro de que deseas ${isCurrentlyPublished ? 'despublicar' : 'publicar'} este proyecto?`,
        header: 'Confirmación de Visibilidad',
        icon: isCurrentlyPublished ? 'pi pi-eye-slash' : 'pi pi-send',
        acceptLabel: isCurrentlyPublished ? 'Pasar a Borrador' : 'Publicar Tour',
        acceptClass: isCurrentlyPublished ? 'p-button-secondary' : 'p-button-primary',
        accept: async () => {
          try {
            const result = isCurrentlyPublished
                ? await this.projectService.unpublish(this.projectId)
                : await this.projectService.publish(this.projectId);

            this.project.published = result.published;

            this.$toast.add({
              severity: 'info',
              summary: 'Estado cambiado',
              detail: `Proyecto ${this.project.published ? 'Publicado' : 'en Borrador'}`,
              life: 3000
            });
          } catch (error) {
            this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado', life: 3000 });
          }
        }
      });
    }
  },
  mounted() {
    this.loadProjectData();
  }
}
</script>

<template>
  <div class="p-3 md:p-6 max-w-7xl mx-auto">
    <div v-if="loading" class="flex flex-column gap-4">
      <div class="flex justify-content-between">
        <div class="w-3rem h-3rem surface-200 border-round"></div>
        <div class="w-10rem h-2rem surface-200 border-round"></div>
      </div>
      <div class="grid">
        <div class="col-8"><div class="h-20rem surface-100 border-round"></div></div>
        <div class="col-4"><div class="h-20rem surface-100 border-round"></div></div>
      </div>
    </div>

    <div v-else-if="project">
      <div class="flex flex-column md:flex-row md:align-items-center justify-content-between mb-5 gap-3">
        <div>
          <h1 class="text-4xl font-black m-0 text-900">Configuración</h1>
          <p class="text-500 text-lg">Administra los metadatos y la visibilidad de <b>{{ project.title }}</b></p>
        </div>
        <div class="flex align-items-center gap-3">
          <Tag :severity="project.published ? 'success' : 'warning'"
               :value="project.published ? 'PÚBLICO' : 'BORRADOR'"
               class="px-4 py-2 border-round-lg font-bold" />
          <Button icon="pi pi-external-link" text rounded v-tooltip.bottom="'Ver tour público'" v-if="project.published" />
        </div>
      </div>

      <div class="grid">
        <div class="col-12 lg:col-8">
          <Card class="shadow-4 border-round-xl border-none">
            <template #title>
              <div class="flex align-items-center gap-2 mb-2">
                <i class="pi pi-pencil text-primary"></i>
                <span>Información del Tour</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="flex flex-column gap-2">
                  <label for="title" class="font-bold text-900">Título del Proyecto</label>
                  <InputText id="title" v-model="formData.title" class="p-inputtext-lg w-full" placeholder="Nombre que verán los visitantes" />
                </div>

                <div class="flex flex-column gap-2">
                  <label for="desc" class="font-bold text-900">Descripción Corta</label>
                  <Textarea id="desc" v-model="formData.description" rows="4" class="w-full" placeholder="Una breve introducción al recorrido virtual..." />
                </div>

                <div class="flex flex-column gap-2">
                  <label class="font-bold text-900">Escena de Inicio</label>
                  <div class="grid grid-nogutter gap-3 align-items-start">
                    <div class="col-12 md:col-6">
                      <Select v-model="formData.startingNodeId" :options="project.nodes"
                              optionLabel="caption" optionValue="id"
                              placeholder="Selecciona el nodo inicial" class="w-full shadow-1" />
                      <p class="text-xs text-500 mt-2 line-height-2">
                        <i class="pi pi-info-circle mr-1"></i>
                        Los visitantes comenzarán su experiencia desde esta ubicación específica.
                      </p>
                    </div>

                    <div class="col-12 md:col-5 flex flex-column align-items-center">
                      <div v-if="selectedNodePreview" class="relative border-round-lg overflow-hidden shadow-3 border-1 border-300 w-full h-8rem bg-cover bg-center"
                           :style="{ backgroundImage: `url(${selectedNodePreview.thumbnailUrl})` }">
                        <div class="absolute bottom-0 w-full bg-black-alpha-60 text-white text-xs p-1 text-center">
                          Vista Previa: {{ selectedNodePreview.caption }}
                        </div>
                      </div>
                      <div v-else class="w-full h-8rem border-2 border-dashed border-300 border-round-lg flex align-items-center justify-content-center text-400 bg-gray-50">
                        <i class="pi pi-image mr-2"></i> Sin selección
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-content-end mt-4">
                  <Button label="Guardar Ajustes" icon="pi pi-check"
                          :loading="saving" @click="handleUpdate" class="p-button-lg px-6 border-round-lg" />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 lg:col-4">
          <div class="flex flex-column gap-4">

            <Card class="shadow-4 border-round-xl border-none">
              <template #title>Visibilidad</template>
              <template #content>
                <div class="flex flex-column align-items-center text-center gap-3">
                  <div :class="['w-4rem h-4rem border-circle flex align-items-center justify-content-center', project.published ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600']">
                    <i :class="['pi text-2xl', project.published ? 'pi-globe' : 'pi-lock']"></i>
                  </div>
                  <p class="m-0 text-700">
                    {{ project.published
                      ? 'Tu tour es público. Cualquiera con el link puede explorarlo.'
                      : 'Tu tour es privado. Solo es visible desde tu panel de editor.'
                    }}
                  </p>
                  <Button :label="project.published ? 'Retirar del Público' : 'Lanzar Tour Público'"
                          :icon="project.published ? 'pi pi-eye-slash' : 'pi pi-send'"
                          :severity="project.published ? 'secondary' : 'primary'"
                          @click="togglePublish" class="w-full py-3 font-bold mt-2" />
                </div>
              </template>
            </Card>

            <Card class="shadow-2 border-round-xl surface-50">
              <template #content>
                <div class="flex flex-column gap-3 text-sm">
                  <div class="flex justify-content-between">
                    <span class="text-500">ID del Proyecto:</span>
                    <span class="font-mono text-700">{{ project.id.split('-')[0] }}...</span>
                  </div>
                  <div class="flex justify-content-between">
                    <span class="text-500">Total Escenas:</span>
                    <span class="font-bold text-700">{{ project.nodes.length }}</span>
                  </div>
                  <div class="flex justify-content-between">
                    <span class="text-500">Último cambio:</span>
                    <span class="text-700">{{ project.updatedAt?.toLocaleDateString() }}</span>
                  </div>
                </div>
              </template>
            </Card>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  background: #ffffff;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.max-w-7xl {
  max-width: 80rem;
}
</style>