/**
 * Representa los datos necesarios para crear un nodo (CreateNodeResource)
 */
export class CreateNodeRequest {
    constructor(caption = '', file = null) {
        this.caption = caption;
        this.file = file;
    }
}