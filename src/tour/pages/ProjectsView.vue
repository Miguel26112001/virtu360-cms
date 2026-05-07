<script>
import { ProjectService } from "@/tour/services/project.service.js";

export default {
  name: 'ProjectsView',
  data() {
    return {
      projectService: new ProjectService(),
      projects: [],
      projectDialog: false,
      loading: false,
      newProject: {
        title: '',
        description: '',
        published: false
      }
    };
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        this.projects = await this.projectService.getByOwnerId('demo-user');
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        this.loading = false;
      }
    },

    openDialog() {
      this.newProject = { title: '', description: '', published: false };
      this.projectDialog = true;
    },

    handleSaveProject() {
      if (!this.newProject.title) return;
      this.projects.push({ ...this.newProject, id: Date.now() });
      this.projectDialog = false;
    },

    deleteProject(id) {
      this.projects = this.projects.filter(p => p.id !== id);
    },

    /**
     * Navega a la vista de nodos del proyecto seleccionado.
     */
    goToProjectNodes(projectId) {
      this.$router.push({ name: 'nodes', query: { projectId } });
    }
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex flex-column sm:flex-row align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="text-3xl font-bold m-0">Project Management</h1>
        <p class="text-500 m-0">View and manage your 360 tour projects</p>
      </div>
      <Button label="New Project" icon="pi pi-plus" @click="openDialog" />
    </div>

    <hr class="mb-4" style="border: 0; border-top: 1px solid #dee2e6;" />

    <div class="grid">
      <div v-if="loading" class="col-12 text-center py-6">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
        <p>Loading projects...</p>
      </div>

      <div v-else v-for="project in projects" :key="project.id" class="col-12 sm:col-6 lg:col-4 p-2">
        <div class="p-3 border-round-lg shadow-1 surface-card border-1 border-200 flex flex-column h-full">
          <div class="flex justify-content-between align-items-start mb-2">
            <h3 class="m-0 text-xl font-semibold">{{ project.title }}</h3>
            <span :class="['px-2 py-1 border-round text-xs font-bold',
                           project.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
              {{ project.published ? 'Published' : 'Draft' }}
            </span>
          </div>

          <p class="text-600 line-height-3 mb-2 flex-grow-1">
            {{ project.description || 'No description provided' }}
          </p>

          <div class="text-sm text-400 mb-4">
            <i class="pi pi-images mr-1"></i> {{ project.totalNodes }} nodes
          </div>

          <div class="flex gap-2">
            <Button icon="pi pi-trash" class="p-button-danger p-button-text" @click="deleteProject(project.id)" />
            <Button label="View Nodes"
                    icon="pi pi-arrow-right"
                    class="p-button-outlined ml-auto"
                    @click="goToProjectNodes(project.id)" />
          </div>
        </div>
      </div>

      <div v-if="projects.length === 0 && !loading" class="col-12 text-center py-6">
        <p class="text-500 text-xl">No projects available.</p>
      </div>
    </div>

    <Dialog v-model:visible="projectDialog" header="New Project" :style="{width: '450px'}" modal>
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="title" class="font-bold">Title</label>
          <InputText id="title" v-model="newProject.title" placeholder="e.g. My House Tour" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="desc" class="font-bold">Description</label>
          <Textarea id="desc" v-model="newProject.description" rows="3" />
        </div>

        <div class="flex align-items-center gap-2">
          <Checkbox v-model="newProject.published" :binary="true" inputId="published" />
          <label for="published">Publish immediately?</label>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="projectDialog = false" />
        <Button label="Save" icon="pi pi-check" @click="handleSaveProject" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.surface-card {
  transition: transform 0.2s, border-color 0.2s;
}
</style>