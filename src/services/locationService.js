import { DEFAULT_COORDINATES, JB_POSTCODES } from '../utils/constants'
import { trackEvent } from './firebase'

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        trackEvent('location_detected', {
          accuracy: location.accuracy
        })
        
        resolve(location)
      },
      (error) => {
        trackEvent('location_error', {
          error: error.message
        })
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    )
  })
}

export const getPostcodeCoordinates = (postcode) => {
  // Map JB postcodes to approximate coordinates
  const postcodeMap = {
    '81200': DEFAULT_COORDINATES.taman_molek,
    '80100': DEFAULT_COORDINATES.jb_center,
    '80300': DEFAULT_COORDINATES.tebrau,
    '81300': DEFAULT_COORDINATES.skudai
  }
  
  return postcodeMap[postcode] || DEFAULT_COORDINATES.jb_center
}

export const validateJohorPostcode = (postcode) => {
  return JB_POSTCODES.includes(postcode)
}
