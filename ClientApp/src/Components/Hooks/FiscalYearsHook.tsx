import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IExercice } from "../../Types/IExercice";

interface State {
    fiscalYears: IExercice[]
}

interface Action {
    type: 'FETCH_FISCAL_YEARS',
    payLoad: any
}

export const useFicalYears = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_FISCAL_YEARS':
                return { ...state, fiscalYears: action.payLoad }
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
        }
    }

}