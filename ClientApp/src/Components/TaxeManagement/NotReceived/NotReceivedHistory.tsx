import {useEffect, useState} from 'react'
import { apiFetch } from '../../../Services/apiFetch'
import {
    Table
} from 'react-bootstrap'
import { INotReceivedHistory } from '../../../Types/INotReceivedHistory'
import { IMotif_majoration } from '../../../Types/IMotif_majoration'
import { Loader } from '../../UI/Loader'

interface INotReceivedHistoryComponent {
    matricule: number,
    motifs: IMotif_majoration[]
}

export const NotReceivedHistory = ({matricule, motifs}: INotReceivedHistoryComponent) => {
    const [history, setHistory] = useState<INotReceivedHistory[]>([])
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
                const history = await apiFetch(`/notreceived/gethistory/${matricule}`)
                setHistory(history)
                setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    if(loader) {
        return <Loader/>
    }

    return <Table striped bordered hover size="sm">
        <thead>
        <tr>
            <th>Exercice</th>
            <th>Motif</th>
            <th>Remarque</th>
            <th>Date</th>
        </tr>
        </thead>
        <tbody>
            {(loader === false && history.length === 0) && <td colSpan={4}>Aucun résultat</td>}
            {loader === false && history.map((history: INotReceivedHistory, index: number) => {
                return <tr key={index}>
                    <td>{history.exercice}</td>
                    <td>{motifs.find((motif: IMotif_majoration) => motif.id_motif == history.motif_majorationId)?.libelle}</td>
                    <td>{history.remarque}</td>
                    <td>{history.date}</td>
                </tr>
            })}
        </tbody>
    </Table>
}
