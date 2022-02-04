import { apiFetch } from "../../../Services/apiFetch"
import { Loader } from "../../UI/Loader"
import { SimulationForm } from "./SimulationForm"

export const CreateSimulation = ({ tarifs, currentFiscalYear }: any) => {
    const handleCreate = async (data: any) => {
        /*
        data.matricule_ciger = Number.parseInt(data.matricule_ciger)
        delete data.code_postal
        const newentreprise = await apiFetch('/entreprises/new', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        return newentreprise
        */
       console.log(data)
    }
    return <>
        {(tarifs != null && currentFiscalYear != null) ? <SimulationForm
            type="create"
            tarifs={tarifs}
            currentFiscalYear={currentFiscalYear}
            onFormSubmit={handleCreate}
        /> : <Loader />}
    </>
}