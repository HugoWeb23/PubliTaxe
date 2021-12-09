import { useEffect, useState } from "react"
import { useFicalYears } from "../../Hooks/FiscalYearsHook"
import {
    Container,
    Table,
    Button
} from 'react-bootstrap'
import { IExercice } from "../../../Types/IExercice"
import { PlusIcon } from "../../UI/PlusIcon"
import { Pencil } from "../../UI/Pencil"
import { FiscalYearModal } from "./FiscalYearModal"

export const ManageFiscalYears = () => {
    const { fiscalYears, getAll } = useFicalYears()
    const [loader, setLoader] = useState<boolean>(true)
    const [fiscalModal, setFiscalModal] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            await getAll()
            setLoader(false)
        })()
    }, [])

    const handleSubmit = (data: any) => {
        console.log(data)
    }

    return <>
        <FiscalYearModal type="create" show={fiscalModal} onSubmit={handleSubmit} handleClose={() => setFiscalModal(false)}/>
        <Container fluid="sm">
            <div className="d-flex justify-content-between align-items-center">
            <h2 className="mt-2 mb-3">Gestion des exercices </h2>
            <div className="link" onClick={() => setFiscalModal(true)}><PlusIcon/> Nouvel exercice</div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Exercice</th>
                        <th>Date d'échéance</th>
                        <th>Date limite de règlement</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loader == false && fiscalYears.map((year: IExercice, index: number) => {
                        return <tr>
                            <td>{year.annee_exercice}</td>
                            <td>{year.date_echeance}</td>
                            <td>{year.date_reglement_taxe}</td>
                            <td><Button size="sm"><Pencil/></Button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}