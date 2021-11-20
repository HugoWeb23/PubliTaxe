import { useEffect, useState } from 'react'
import { apiFetch } from '../../Services/apiFetch'
import { Entreprise } from '../../Types/IEntreprise'
import { Loader } from '../UI/Loader'
import {TaxeForm} from './TaxeForm'

interface EditTax {
    entreprise: Entreprise,
    isLoading: boolean
}

export const EditTax = ({match}: any) => {

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
        if(data.code_postal.localite != entreprise.code_postal.localite) {
            delete data.code_postal
        }
            const editTax = await apiFetch(`/entreprises/edit/${data.matricule_ciger}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
    }
return <>
{loader != true ? <TaxeForm type="edit" data={entreprise} onFormSubmit={handleEditTax}/> : <Loader/> }
</>
}