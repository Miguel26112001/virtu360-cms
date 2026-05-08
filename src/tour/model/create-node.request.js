/**
 * Representa los datos necesarios para crear un nodo.
 * Mapea directamente con CreateNodeResource en Java.
 */
export class CreateNodeRequest {
    constructor(caption = '', file = null) {
        this.caption = caption;
        this.file = file;
    }

    /**
     * Valida si el objeto tiene los datos mínimos para ser enviado.
     */
    isValid() {
        return this.caption.trim() !== '' && this.file !== null;
    }
}