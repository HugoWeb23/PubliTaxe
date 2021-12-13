import { useEffect, useState } from 'react'
import { apiFetch } from '../../Services/apiFetch'
import { Entreprise } from '../../Types/IEntreprise'
import { Loader } from '../UI/Loader'
import {TaxeForm} from './TaxeForm'

interface EditTax {
    entreprise: Entreprise,
    isLoading: boolean
}

export const EditTax = ({match, motifs, tarifs, currentFiscalYear, informations}: any) => {

    const [entreprise, setEntreprise] = useState<Entreprise>({} as Entreprise)
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async() => {
            const fetchEntreprise = await apiFetch(`/entreprises/id/${match.params.id}`)
            setEntreprise(fetchEntreprise)
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const handleEditTax = async(data: any) => {
            const {code_postal, ...data2} = data
            const editTax = await apiFetch(`/entreprises/edit/${data.matricule_ciger}`, {
                method: 'PUT',
                body: JSON.stringify(data2)
            })
            return editTax
    }
return <>
{(loader != true && motifs != null && tarifs != null && currentFiscalYear != null && informations != null) ? 
<TaxeForm type="edit" data={entreprise} motifs={motifs} tarifs={tarifs} currentFiscalYear={currentFiscalYear} informations={informations} onFormSubmit={handleEditTax}/> : 
<Loader/> }
</>
}