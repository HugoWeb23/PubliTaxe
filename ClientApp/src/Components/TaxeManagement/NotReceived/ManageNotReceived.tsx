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
import { IMotif_majoration } from '../../../Types/IMotif_majoration'
import { useNotReceived } from '../../Hooks/NotReceivedHook'
import { ExclamationIcon } from '../../UI/ExclamationIcon'
import { Loader } from '../../UI/Loader'
import { NotReceivedModal } from './NotReceivedModal'

interface IManageNotReceived {
    motifs: IMotif_majoration[]
}

export const ManageNotReceived = ({motifs}: IManageNotReceived) => {
    const [loader, setLoader] = useState<boolean>(true)
    const [selectedEntreprise, setSelectedEntreprise] = useState<{entrepriseInfos: IApercu_entreprise, show: boolean}>({entrepriseInfos: {} as IApercu_entreprise, show: false })
    const { notReceivedList, getAll } = useNotReceived()

    useEffect(() => {
        (async () => {
           await getAll()
           setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    if(loader === true || motifs === null) {
        return <Loader/>
    }
    return <>
        <NotReceivedModal element={selectedEntreprise} motifs={motifs} handleClose={() => setSelectedEntreprise(el => ({...el, show: false}))}/>
        <Container fluid={true}>
            <h2 className="mt-2 mb-3">Encodage des déclarations non reçues</h2>
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
                    {notReceivedList.map((notreceived: any, index: number) => <NotReceived element={notreceived} index={index} handleSelect={(element: IApercu_entreprise) => setSelectedEntreprise({entrepriseInfos: element, show: true})} />)}
                </tbody>
            </Table>
        </Container>
    </>
}

interface INotReceived {
    element: IApercu_entreprise,
    index: number,
    handleSelect: (entreprise: IApercu_entreprise) => void
}

const NotReceived = memo(({ element, index, handleSelect }: INotReceived) => {
    return <>
        <tr key={index}>
            <td>{element.matricule_ciger}</td>
            <td>{element.nom}</td>
            <td>{element.nombre_panneaux}</td>
            <td><Button variant="danger" size="sm" className="d-flex align-items-center" onClick={() => handleSelect(element)}><ExclamationIcon/> Encoder un non reçu</Button></td>
        </tr>
    </>
})