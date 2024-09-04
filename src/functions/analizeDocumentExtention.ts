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

export function audioExtention(mimeType: string): string {
    const mimeToExtension: { [key: string]: string } = {
        "audio/aac": ".aac",
        "audio/amr": ".amr",
        "audio/mpeg":".mp3",
        "audio/mp4": ".m4a",
        "audio/ogg; codecs=opus": ".ogg"
    };

    return mimeToExtension[mimeType] || "Tipo MIME no reconocido";
}

export function videoExtention(mimeType: string): string {
    const mimeToExtension: { [key: string]: string } = {
        "video/3gp": ".3gp",
        "video/mp4": ".mp4"
    };

    return mimeToExtension[mimeType] || "Tipo MIME no reconocido";
}

export function imageExtension(mimeType: string): string {
    const mimeToExtension: { [key: string]: string } = {
      "image/jpeg": ".jpeg",
      "image/png": ".png"
    };
    
    return mimeToExtension[mimeType] || "Tipo MIME no reconocido";
  }
