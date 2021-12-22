import {Spinner} from 'react-bootstrap'
import { ILoader } from '../../Types/ILoader'

export const Loader = ({animation = 'border', variant, marginBottom = 0}: ILoader) => {
return <Spinner animation={animation} as="div" variant={variant} style={{marginBottom: `${marginBottom}px`}}/>
}