import { apiFetch } from "../../Services/apiFetch"
import { Loader } from "../UI/Loader"
import { TaxeForm } from "./TaxeForm"

export const CreateTax = ({ motifs, tarifs, currentFiscalYear }: any) => {
    const handleCreate = async (data: any) => {
        data.matricule_ciger = Number.parseInt(data.matricule_ciger)
        delete data.code_postal
        const newentreprise = await apiFetch('/entreprises/new', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        return newentreprise
    }
    return <>
        {(motifs != null && tarifs != null && currentFiscalYear != null) ? <TaxeForm
            type="create"
            motifs={motifs}
            tarifs={tarifs}
            currentFiscalYear={currentFiscalYear}
            onFormSubmit={handleCreate}
        /> : <Loader />}
    </>
}