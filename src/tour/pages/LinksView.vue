<script>
import LinkControlPanel from "@/tour/components/LinkControlPanel.vue";
import LinkViewer from "@/tour/components/LinkViewer.vue";
import { NodeService } from "@/tour/services/node.service.js";
import { ConnectNodeRequest } from "@/tour/model/connect-node.request.js";
import {Link} from "@/tour/model/link.entity.js";

export default {
  name: "LinksView",
  components: { LinkControlPanel, LinkViewer },
  data() {
    return {
      nodeService: new NodeService(),
      nodes: [],
      existingLinks: [],
      selectedFromNode: null,
      linkForm: new ConnectNodeRequest(),
      loading: false,
      projectId: this.$route.params.projectId
    };
  },
  computed: {
    availableDestinations() {
      return this.nodes.filter(n => n.id !== this.selectedFromNode?.id);
    }
  },
  methods: {
    async fetchNodes() {
      this.loading = true;
      try {
        this.nodes = await this.nodeService.getNodesByProjectId(this.projectId);
      } catch (e) {
        this.$toast.add({
          severity: 'error',
          summary: 'Load Error',
          detail: 'Could not fetch nodes.'
        });
      } finally {
        this.loading = false;
      }
    },
    async fetchExistingLinks(nodeId) {
      if (!nodeId) return;
      try {
        const response = await this.nodeService.getNodeLinks(this.projectId, nodeId);
        this.existingLinks = response.map(link => Link.fromResponse(link));
      } catch (e) {
        console.error("Error fetching links:", e);
      }
    },
    async onFromNodeSelected(node) {
      this.selectedFromNode = node;
      this.existingLinks = [];
      if (node) {
        await this.fetchExistingLinks(node.id);
      }
    },
    handleCoords({ yaw, pitch }) {
      this.linkForm.yaw = yaw;
      this.linkForm.pitch = pitch;
    },
    async onSave() {
      if (!this.linkForm.toNodeId || !this.selectedFromNode) return;

      this.loading = true;
      try {
        await this.nodeService.connectNodes(
            this.projectId,
            this.selectedFromNode.id,
            this.linkForm
        );
        this.$toast.add({
          severity: 'success',
          summary: 'Connected',
          detail: 'The link has been saved successfully'
        });

        this.linkForm = new ConnectNodeRequest();
        this.$refs.viewerRef.clearTemporaryMarker();
      } catch (e) {
        console.error(e);
        this.$toast.add({
          severity: 'error',
          summary: 'Save Failed',
          detail: 'Check console for details'
        });
      } finally {
        this.loading = false;
      }
    },
    handleNavigation(targetNodeId) {
      const targetNode = this.nodes.find(n => n.id === targetNodeId);

      if (targetNode) {
        this.onFromNodeSelected(targetNode);

        this.linkForm = new ConnectNodeRequest();

        this.$toast.add({
          severity: 'info',
          summary: 'Navegando',
          detail: `Cambiando a: ${targetNode.caption}`,
          life: 2000
        });
      }
    },
    async handleDeleteLink(linkId) {
      this.$confirm.require({
        message: 'Are you sure you want to delete this navigation link?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            await this.nodeService.deleteLink(this.projectId, this.selectedFromNode.id, linkId);

            this.$toast.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'The link has been removed',
              life: 3000
            });

            await this.fetchExistingLinks(this.selectedFromNode.id);
          } catch (e) {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not delete the link'
            });
          }
        }
      })
    },
  },
  mounted() {
    this.fetchNodes();
  }
}
</script>

<template>
  <div class="links-page p-2 sm:p-4">
    <div class="flex flex-column lg:flex-row gap-4">
      <div class="w-full lg:w-22rem">
        <LinkControlPanel
            v-model="linkForm"
            :selectedFromNode="selectedFromNode"
            :nodes="nodes"
            :availableDestinations="availableDestinations"
            :loading="loading"
            @save="onSave"
            @update:selectedFromNode="onFromNodeSelected"
        />
      </div>

      <div class="flex-grow-1" style="min-height: 500px; height: calc(100vh - 180px);">
        <LinkViewer
            ref="viewerRef"
            :panorama="selectedFromNode?.panoramaUrl"
            :caption="selectedFromNode?.caption"
            :existingLinks="existingLinks"
            @coords-captured="handleCoords"
            @node-navigate="handleNavigation"
            @link-delete="handleDeleteLink"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>