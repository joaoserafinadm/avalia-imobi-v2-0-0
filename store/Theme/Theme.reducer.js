import { SET_THEME } from './Theme.action'

const initialState = 'light'

export default function themeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_THEME:
            return action.payload
        default:
            return state
    }
}
