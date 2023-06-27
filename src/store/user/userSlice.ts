import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../index'

/*********************************************
   #1 -- Define a type for the slice state
**********************************************/
export interface IUserState {
  uid: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  roles: string[]
  accessToken: string
  refreshToken: string
  expirationTime?: number
}

/*********************************************
   #2 -- Define the initial state
**********************************************/
const initialState: IUserState = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  roles: [],
  accessToken: '',
  refreshToken: '',
  expirationTime: 0,
}

/*********************************************
   #3 -- Create Slice / Reducer
**********************************************/
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<IUserState>) => {
      state.uid = action.payload.uid ?? ''
      state.firstName = action.payload.firstName ?? ''
      state.lastName = action.payload.lastName ?? ''
      state.email = action.payload.email ?? ''
      state.mobile = action.payload.mobile ?? ''
      state.roles = action.payload.roles ?? []
      state.accessToken = action.payload.accessToken ?? ''
      state.refreshToken = action.payload.refreshToken ?? ''
      state.expirationTime = action.payload.expirationTime ?? 0
    },
    resetUser: state => {
      state.uid = initialState.uid
      state.firstName = initialState.firstName
      state.lastName = initialState.lastName
      state.email = initialState.email
      state.mobile = initialState.mobile
      state.roles = initialState.roles
      state.accessToken = initialState.accessToken
      state.refreshToken = initialState.refreshToken
      state.expirationTime = initialState.expirationTime
    },
  },
})

/*********************************************
   #4 -- dispatch actions
**********************************************/
export const {updateUser, resetUser} = userSlice.actions

/*********************************************
   #5 -- dispatch selectors
**********************************************/
export const selectUserUid = (state: RootState) => state.user.uid
export const selectUserFirstName = (state: RootState) => state.user.firstName
export const selectUserLastName = (state: RootState) => state.user.lastName
export const selectUserEmail = (state: RootState) => state.user.email
export const selectUserMobile = (state: RootState) => state.user.mobile
export const selectUserRoles = (state: RootState) => state.user.roles
export const selectUserAccessToken = (state: RootState) =>
  state.user.accessToken
export const selectUserRefreshToken = (state: RootState) =>
  state.user.refreshToken
export const selectUserExpirationTime = (state: RootState) =>
  state.user.expirationTime

/*********************************************
   #6 -- export reducer
**********************************************/
export default userSlice.reducer
