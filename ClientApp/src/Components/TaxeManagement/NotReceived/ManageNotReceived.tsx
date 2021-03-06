import { useEffect, useState, memo } from 'react'
import {
    Table,
    Container,
    Button,
    Alert
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
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
import { ApiErrors } from '../../../Services/apiFetch'

interface IManageNotReceived {
    motifs: IMotif_majoration[],
    currentFiscalYear: IExercice
}

export const ManageNotReceived = ({ motifs, currentFiscalYear }: IManageNotReceived) => {
    const [loader, setLoader] = useState<boolean>(true)
    const [selectedEntreprise, setSelectedEntreprise] = useState<{ entrepriseInfos: IApercu_entreprise, show: boolean }>({ entrepriseInfos: {} as IApercu_entreprise, show: false })
    const { notReceivedList, getAll, Insert } = useNotReceived()
    const [errorModal, setErrorModal] = useState<{show: boolean, message: string}>({show: false, message: ""})
    const currentDate = new Date().getTime()
    const expirationDate = new Date(currentFiscalYear.date_echeance).getTime()

    useEffect(() => {
        (async () => {
            try {
                await getAll(currentFiscalYear.id)
            } catch(e: any) {
                if(e instanceof ApiErrors) {
                    setErrorModal({show: true, message: e.singleError.error})
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const EncodeNotReceived = async (data: INotReceived) => {
        try {
            data.exerciceId = currentFiscalYear.id
            await Insert(data)
            setSelectedEntreprise(ent => ({ ...ent, show: false }))
            toast.success('Op??ration effectu??e avec succ??s')
        } catch (e) {
            if(e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }

    }

    if (loader === true || motifs === null || currentFiscalYear === null) {
        return <Loader />
    }
    return <>
        <NotReceivedModal element={selectedEntreprise} motifs={motifs} currentFiscalYear={currentFiscalYear} handleClose={() => setSelectedEntreprise(el => ({ ...el, show: false }))} onSubmit={EncodeNotReceived} />
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Encodage des non re??us</li>
                </ol>
            </nav>
            <h2 className="mt-2 mb-3">Encodage des d??clarations non re??ues (exercice {currentFiscalYear.annee_exercice})</h2>
            <hr className="my-3"/>
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            {(errorModal.show === false && currentDate < expirationDate)  && <Alert variant="warning">Attention, la date d'??ch??ance de l'exercice {currentFiscalYear.annee_exercice} n'a pas encore ??t?? d??pass??e (<span className="fw-bold">{new Date(currentFiscalYear.date_echeance).toLocaleDateString('fr-FR')}</span>).</Alert>}
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
                    {notReceivedList.length === 0 && <tr><td colSpan={4}>Aucun r??sultat</td></tr>}
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
            <td><Button variant="danger" size="sm" className="d-flex align-items-center" onClick={() => handleSelect(element)}><ExclamationIcon /> Encoder un non re??u</Button></td>
        </tr>
    </>
})