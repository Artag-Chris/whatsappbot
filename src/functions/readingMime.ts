
export function readingMimeExtension(inputString: string, character: string): string {
    const index = inputString.indexOf(character);
    if (index !== -1) {
        return inputString.substring(index + 1);
    }
    return '';
}