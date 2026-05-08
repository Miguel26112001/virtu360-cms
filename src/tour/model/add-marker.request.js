import { PositionResource } from "./position.resource.js";

export class AddMarkerRequest {
    constructor(type = 'INFO') {
        this.position = new PositionResource();
        this.tooltip = "";
        this.title = "";
        this.summary = "";
        this.type = type;
    }
}

export class AddInfoMarkerRequest extends AddMarkerRequest {
    constructor() {
        super('INFO');
        this.content = "";
        this.description = "";
    }
}

export class AddVideoMarkerRequest extends AddMarkerRequest {
    constructor() {
        super('VIDEO');
        this.videoUrl = "";
        this.youtube = false;
    }
}

export class AddGalleryMarkerRequest extends AddMarkerRequest {
    constructor() {
        super('GALLERY');
        this.imageUrls = [];
    }
}