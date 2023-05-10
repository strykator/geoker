import {type LocationGeocodedAddress} from 'expo-location'

export interface IStorageData {
  date: string
  start: number
  stop: number
  mile: number
  startLocation: {
    latitude: number
    longitude: number
  }
  stopLocation: {
    latitude: number
    longitude: number
  }
}

export interface IData {
  title: string
  data: {
    date: string
    start: number
    stop: number
    startLocation: {
      latitude: number
      longitude: number
    }
    stopLocation: {
      latitude: number
      longitude: number
    }
    mile: number
  }[]
}

export const formatData = (data: IStorageData[] | undefined): IData[] => {
  if (!data) return []

  // Group data by date
  const groupedData: IStorageData = data.reduce((acc: any, item: any) => {
    const date = item.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)

    return acc
  }, {})

  // Transform grouped data into an array of objects with a data property
  const sectionData = Object.entries(groupedData).map(([key, value]) => ({
    title: key,
    data: value,
  }))

  return sectionData.reverse()
}

export const meterToMile = (meter: number | null | undefined) =>
  meter ? meter / 1609.344 : 0

export const formatNumberDigits = (
  number: number | null | undefined,
  digits = 3,
) => (number ? number.toFixed(digits) : '0')

export const getAddressFromReversedGeocode = (
  addressObject: LocationGeocodedAddress | undefined,
) => {
  if (!addressObject || Object.keys(addressObject).length === 0) {
    return ''
  }

  let formattedAddress = ''
  const {streetNumber, street, name, city, region, postalCode} = addressObject

  if (!streetNumber && !street && name) {
    formattedAddress = `${name}, ${city}, ${region} ${postalCode}`
  } else if (!streetNumber && street) {
    formattedAddress = `${street}, ${city}, ${region} ${postalCode}`
  } else {
    formattedAddress = `${streetNumber} ${street}, ${city}, ${region} ${postalCode}`
  }

  return formattedAddress
}
