import { apiFetch } from '../../Services/apiFetch'
import { Entreprise } from '../../Types/IEntreprise'
import { Loader } from '../UI/Loader'
import {TaxeForm} from './TaxeForm'

interface EditTax {
    entreprise: Entreprise,
    isLoading: boolean
}

export const EditTax = ({entreprise, isLoading}: EditTax) => {
    const handleEditTax = async(data: any) => {
            const editTax = await apiFetch(`/entreprises/edit/${data.matricule_ciger}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
    }
return <>
{isLoading && <Loader variant="primary"/>}
{Object.keys(entreprise).length > 0 && isLoading != true ? <TaxeForm type="edit" data={entreprise} onFormSubmit={handleEditTax}/> : 'Aucune entreprise' }
</>
}