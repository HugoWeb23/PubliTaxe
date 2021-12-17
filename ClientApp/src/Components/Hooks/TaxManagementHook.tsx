import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IApercu_entreprise } from "../../Types/IApercu_entreprise";
import { Entreprise } from "../../Types/IEntreprise";

interface State {
    entreprises: IApercu_entreprise[]
}

interface Action {
    type: 'FETCH_ALL' | 'DELETE',
    payLoad: any
}

export const useEntreprises = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return { ...state, entreprises: action.payLoad }
            case 'DELETE':
                return { ...state, entreprises: state.entreprises.filter((elem: IApercu_entreprise) => elem.matricule_ciger != action.payLoad.matricule_ciger) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { entreprises: [] });

    return {
        entreprises: state.entreprises,
        getAll: async () => {
            const fetch: IApercu_entreprise[] = await apiFetch(`/entreprises/names`)
            dispatch({ type: 'FETCH_ALL', payLoad: fetch })
        },
        deleteOne: async(entreprise: IApercu_entreprise) => {
            await apiFetch(`/entreprises/delete/${entreprise.matricule_ciger}`, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE', payLoad: entreprise })
        },
        setReceived: (selected: IApercu_entreprise[]) => {

        }
    }

}