import { useEffect, useState } from "react";
import { apiFetch } from "../../../Services/apiFetch";
import { IExercice } from "../../../Types/IExercice";
import { ISimulation } from "../../../Types/ISimulation";
import { CustomLoader } from "../../UI/CustomLoader";
import { SimulationForm } from "./SimulationForm";

export const EditSimulation = ({ match, tarifs, currentFiscalYear }: any) => {

    const [simulation, setSimulation] = useState<ISimulation>({} as ISimulation)
    const [fiscalYears, setFiscalYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            let fetchSimulation = await apiFetch(`/simulations/id/${match.params.id}`)
            const allFiscalYears = await apiFetch('/fiscalyears/all')
            if(fetchSimulation.exercices.length > 0) {
                // Vérifie si les exercices stockés existent toujours
                fetchSimulation.exercices = fetchSimulation.exercices.split(';').filter((id_exo: number) => allFiscalYears.some((fisc: IExercice) => id_exo == fisc.id))
            } else {
                fetchSimulation.exercices = []
            }
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
            /> : <CustomLoader/>}
    </>
}