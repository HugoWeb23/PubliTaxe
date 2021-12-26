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

export const useInactiveAccounts = () => {

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
        getAllAccounts: async () => {
            const accounts: IUser[] = await apiFetch('/accounts/inactiveaccounts')
            dispatch({ type: 'FETCH_ALL_ACCOUNTS', payLoad: accounts })
        },
        activateAccount: async (data: IUser) => {
            await apiFetch(`/accounts/updateuser`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'DELETE', payLoad: data })
        },
        deleteAccount: async (data: IUser) => {
            await apiFetch(`/accounts/deleteuser/${data.id}`, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE', payLoad: data })
        }
    }

}