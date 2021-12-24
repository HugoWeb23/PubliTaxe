import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IApercu_entreprise } from "../../Types/IApercu_entreprise";
import { ITaxManagement } from "../../Types/ITaxManagement";


interface Action {
    type: 'FETCH_ALL' | 'DELETE' | 'RECEIVED',
    payLoad: any
}

export const useEntreprises = () => {

    const reducer = (state: any, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return {
                    ...state,
                    entreprises: action.payLoad.entreprises,
                    totalPages: action.payLoad.totalPages,
                    pageCourante: action.payLoad.pageCourante,
                    elementsParPage: action.payLoad.elementsParPage,
                    totalRecus: action.payLoad.totalRecus,
                    totalEntreprises: action.payLoad.totalEntreprises
                }
            case 'DELETE':
                return { ...state, entreprises: state.entreprises.filter((elem: IApercu_entreprise) => elem.matricule_ciger != action.payLoad.matricule_ciger) }
            case 'RECEIVED':
                return {
                    ...state, entreprises: state.entreprises.map((ent: IApercu_entreprise) => {
                        if (action.payLoad.map((ent: IApercu_entreprise) => ent.matricule_ciger).includes(ent.matricule_ciger)) {
                            return { ...ent, recu: true }
                        }
                        return ent
                    })
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { entreprises: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    const GetTaxes = async(options: any) => {
        const fetch: ITaxManagement = await apiFetch(`/entreprises/names`, {
            method: 'POST',
            body: JSON.stringify(options)
        })
        dispatch({ type: 'FETCH_ALL', payLoad: fetch })
    }

    return {
        entreprises: state.entreprises,
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        totalRecus: state.totalRecus,
        totalEntreprises: state.totalEntreprises,
        getAll: async (options: any) => {
           await GetTaxes(options)
        },
        deleteOne: async (entreprise: IApercu_entreprise) => {
            await apiFetch(`/entreprises/delete/${entreprise.matricule_ciger}`, {
                method: 'DELETE'
            })
            if(state.entreprises.length <= 1 && state.totalPages > 1 ) {
                await GetTaxes({pageCourante: 1})
            }
            dispatch({ type: 'DELETE', payLoad: entreprise })
        },
        setReceived: async (selected: IApercu_entreprise[]) => {
            const matricules: number[] = []
            selected.forEach((ent: IApercu_entreprise) => matricules.push(ent.matricule_ciger))
            const encode = await apiFetch('/entreprises/encodereceived', {
                method: 'POST',
                body: JSON.stringify({ matricules: matricules })
            })
            dispatch({ type: 'RECEIVED', payLoad: encode })
        }
    }

}