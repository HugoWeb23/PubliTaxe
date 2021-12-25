import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IPrice } from "../../Types/IPrice";

interface State {
    prices: IPrice[]
}

interface Action {
    type: 'FETCH_ALL_PRICES' | 'INSERT' | 'EDIT',
    payLoad: any
}

export const usePrices = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL_PRICES':
                return { ...state, prices: action.payLoad }
            case 'INSERT':
                return { ...state, prices: [...state.prices, action.payLoad] }
            case 'EDIT':
                return { ...state, prices: state.prices.map((fiscalYear: IPrice) => fiscalYear.id == action.payLoad.id ? action.payLoad : fiscalYear) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { prices: [] });

    return {
        prices: state.prices,
        getAll: async () => {
            const prices: IPrice[] = await apiFetch('/prices/getall')
            dispatch({ type: 'FETCH_ALL_PRICES', payLoad: prices })
        },
        newPrice: async (data: IPrice) => {
            const fetch = await apiFetch('/prices/new', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'INSERT', payLoad: fetch })
            return fetch
        },
        editPrice: async (data: IPrice) => {
            const fetch = await apiFetch(`/prices/edit`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'EDIT', payLoad: fetch })
        }
    }

}