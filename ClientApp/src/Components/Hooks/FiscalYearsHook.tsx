import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IExercice } from "../../Types/IExercice";

interface State {
    fiscalYears: IExercice[]
}

interface Action {
    type: 'FETCH_FISCAL_YEARS' | 'INSERT' | 'EDIT',
    payLoad: any
}

export const useFiscalYears = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_FISCAL_YEARS':
                return { ...state, fiscalYears: action.payLoad }
            case 'INSERT':
                return { ...state, fiscalYears: [...state.fiscalYears, action.payLoad] }
            case 'EDIT':
                return { ...state, fiscalYears: state.fiscalYears.map((fiscalYear: IExercice) => fiscalYear.id == action.payLoad.id ? action.payLoad : fiscalYear) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { fiscalYears: [] });

    return {
        fiscalYears: state.fiscalYears,
        getAll: async () => {
            const years: IExercice[] = await apiFetch('/fiscalyears/all')
            dispatch({ type: 'FETCH_FISCAL_YEARS', payLoad: years })
        },
        newFiscalYear: async (data: IExercice) => {
            const fetch = await apiFetch('/fiscalyears/new', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'INSERT', payLoad: fetch })
        },
        editFiscalYear: async (data: IExercice) => {
            const fetch = await apiFetch(`/fiscalyears/edit`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'EDIT', payLoad: fetch })
        }
    }

}