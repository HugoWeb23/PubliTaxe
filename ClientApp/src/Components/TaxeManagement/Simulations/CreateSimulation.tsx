import { useEffect, useState } from "react"
import { apiFetch } from "../../../Services/apiFetch"
import { IExercice } from "../../../Types/IExercice"
import { Loader } from "../../UI/Loader"
import { SimulationForm } from "./SimulationForm"

export const CreateSimulation = ({ tarifs, currentFiscalYear }: any) => {

    const [fiscalYears, setFiscalYears] = useState<IExercice[]>([])

    useEffect(() => {
        (async() => {
            try {
                const allFiscalYears = await apiFetch('/fiscalyears/all')
                setFiscalYears(allFiscalYears)
            } catch(e) {
                alert('error')
            }
        })()
    }, [])

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
        {(tarifs != null && currentFiscalYear != null && fiscalYears.length > 0) ? <SimulationForm
            type="create"
            tarifs={tarifs}
            currentFiscalYear={currentFiscalYear}
            allFiscalYears={fiscalYears}
            onFormSubmit={handleCreate}
        /> : <Loader />}
    </>
}