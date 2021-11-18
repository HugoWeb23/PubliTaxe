import { apiFetch } from "../../Services/apiFetch"
import { TaxeForm } from "./TaxeForm"

export const CreateTax = () => {
    const handleCreate = async(data: any) => {
       data.matricule_ciger = Number.parseInt(data.matricule_ciger)
       data.code_postalId = data.code_postal.code_postalid
       delete data.code_postal
       const newentreprise = await apiFetch('/entreprises/new', {
           method: 'POST',
           body: JSON.stringify(data)
       })
    }
    return <TaxeForm type="create" onFormSubmit={handleCreate}/>
}