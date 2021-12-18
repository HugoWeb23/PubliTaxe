import { useEffect, useState, memo } from 'react'
import {
    Card,
    Row,
    Col,
    Table,
    DropdownButton,
    Dropdown,
    Container,
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { Entreprise } from '../../../Types/IEntreprise'
import { IExercice } from '../../../Types/IExercice'
import { IMotif_majoration } from '../../../Types/IMotif_majoration'
import { INotReceived } from '../../../Types/INotReceived'
import { useNotReceived } from '../../Hooks/NotReceivedHook'
import { ExclamationIcon } from '../../UI/ExclamationIcon'
import { Loader } from '../../UI/Loader'
import { NotReceivedModal } from './NotReceivedModal'
import { toast } from 'react-toastify';

interface IManageNotReceived {
    motifs: IMotif_majoration[],
    currentFiscalYear: IExercice
}

export const ManageNotReceived = ({ motifs, currentFiscalYear }: IManageNotReceived) => {
    const [loader, setLoader] = useState<boolean>(true)
    const [selectedEntreprise, setSelectedEntreprise] = useState<{ entrepriseInfos: IApercu_entreprise, show: boolean }>({ entrepriseInfos: {} as IApercu_entreprise, show: false })
    const { notReceivedList, getAll, Insert } = useNotReceived()

    useEffect(() => {
        (async () => {
            await getAll(currentFiscalYear.id)
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const EncodeNotReceived = async (data: INotReceived) => {
        try {
            data.exerciceId = currentFiscalYear.id
            await Insert(data)
            setSelectedEntreprise(ent => ({...ent, show: false}))
            toast.success('Opération effectuée avec succès')
        } catch (e) {
            toast.error('Une erreur est survenue')
        }

    }

    if (loader === true || motifs === null || currentFiscalYear === null) {
        return <Loader />
    }
    return <>
        <NotReceivedModal element={selectedEntreprise} motifs={motifs} currentFiscalYear={currentFiscalYear} handleClose={() => setSelectedEntreprise(el => ({ ...el, show: false }))} onSubmit={EncodeNotReceived} />
        <Container fluid={true}>
            <h2 className="mt-2 mb-3">Encodage des déclarations non reçues (exercice {currentFiscalYear.annee_exercice})</h2>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom entreprise</th>
                        <th>Panneaux</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notReceivedList.length === 0 && <tr><td colSpan={4}>Aucun résultat</td></tr>}
                    {notReceivedList.map((notreceived: any, index: number) => <NotReceived element={notreceived} index={index} handleSelect={(element: IApercu_entreprise) => setSelectedEntreprise({ entrepriseInfos: element, show: true })} />)}
                </tbody>
            </Table>
        </Container>
    </>
}

interface NotReceived {
    element: IApercu_entreprise,
    index: number,
    handleSelect: (entreprise: IApercu_entreprise) => void
}

const NotReceived = memo(({ element, index, handleSelect }: NotReceived) => {
    return <>
        <tr key={index}>
            <td>{element.matricule_ciger}</td>
            <td>{element.nom}</td>
            <td>{element.nombre_panneaux}</td>
            <td><Button variant="danger" size="sm" className="d-flex align-items-center" onClick={() => handleSelect(element)}><ExclamationIcon /> Encoder un non reçu</Button></td>
        </tr>
    </>
})