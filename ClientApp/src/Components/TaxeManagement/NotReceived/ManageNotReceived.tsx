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
import { ElementsPerPage } from '../../../Services/ElementsPerPage'
import { Paginate } from '../../../Services/Paginate'
import { Loader as SmallLoader } from 'react-bootstrap-typeahead'

interface IManageNotReceived {
    motifs: IMotif_majoration[],
    currentFiscalYear: IExercice
}

interface IFilterOptions {
    fiscalYear: number,
    elementsParPage: number,
    pageCourante: number
}

export const ManageNotReceived = ({ motifs, currentFiscalYear }: IManageNotReceived) => {
    const [loader, setLoader] = useState<boolean>(true)
    const [optionsLoader, setOptionsLoader] = useState<boolean>(false)
    const [selectedEntreprise, setSelectedEntreprise] = useState<{ entrepriseInfos: IApercu_entreprise, show: boolean }>({ entrepriseInfos: {} as IApercu_entreprise, show: false })
    const [filterOptions, setFilterOptions] = useState<IFilterOptions>({ fiscalYear: currentFiscalYear.id, elementsParPage: 15, pageCourante: 1 })
    const { notReceivedList, totalPages, pageCourante, elementsParPage, getAll, Insert } = useNotReceived()
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const currentDate = new Date().getTime()
    const expirationDate = new Date(currentFiscalYear.date_echeance).getTime()

    useEffect(() => {
        (async () => {
            try {
                setOptionsLoader(true)
                await getAll(filterOptions)
                setOptionsLoader(false)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [filterOptions])

    const EncodeNotReceived = async (data: INotReceived) => {
        try {
            data.exerciceId = currentFiscalYear.id
            await Insert(data)
            setSelectedEntreprise(ent => ({ ...ent, show: false }))
            toast.success('Opération effectuée avec succès')
        } catch (e) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }

    }

    if (loader === true || motifs === null || currentFiscalYear === null) {
        return <Loader />
    }
    return <>
        <NotReceivedModal element={selectedEntreprise} motifs={motifs} currentFiscalYear={currentFiscalYear} handleClose={() => setSelectedEntreprise({ entrepriseInfos: {} as IApercu_entreprise, show: false })} onSubmit={EncodeNotReceived} />
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Encodage des non reçus</li>
                </ol>
            </nav>
            <h2 className="mt-2 mb-3">Encodage des déclarations non reçues <span className="fw-bold">(exercice {currentFiscalYear.annee_exercice})</span></h2>
            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            {(errorModal.show === false && currentDate < expirationDate) && <Alert variant="warning">Attention, la date d'échéance de l'exercice {currentFiscalYear.annee_exercice} n'a pas encore été dépassée (<span className="fw-bold">{new Date(currentFiscalYear.date_echeance).toLocaleDateString('fr-FR')}</span>).</Alert>}
            {(errorModal.show === false && currentDate >= expirationDate) && <div className="mt-3 mb-3"><span className="fw-bold">Date limite pour la remise de la déclaration : </span>{new Date(currentFiscalYear.date_echeance).toLocaleDateString('fr-FR')}</div>}
            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Matricule</th>
                        <th>Nom entreprise</th>
                        <th>Panneaux</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notReceivedList.length === 0 && <tr><td colSpan={5}>Aucun résultat</td></tr>}
                    {notReceivedList.map((notreceived: any, index: number) => <NotReceived element={notreceived} handleSelect={(element: IApercu_entreprise) => setSelectedEntreprise({ entrepriseInfos: element, show: true })} />)}
                </tbody>
            </Table>
            {notReceivedList.length > 0 && <div className="d-flex justify-content-end align-items-center">
                {optionsLoader && <div className="me-2"><SmallLoader /></div>}
                <div className="me-2">
                    <ElementsPerPage
                        elementsPerPage={elementsParPage}
                        onChange={(elements) => setFilterOptions((filters: any) => ({ ...filters, elementsParPage: elements }))}
                    />
                </div>
                <Paginate
                    totalPages={totalPages}
                    pageCourante={pageCourante}
                    pageChange={(page) => setFilterOptions((filters: any) => ({ ...filters, pageCourante: page }))}
                />
            </div>}
        </Container>
    </>
}

interface NotReceived {
    element: IApercu_entreprise,
    handleSelect: (entreprise: IApercu_entreprise) => void
}

const NotReceived = memo(({ element, handleSelect }: NotReceived) => {
    return <>
        <tr key={element.id_entreprise}>
            <td>{element.id_entreprise}</td>
            <td>{element.matricule_ciger}</td>
            <td>{element.nom}</td>
            <td>{element.nombre_panneaux}</td>
            <td><Button variant="danger" size="sm" className="d-flex align-items-center" onClick={() => handleSelect(element)}><ExclamationIcon /> Encoder un non reçu</Button></td>
        </tr>
    </>
})