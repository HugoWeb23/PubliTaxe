import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IPrice } from "../../Types/IPrice";
import { INotReceived } from "../../Types/INotReceived";

interface State {
    entreprises: any[],
    pageCourante: number,
    elementsParPage: number,
    totalPages: number
}

interface Action {
    type: 'FETCH_ALL' | 'INSERT',
    payLoad: any
}

export const useNotReceived = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return {
                    ...state,
                    entreprises: action.payLoad.entreprises,
                    totalPages: action.payLoad.totalPages,
                    pageCourante: action.payLoad.pageCourante,
                    elementsParPage: action.payLoad.elementsParPage,
                }
            case 'INSERT':
                return { ...state, entreprises: state.entreprises.filter((elem: INotReceived) => elem.id_entreprise != action.payLoad.id_entreprise) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { entreprises: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    return {
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        notReceivedList: state.entreprises,
        getAll: async (options: any) => {
            const fetch: IPrice[] = await apiFetch(`/entreprises/notreceived`, {
                method: 'POST',
                body: JSON.stringify(options)
            })
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