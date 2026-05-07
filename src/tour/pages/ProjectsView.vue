<script>
import { ProjectService } from "@/tour/services/project.service.js";
import { CreateProjectRequest } from "@/tour/model/create-project.request.js";
import ProjectCard from "@/tour/components/ProjectCard.vue";
import ProjectForm from "@/tour/components/ProjectForm.vue";

export default {
  name: 'ProjectsView',
  components: { ProjectCard, ProjectForm },
  data() {
    return {
      projectService: new ProjectService(),
      projects: [],
      projectDialog: false,
      loading: false,
      newProject: new CreateProjectRequest()
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
      this.newProject = new CreateProjectRequest();
      this.projectDialog = true;
    },
    async handleSave() {
      if (!this.newProject.title) return;
      this.loading = true;

      try {
        await this.projectService.create(this.newProject);

        this.projectDialog = false;
        await this.fetchProjects();
      } catch (error) {
        console.error("Error saving project:", error);
      } finally {
        this.loading = false;
      }
    },
    handleDelete(id) {
      this.$confirm.require({
        message: 'Do you really want to delete this project? This action cannot be undone.',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-text',
        acceptClass: 'p-button-danger',
        accept: async () => {
          this.loading = true;
          try {
            await this.projectService.delete(id);
            await this.fetchProjects();
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Project deleted successfully',
              life: 3000
            });
          } catch (error) {
            console.error("Error deleting project:", error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not delete project',
              life: 3000
            });
          } finally {
            this.loading = false;
          }
        }
      });
    },
    handleOpenProject(project) {
      this.$router.push({
        name: 'nodes',
        params: { projectId: project.id },
        query: { projectName: project.title }
      });
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
        <h1 class="text-3xl font-bold m-0 text-900">Project Management</h1>
        <p class="text-500 m-0">View and manage your 360 tour projects</p>
      </div>
      <Button label="New Project" icon="pi pi-plus" class="shadow-2" @click="openDialog" />
    </div>

    <Divider />

    <div class="grid">
      <div v-if="loading" class="col-12 text-center py-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        <p class="text-500 mt-3">Loading projects...</p>
      </div>

      <template v-else>
        <div v-for="project in projects" :key="project.id" class="col-12 sm:col-6 lg:col-4 p-2">
          <ProjectCard
              :project="project"
              @delete="handleDelete"
              @open="handleOpenProject"
          />
        </div>

        <div v-if="projects.length === 0" class="col-12 text-center py-8 border-2 border-dashed border-300 border-round-xl">
          <i class="pi pi-folder-open text-300 text-6xl mb-3"></i>
          <p class="text-500 text-xl">No projects found. Create your first one!</p>
        </div>
      </template>
    </div>

    <ProjectForm
        v-model:visible="projectDialog"
        v-model="newProject"
        :loading="loading"
        @save="handleSave"
    />
  </div>
</template>

<style scoped>

</style>