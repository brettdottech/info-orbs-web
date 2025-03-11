export const isProgressiveJPEG = (arrayBuffer: ArrayBuffer): boolean => {
    const data = new Uint8Array(arrayBuffer);
    let offset = 2; // JPEG files start with 0xFFD8 (SOI marker), skip these bytes

    while (offset < data.length) {
        // Check for a marker (0xFF followed by a marker type)
        if (data[offset] === 0xFF) {
            const marker = data[offset + 1];
            if (marker === 0xC2) {
                // 0xC2 indicates progressive JPEG
                return true;
            } else if (marker === 0xC0) {
                // 0xC0 indicates baseline JPEG (not progressive)
                return false;
            }
            // Else, skip segment
            const segmentLength = (data[offset + 2] << 8) + data[offset + 3]; // Big-endian length
            offset += 2 + segmentLength; // Move to the next marker
        } else {
            break; // Invalid JPEG structure
        }
    }
    return false; // Default to "not progressive" if no start-of-frame (SOF) marker is found
};