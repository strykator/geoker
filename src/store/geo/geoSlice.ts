import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../index'

/*********************************************
   #1 -- Define a type for the slice state
**********************************************/
export interface IGeo {
  latitude: number
  longitude: number
  speed: number
  heading: number
}

/*********************************************
   #2 -- Define the initial state
**********************************************/
const initialState: IGeo = {
  latitude: 0,
  longitude: 0,
  speed: 0,
  heading: 0,
}

/*********************************************
   #3 -- Create Slice / Reducer
**********************************************/
export const geoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateGeo: (state, action: PayloadAction<IGeo>) => {
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.speed = action.payload.speed
      state.heading = action.payload.heading
    },
    resetGeo: state => {
      state.latitude = initialState.latitude
      state.longitude = initialState.longitude
      state.speed = initialState.speed
      state.heading = initialState.heading
    },
  },
})

/*********************************************
   #4 -- dispatch actions
**********************************************/
export const {updateGeo, resetGeo} = geoSlice.actions

/*********************************************
   #5 -- dispatch selectors
**********************************************/
export const selectGeoLatitude = (state: RootState) => state.geo.latitude
export const selectGeoLongitude = (state: RootState) => state.geo.longitude
export const selectGeoSpeed = (state: RootState) => state.geo.speed
export const selectGeoHeading = (state: RootState) => state.geo.heading

/*********************************************
   #6 -- export reducer
**********************************************/
export default geoSlice.reducer
