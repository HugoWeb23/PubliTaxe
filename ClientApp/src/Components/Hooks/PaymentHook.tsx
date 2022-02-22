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
                    elementsParPage: action.payLoad.elementsParPage
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { paiements: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    const GetPayments = async(options: any) => {
        const fetch: ITaxManagement = await apiFetch(`/paiements/getall/7`, {
            method: 'GET'
        })
        dispatch({ type: 'FETCH_ALL', payLoad: fetch })
    }

    return {
        paiements: state.paiements,
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        totalRecus: state.totalRecus,
        totalEntreprises: state.totalEntreprises,
        getAll: async (options: any) => {
           await GetPayments(options)
        },
    }

}