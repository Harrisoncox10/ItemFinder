export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      (err) => {
        const messages = {
          1: 'Location access was denied. Please allow location access and try again.',
          2: 'Your location could not be determined. Please try again.',
          3: 'Location request timed out. Please try again.',
        }
        reject(new Error(messages[err.code] || 'Unknown location error.'))
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  })
