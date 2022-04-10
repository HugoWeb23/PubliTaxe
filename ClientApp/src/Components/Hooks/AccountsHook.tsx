import { useReducer } from "react"
import { apiFetch } from "../../Services/apiFetch";
import { IUser } from "../../Types/IUser";

interface State {
    accounts: IUser[]
}

interface Action {
    type: 'FETCH_ALL_ACCOUNTS' | 'DELETE',
    payLoad: any
}

export const useAccounts = () => {

    const reducer = (state: State, action: Action) => {
        switch (action.type) {
            case 'FETCH_ALL_ACCOUNTS':
                return { ...state, accounts: action.payLoad }
            case 'DELETE':
                return { ...state, accounts: state.accounts.filter((account: IUser) => account.id !== action.payLoad.id) }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, { accounts: [] });

    return {
        accounts: state.accounts,
        getAllAccounts: async (filters: any) => {
            const accounts: IUser[] = await apiFetch('/accounts/getallusers', {
                method: 'POST',
                body: JSON.stringify(filters)
            })
            dispatch({ type: 'FETCH_ALL_ACCOUNTS', payLoad: accounts })
        },
        deleteAccount: async (data: IUser) => {
            await apiFetch(`/accounts/deleteuser/${data.id}`, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE', payLoad: data })
        }
    }

}