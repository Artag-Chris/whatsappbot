export function documentExtention(mimeType: string): string {
    const mimeToExtension: { [key: string]: string } = {
        "text/plain": ".txt",
        "application/vnd.ms-excel": ".xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/msword": ".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/vnd.ms-powerpoint": ".ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
        "application/pdf": ".pdf"
    };

    return mimeToExtension[mimeType] || "Tipo MIME no reconocido";
}