/**
 * Clase base para actualizaciones.
 * Nota: El backend espera yaw y pitch directamente en la raíz.
 */
export class UpdateMarkerRequest {
    constructor(marker) {
        this.yaw = marker.position?.yaw || 0;
        this.pitch = marker.position?.pitch || 0;
        this.title = marker.title || "";
        this.tooltip = marker.tooltip || "";
        this.summary = marker.summary || "";
    }
}

export class UpdateInfoMarkerRequest extends UpdateMarkerRequest {
    constructor(marker) {
        super(marker);
        this.content = marker.content || "";
        this.description = marker.description || "";
    }
}

export class UpdateVideoMarkerRequest extends UpdateMarkerRequest {
    constructor(marker) {
        super(marker);
        this.videoUrl = marker.videoUrl || "";
        this.youtube = marker.youtube || false;
    }
}

export class UpdateGalleryMarkerRequest extends UpdateMarkerRequest {
    constructor(marker) {
        super(marker);
        this.imageUrls = marker.imageUrls || [];
    }
}