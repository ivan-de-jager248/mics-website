export const removeFileExtension = (text: string): string => {
    const lastDotIndex = text.lastIndexOf('.');
    if (lastDotIndex === -1) return text; // No dot found, return original text
    return text.slice(0, lastDotIndex);
}