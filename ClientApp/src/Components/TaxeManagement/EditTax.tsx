import { useEffect, useState } from 'react'
import { apiFetch } from '../../Services/apiFetch'
import { Entreprise } from '../../Types/IEntreprise'
import { CustomLoader } from '../UI/CustomLoader'
import { TaxeForm } from './TaxeForm'
import { useHistory } from 'react-router-dom'

interface EditTax {
    entreprise: Entreprise,
    isLoading: boolean
}

export const EditTax = ({ match, motifs, tarifs, currentFiscalYear, informations }: any) => {

    const [entreprise, setEntreprise] = useState<Entreprise>({} as Entreprise)
    const [loader, setLoader] = useState<boolean>(true)
    const history = useHistory()

    useEffect(() => {
        (async () => {
            try {
                const fetchEntreprise: Entreprise = await apiFetch(`/entreprises/id/${match.params.id}`)
                setEntreprise(fetchEntreprise)
                setTimeout(() => setLoader(false), 300)
            } catch(e: any) {
                history.push('/')
            }
        })()
    }, [])

    const handleEditTax = async (data: any) => {
        const { code_postal, ...data2 } = data
        const editTax = await apiFetch(`/entreprises/edit/${data.id_entreprise}`, {
            method: 'PUT',
            body: JSON.stringify(data2)
        })
        return editTax
    }
    return <>
        {(loader != true && motifs != null && tarifs != null && currentFiscalYear != null && informations != null) ?
            <TaxeForm type="edit" data={entreprise} motifs={motifs} tarifs={tarifs} currentFiscalYear={currentFiscalYear} informations={informations} onFormSubmit={handleEditTax} /> :
            <CustomLoader />}
    </>
}