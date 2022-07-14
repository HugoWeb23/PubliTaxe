import { useEffect, useState, memo } from 'react'
import {
    Table,
    Container,
    Button,
    Alert
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { ApiErrors } from '../../../../Services/apiFetch'
import { ElementsPerPage } from '../../../../Services/ElementsPerPage'
import { Paginate } from '../../../../Services/Paginate'
import { Loader as SmallLoader } from 'react-bootstrap-typeahead'
import { useNothingToPay } from '../../../Hooks/NothingToPayHook'
import { NothingToPay } from '../../../../Types/NothingToPay'
import { CheckIcon } from '../../../UI/CheckIcon'
import { ConfirmModal } from '../../../UI/ConfirmModal';
import { CustomLoader } from '../../../UI/CustomLoader';

interface IFilterOptions {
    elementsParPage: number,
    pageCourante: number
}

export const ManageNothingToPay = () => {
    const [loader, setLoader] = useState<boolean>(true)
    const [optionsLoader, setOptionsLoader] = useState<boolean>(false)
    const [filterOptions, setFilterOptions] = useState<IFilterOptions>({ elementsParPage: 15, pageCourante: 1 })
    const [confirmModal, setConfirmModal] = useState<boolean>(false)
    const { entreprises, totalPages, pageCourante, elementsParPage, getAll, UpdateAll, UpdateOne } = useNothingToPay()
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })

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

    if (loader === true) {
        return <CustomLoader />
    }

    const HandleUpdateOne = async (id: number) => {
        try {
            await UpdateOne(id)
            toast.success("L'élément a été mis à jour")
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const HandleUpdateAll = async () => {
        try {
            await UpdateAll()
            toast.success("Tous les éléments ont été mis à jour")
            setConfirmModal(false)
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }
    return <>
        <ConfirmModal
            show={confirmModal}
            onClose={() => setConfirmModal(false)}
            onConfirm={() => HandleUpdateAll()}
            bodyText="Voulez-vous vraiment valider toutes les entreprises ?"
            confirmButtonText="Tout valider"
            leaveButtonText="Annuler"
            confirmButtonVariant="success"
        />
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item"><Link to="/payment_management">Gestion des paiements</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des situations</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mt-2 mb-3">Gestion des entreprises qui n'ont rien à payer</h2>
                <Button size="sm" variant="success" onClick={() => setConfirmModal(true)} disabled={entreprises.length === 0}><CheckIcon /> Tout valider</Button>
            </div>

            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
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
                    {entreprises.length === 0 && <tr><td colSpan={5}>Aucun résultat</td></tr>}
                    {entreprises.map((notreceived: any, index: number) => <NotReceived element={notreceived} handleUpdate={(id: number) => HandleUpdateOne(id)} />)}
                </tbody>
            </Table>
            {entreprises.length > 0 && <div className="d-flex justify-content-end align-items-center">
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
    element: NothingToPay,
    handleUpdate: (id: number) => void
}

const NotReceived = memo(({ element, handleUpdate }: NotReceived) => {
    return <>
        <tr key={element.id_entreprise}>
            <td>{element.id_entreprise}</td>
            <td>{element.matricule_ciger}</td>
            <td>{element.nom}</td>
            <td>{element.nombre_panneaux}</td>
            <td><Button size="sm" variant="success" onClick={() => handleUpdate(element.id_entreprise)}><CheckIcon /> Rien à payer</Button></td>
        </tr>
        <tr>
            <td colSpan={5} className="px-3">
                <Table striped bordered size="sm" className="mt-1 mb-3">
                    <tr>
                        <th>N° panneau</th>
                        <th>Exonération</th>
                        <th>Taxe totale</th>
                    </tr>
                    {element.nombre_panneaux == 0 && <tr><td colSpan={3}>Aucun panneau publicitaire</td></tr>}
                    {element.publicites.map((pub: { numero_panneau: number, exoneration: boolean, taxe_totale: number }) => {
                        return <>
                            <tr>
                                <td>{pub.numero_panneau}</td>
                                <td>{pub.exoneration ? "Oui" : "Non"}</td>
                                <td>{pub.taxe_totale} €</td>
                            </tr>
                        </>
                    })}
                </Table>
            </td>
        </tr>
    </>
})