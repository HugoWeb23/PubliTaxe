import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IApercu_entreprise } from "../../Types/IApercu_entreprise";

interface State {
    entreprises: IApercu_entreprise[]
}

interface Action {
    type: 'FETCH_ALL' | 'DELETE' | 'RECEIVED',
    payLoad: any
}

export const useEntreprises = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL':
                return { ...state, entreprises: action.payLoad }
            case 'DELETE':
                return { ...state, entreprises: state.entreprises.filter((elem: IApercu_entreprise) => elem.matricule_ciger != action.payLoad.matricule_ciger) }
            case 'RECEIVED':
                return {...state, entreprises: state.entreprises.map((ent: IApercu_entreprise) => {
                    if(action.payLoad.map((ent: IApercu_entreprise) => ent.matricule_ciger).includes(ent.matricule_ciger)) {
                        return {...ent, recu: true}
                    }
                    return ent
                })}
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { entreprises: [] });

    return {
        entreprises: state.entreprises,
        getAll: async (options: any) => {
            const fetch: IApercu_entreprise[] = await apiFetch(`/entreprises/names`, {
                method: 'POST',
                body: JSON.stringify(options)
            })
            dispatch({ type: 'FETCH_ALL', payLoad: fetch })
        },
        deleteOne: async(entreprise: IApercu_entreprise) => {
            await apiFetch(`/entreprises/delete/${entreprise.matricule_ciger}`, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE', payLoad: entreprise })
        },
        setReceived: async(selected: IApercu_entreprise[]) => {
            const matricules: number[] = []
            selected.forEach((ent: IApercu_entreprise) => matricules.push(ent.matricule_ciger))
            const encode = await apiFetch('/entreprises/encodereceived', {
                method: 'POST',
                body: JSON.stringify({matricules: matricules})
            })
            dispatch({ type: 'RECEIVED', payLoad: encode })
        }
    }

}