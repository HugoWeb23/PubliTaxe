import { useContext, cloneElement } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { IUser } from '../Types/IUser'
import { UserContext } from './Contexts/UserContext';

interface IPrivateRoute extends RouteProps {
    children?: any,
    component?: any
}

export const PrivateRoute = ({ children, component: Component, ...rest }: IPrivateRoute) => {
    const value = useContext(UserContext);
    const ComponentType = (props: any) => {
        let Children
        if(children) {
            Children = cloneElement(children, {...props})
        }
        return Component ? <Component {...props}/> : Children
    }
    return (
        <Route
            {...rest}
            render={props => <>
                {value?.user ?
                    <>
                        {value.user.changement_pass ? <Redirect to="/passwordchange"/> : ComponentType(props)}
                    </>
                    :
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                }
            </>
            }
        />
    )
}