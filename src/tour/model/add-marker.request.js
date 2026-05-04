import { PositionResource } from "./position.resource.js";

export class AddMarkerRequest {
    constructor() {
        this.type = "info";
        this.position = new PositionResource();
        this.tooltip = "";
        this.title = "";
        this.content = "";
        this.description = "";
    }
}