import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { ITaxManagement } from "../../Types/ITaxManagement";


interface Action {
    type: 'FETCH_ALL',
    payLoad: any
}

export const usePayments = () => {

    const reducer = (state: any, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return {
                    ...state,
                    paiements: action.payLoad.paiements,
                    totalPages: action.payLoad.totalPages,
                    pageCourante: action.payLoad.pageCourante,
                    elementsParPage: action.payLoad.elementsParPage,
                    total_non_payes: action.payLoad.total_non_payes,
                    total_partiellement_payes: action.payLoad.total_partiellement_payes,
                    total_payes: action.payLoad.total_payes,
                    total_a_valider: action.payLoad.total_a_valider
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { paiements: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    const GetPayments = async(options: any) => {
        const fetch: ITaxManagement = await apiFetch(`/paiements/getall`, {
            method: 'POST',
            body: JSON.stringify(options)
        })
        dispatch({ type: 'FETCH_ALL', payLoad: fetch })
    }

    return {
        paiements: state.paiements,
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        total_non_payes: state.total_non_payes,
        total_partiellement_payes: state.total_partiellement_payes,
        total_payes: state.total_payes,
        total_a_valider: state.total_a_valider,
        getAll: async (options: any) => {
           await GetPayments(options)
        },
    }

}