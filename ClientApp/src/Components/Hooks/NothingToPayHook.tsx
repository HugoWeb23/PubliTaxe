import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { INotReceived } from "../../Types/INotReceived";
import { NothingToPay } from "../../Types/NothingToPay";
import { useEntreprises } from "./TaxManagementHook";

interface State {
    entreprises: any[],
    pageCourante: number,
    elementsParPage: number,
    totalPages: number
}

interface Action {
    type: 'FETCH_ALL' | 'UPDATEALL' | 'UPDATEONE',
    payLoad: any
}

export const useNothingToPay = () => {

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
            case 'UPDATEALL':
                return { ...state, entreprises: state.entreprises.filter((ent: NothingToPay) => ent.recu === false) }
            case 'UPDATEONE':
                return { ...state, entreprises: state.entreprises.filter((ent: NothingToPay) => ent.id_entreprise != action.payLoad) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { entreprises: [], totalPages: 1, pageCourante: 1, elementsParPage: 15 });

    const GetData = async (options: any) => {
        const fetch: NothingToPay[] = await apiFetch(`/entreprises/nothingtopay`, {
            method: 'POST',
            body: JSON.stringify(options)
        })
        dispatch({ type: 'FETCH_ALL', payLoad: fetch })
    }

    return {
        totalPages: state.totalPages,
        pageCourante: state.pageCourante,
        elementsParPage: state.elementsParPage,
        entreprises: state.entreprises,
        getAll: async (options: any) => {
            await GetData(options)
        },
        UpdateOne: async (id: number) => {
            const updateone: INotReceived = await apiFetch('/paiements/editnothingtopaystatus', {
                method: 'POST',
                body: JSON.stringify({ entreprises: [id] })
            })
            dispatch({ type: 'UPDATEONE', payLoad: id })
            if (state.totalPages > 1 && state.entreprises.length === 1) {
                await GetData({ pageCourante: state.pageCourante > 1 ? state.pageCourante - 1 : 1, elementsParPage: state.elementsParPage })
            }
        },
        UpdateAll: async () => {
            const updateall: INotReceived = await apiFetch('/paiements/editnothingtopaystatus', {
                method: 'POST',
                body: JSON.stringify({ entreprises: state.entreprises.filter((ent: NothingToPay) => ent.recu === true).map((ent: NothingToPay) => ent.id_entreprise) })
            })
            dispatch({ type: 'UPDATEALL', payLoad: updateall })
            if (state.totalPages > 1) {
                await GetData({ pageCourante: state.pageCourante > 1 ? state.pageCourante - 1 : 1, elementsParPage: state.elementsParPage })
            }
        }
    }

}