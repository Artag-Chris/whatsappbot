
export function readingMimeExtension(inputString: string, character: string): string {
    const index = inputString.indexOf(character);
    if (index !== -1) {
        return inputString.substring(index + 1);
    }
    return '';
}

export function readingMimeExtensionForAudio(inputString: string, character: string): string {
    const index = inputString.indexOf(character);
    if (index !== -1) {
        // Obtener la subcadena después del carácter especificado
        let result = inputString.substring(index + 1);
        // Encontrar el índice del carácter ';' en la subcadena
        const semicolonIndex = result.indexOf(';');
        if (semicolonIndex !== -1) {
            // Obtener la subcadena antes del ';'
            result = result.substring(0, semicolonIndex);
        }
        // Eliminar los espacios en blanco
        result = result.replace(/\s+/g, '');
        return result;
    }
    return '';
   
}