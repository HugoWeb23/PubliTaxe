import { useEffect, useState } from "react";
import { apiFetch } from "../../../Services/apiFetch";
import { IExercice } from "../../../Types/IExercice";
import { ISimulation } from "../../../Types/ISimulation";
import { Loader } from "../../UI/Loader";
import { SimulationForm } from "./SimulationForm";

export const EditSimulation = ({ match, tarifs, currentFiscalYear }: any) => {

    const [simulation, setSimulation] = useState<ISimulation>({} as ISimulation)
    const [fiscalYears, setFiscalYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            const fetchSimulation = await apiFetch(`/simulations/id/${match.params.id}`)
            const allFiscalYears = await apiFetch('/fiscalyears/all')
            setSimulation(fetchSimulation)
            setFiscalYears(allFiscalYears)
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const handleEdit = async(data: any) => {
        const {code_postal, ...data2} = data
        const edit = await apiFetch(`/simulations/edit`, {
            method: 'PUT',
            body: JSON.stringify(data2)
        })
        return edit
}

    return <>
        {(loader != true && tarifs != null && currentFiscalYear != null) ?
            <SimulationForm
                type="edit"
                data={simulation}
                tarifs={tarifs}
                currentFiscalYear={currentFiscalYear}
                allFiscalYears={fiscalYears}
                onFormSubmit={handleEdit}
            /> : <Loader/>}
    </>
}