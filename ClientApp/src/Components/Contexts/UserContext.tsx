import { createContext } from "react";
import { IUser } from "../../Types/IUser";

export interface IUserContext {
user: IUser | null,
toggleUser: (user?: IUser) => void
}

export const UserContext = createContext<IUserContext>({} as IUserContext);