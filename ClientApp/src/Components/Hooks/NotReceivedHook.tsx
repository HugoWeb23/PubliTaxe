import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IPrice } from "../../Types/IPrice";

interface State {
    notReceivedList: any[]
}

interface Action {
    type: 'FETCH_ALL',
    payLoad: any
}

export const useNotReceived = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return { ...state, notReceivedList: action.payLoad }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { notReceivedList: [] });

    return {
        notReceivedList: state.notReceivedList,
        getAll: async () => {
            const fetch: IPrice[] = await apiFetch('/entreprises/notreceived')
            dispatch({ type: 'FETCH_ALL', payLoad: fetch })
        }
    }

}