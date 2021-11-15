import { Entreprise } from '../../Types/IEntreprise'
import { Loader } from '../UI/Loader'
import {TaxeForm} from './TaxeForm'

interface EditTax {
    entreprise: Entreprise,
    isLoading: boolean
}

export const EditTax = ({entreprise, isLoading}: EditTax) => {
return <>
{isLoading && <Loader variant="primary"/>}
{Object.keys(entreprise).length > 0 && isLoading != true ? <TaxeForm data={entreprise}/> : 'Aucune entreprise' }
</>
}