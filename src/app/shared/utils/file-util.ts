export class FileUtil {
    static toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }
    static getFileExtension(fileName: string): string {
        return fileName.split('.').pop()?.toLowerCase() || '';
    }

    static getFileExtensionFromUrlDrive(urlDrive: string): string {
        return urlDrive.includes('presentation') ? 'pptx' :
            urlDrive.includes('document') ? 'docx' :
                urlDrive.includes('spreadsheet') ? 'xlsx' :
                    urlDrive.includes('image') ? 'jpg' :
                        urlDrive.includes('audio') ? 'mp3' :
                            urlDrive.includes('video') ? 'mp4' :
                                urlDrive.includes('folder') ? 'folder' :
                                    urlDrive.includes('pdf') ? 'pdf' :
                                        urlDrive.includes('spreadsheet') ? 'xlsx' :
                                            'pdf';
    }
}
