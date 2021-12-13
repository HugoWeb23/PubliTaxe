import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IPrice } from "../../Types/IPrice";
import { INotReceived } from "../../Types/INotReceived";

interface State {
    notReceivedList: any[]
}

interface Action {
    type: 'FETCH_ALL' | 'INSERT',
    payLoad: any
}

export const useNotReceived = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return { ...state, notReceivedList: action.payLoad }
            case 'INSERT':
                return { ...state, notReceivedList: state.notReceivedList.filter((elem: INotReceived) => elem.matricule_ciger != action.payLoad.matricule_ciger) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { notReceivedList: [] });

    return {
        notReceivedList: state.notReceivedList,
        getAll: async (FiscalYear: number) => {
            const fetch: IPrice[] = await apiFetch(`/entreprises/notreceived/${FiscalYear}`)
            dispatch({ type: 'FETCH_ALL', payLoad: fetch })
        },
        Insert: async (data: INotReceived) => {
            const insert: INotReceived = await apiFetch('/notreceived/new', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'INSERT', payLoad: insert })
        }
    }

}