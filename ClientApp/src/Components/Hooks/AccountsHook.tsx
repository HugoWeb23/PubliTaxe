import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IExercice } from "../../Types/IExercice";
import { IUser } from "../../Types/IUser";

interface State {
    accounts: IUser[]
}

interface Action {
    type: 'FETCH_ALL_ACCOUNTS' | 'INSERT' | 'EDIT',
    payLoad: any
}

export const useAccounts = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL_ACCOUNTS':
                return { ...state, accounts: action.payLoad }
            case 'INSERT':
                return { ...state, accounts: [...state.accounts, action.payLoad] }
            case 'EDIT':
                return { ...state, accounts: state.accounts.map((account: IUser) => account.id == action.payLoad.id ? action.payLoad : account) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { accounts: [] });

    return {
        accounts: state.accounts,
        getAllAccounts: async () => {
            const accounts: IUser[] = await apiFetch('/accounts/getallusers')
            dispatch({ type: 'FETCH_ALL_ACCOUNTS', payLoad: accounts })
        },
        editAccount: async (data: IExercice) => {
            const fetch = await apiFetch(`/accounts/edituser`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'EDIT', payLoad: fetch })
        }
    }

}