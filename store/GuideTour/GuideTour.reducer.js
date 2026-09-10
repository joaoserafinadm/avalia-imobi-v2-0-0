import { SET_GUIDE_TOUR } from './GuideTour.action'

// true = botões de guia visíveis nas páginas
const initialState = true

export default function guideTourReducer(state = initialState, action) {
    switch (action.type) {
        case SET_GUIDE_TOUR:
            return action.payload
        default:
            return state
    }
}
