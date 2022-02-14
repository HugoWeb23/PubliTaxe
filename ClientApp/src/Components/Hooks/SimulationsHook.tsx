import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IApercuSimulation } from "../../Types/IApercuSimulation";
import { IApercu_entreprise } from "../../Types/IApercu_entreprise";
import { ITaxManagement } from "../../Types/ITaxManagement";


interface Action {
    type: 'FETCH_ALL' | 'DELETE',
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
                case 'DELETE':
                return { ...state, simulations: state.simulations.filter((sim: IApercuSimulation) => sim.id_simulation != action.payLoad.id_simulation) }
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
        deleteOne: async (simulation: IApercuSimulation) => {
            await apiFetch(`/simulations/delete/${simulation.id_simulation}`, {
                method: 'DELETE'
            })
            if(state.simulations.length <= 1 && state.totalPages > 1 ) {
                await GetSimulations({pageCourante: 1})
            }
            dispatch({ type: 'DELETE', payLoad: simulation })
        },
    }

}