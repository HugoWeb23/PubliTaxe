import {Spinner} from 'react-bootstrap'
import { ILoader } from '../../Types/ILoader'

export const Loader = ({animation = 'border', variant}: ILoader) => {
return <Spinner animation={animation} variant={variant}/>
}