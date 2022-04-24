import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IPrice } from "../../Types/IPrice";
import { INotReceived } from "../../Types/INotReceived";
import { IApercu_entreprise } from "../../Types/IApercu_entreprise";

interface State {
    entreprises: any[],
    pageCourante: number,
    elementsParPage: number,
    totalPages: number
}

interface Action {
    type: 'FETCH_ALL' | 'DELETE' | 'CLEAR',
    payLoad: any
}

export const useChangeFiscalYear = () => {

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
            case 'DELETE':
                return { ...state, entreprises: state.entreprises.filter((ent: IApercu_entreprise) => ent.id_entreprise != action.payLoad) }
            case 'CLEAR':
                return { ...state, entreprises: [] }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { entreprises: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    return {
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        entreprises: state.entreprises,
        getAll: async (options: any) => {
            const fetch: IPrice[] = await apiFetch(`/entreprises/getallbydeletionrequest`, {
                method: 'POST',
                body: JSON.stringify(options)
            })
            dispatch({ type: 'FETCH_ALL', payLoad: fetch })
        },
        deleteOne: async (id_entreprise: number) => {
            const insert: INotReceived = await apiFetch(`/entreprises/canceldelete/${id_entreprise}`, {
                method: 'PUT'
            })
            dispatch({ type: 'DELETE', payLoad: insert.id_entreprise })
        },
        clearAll: async () => {
            dispatch({ type: 'CLEAR', payLoad: {} })
        }
    }

}