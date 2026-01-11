/**
 * Geolocation service
 */

/**
 * Get user's current position
 * @returns {Promise<{lat: number, lon: number}>}
 */
export async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('GEOLOCATION_NOT_SUPPORTED'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }),
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    reject(new Error('GEOLOCATION_DENIED'));
                } else {
                    reject(new Error('GEOLOCATION_ERROR'));
                }
            },
            { timeout: 10000 }
        );
    });
}
