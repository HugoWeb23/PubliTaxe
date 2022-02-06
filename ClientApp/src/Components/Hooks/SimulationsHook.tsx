import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IApercu_entreprise } from "../../Types/IApercu_entreprise";
import { ITaxManagement } from "../../Types/ITaxManagement";


interface Action {
    type: 'FETCH_ALL',
    payLoad: any
}

export const useSimulations = () => {

    const reducer = (state: any, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return {
                    ...state,
                    simulations: action.payLoad.simulations,
                    totalPages: action.payLoad.totalPages,
                    pageCourante: action.payLoad.pageCourante,
                    elementsParPage: action.payLoad.elementsParPage,
                    totalSimulations: action.payLoad.totalSimulations
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { simulations: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    const GetSimulations = async(options: any) => {
        const fetch: ITaxManagement = await apiFetch(`/simulations/getall`, {
            method: 'POST',
            body: JSON.stringify(options)
        })
        dispatch({ type: 'FETCH_ALL', payLoad: fetch })
    }

    return {
        simulations: state.simulations,
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        totalSimulations: state.totalSimulations,
        getAll: async (options: any) => {
           await GetSimulations(options)
        },
    }

}