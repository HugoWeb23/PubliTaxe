import { useContext } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { IUser } from '../Types/IUser'
import { UserContext } from './Contexts/UserContext';

interface IPrivateRoute extends RouteProps {
    component: any,
    user: IUser | null
}

export const PrivateRoute = ({ component: Component, user, ...rest }: IPrivateRoute) => {
    const value = useContext(UserContext);
    return (
        <Route
            {...rest}
            render={props => <>
                {value?.user ?
                    <>
                        <Component {...props} />
                    </>
                    :
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                }
            </>
            }
        />
    )
}