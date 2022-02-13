import { useEffect, useRef, memo, useState } from 'react'
import {
    Table,
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { IExercice } from '../../Types/IExercice'
import { IPrice } from '../../Types/IPrice'
import { IPublicite } from '../../Types/IPublicite'
import { ConfirmModal } from '../UI/ConfirmModal'
import { Pencil } from '../UI/Pencil'
import { PlusIcon } from '../UI/PlusIcon'
import { Trash } from '../UI/Trash'
import { AdvertisingModal } from './AdvertisingModal'

interface IManageAdvertising {
    pubs: any[],
    matricule: number,
    tarifs: IPrice[],
    currentFiscalYear: IExercice,
    onSubmit: (publicites: IPublicite[]) => void
}

export const ManageAdvertising = memo(({ pubs = [], matricule, tarifs, currentFiscalYear, onSubmit }: IManageAdvertising) => {
    const isMounted = useRef(false)
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [type, setType] = useState<'edit' | 'create'>('edit')
    const [publicites, setPublicites] = useState<IPublicite[]>(pubs)
    const [publicite, setPublicite] = useState<IPublicite | null>(null)
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, element: IPublicite | null }>({ show: false, element: null })

    useEffect(() => {
        if (isMounted.current == false) {
            isMounted.current = true
        } else if (isMounted.current == true) {
            onSubmit(publicites)
        }
    }, [publicites])

    useEffect(() => {
        if (isMounted.current == false) {
            isMounted.current = true
        } else if (isMounted.current == true) {
            if (pubs.length > 0) {
                const test = [...publicites]
                setPublicites(test.map((pub: IPublicite, index: number) => ({ ...pub, numero_panneau: pubs[index].numero_panneau, photos: pubs[index].photos })))
            } else {
                setPublicites([])
            }
        }

    }, [pubs])

    const handleSelectPub = (pub: IPublicite) => {
        setPublicite(pub)
        setType('edit')
        setShowEdit(true)
    }

    const handleUnSelectPub = () => {
        setPublicite(null)
        setShowEdit(false)
        setType('edit')
    }

    const setCreateMode = () => {
        setPublicite(null)
        setType('create')
        setShowEdit(true)
    }

    const handleSubmit = async (data: any, type: 'create' | 'edit') => {
        if (type == 'edit') {
            setPublicites(publicites => publicites.map((pub: IPublicite) => {
                if(pub.numero_panneau != undefined && pub.numero_panneau == publicite?.numero_panneau) {
                   return data
                } else if(pub.uuid != undefined && pub.uuid == publicite?.uuid) {
                    return data
                } else {
                    return pub
                }
            }))
        } else {
            setPublicites(publicites => [...publicites, data])
        }
    }

    const closeConfirmModal = () => {
        setDeleteModal({ show: false, element: null })
    }

    const deletePub = (pub: IPublicite) => {
        setPublicites(publicites => publicites.filter((publicite: IPublicite) => publicite != pub))
        setDeleteModal({ show: false, element: null })
    }

    return <>
        {((type == 'edit' && publicite != null) || (type == 'create' && publicite == null)) && <AdvertisingModal
            type={type}
            show={showEdit}
            publicite={publicite}
            matricule={matricule}
            tarifs={tarifs}
            currentFiscalYear={currentFiscalYear}
            handleClose={handleUnSelectPub}
            onValidate={handleSubmit}
        />}
        <div className="d-flex justify-content-start align-items-center mb-2 link" onClick={setCreateMode}><PlusIcon /> Créer un panneau</div>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.element}
            onClose={closeConfirmModal}
            onConfirm={deletePub}
            bodyText="Voulez-vous vraiment supprimer ce panneau ?"
        />
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Exercice</th>
                    <th>Code postal</th>
                    <th>Code rue</th>
                    <th>Rue</th>
                    <th>N°</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {publicites.length == 0 && <tr><td colSpan={6}>Aucun panneau</td></tr>}
                {publicites.map((publicite: IPublicite, index: number) => {
                    return <tr key={index}>
                        <td>{currentFiscalYear.annee_exercice}</td>
                        <td>{publicite.rue.code_postal.cp}</td>
                        <td>{publicite.rue.code_rue}</td>
                        <td>{publicite.rue.nom_rue}</td>
                        <td>{publicite.adresse_numero}</td>
                        <td className="d-flex">
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-2`}>
                                        Éditer
                                    </Tooltip>
                                }
                            >
                                <Button size="sm" variant="secondary" className="me-1" onClick={() => handleSelectPub(publicite)}><Pencil /></Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-2`}>
                                        Supprimer
                                    </Tooltip>
                                }
                            >
                                <Button size="sm" variant="danger" onClick={() => setDeleteModal({ show: true, element: publicite })}><Trash /></Button>
                            </OverlayTrigger></td>
                    </tr>
                })}
                <tr><td colSpan={6} className="text-end">Taxe totale (hors majoration) : <span className="fw-bold">{publicites.reduce((acc: any, curr: any) => acc + parseFloat(curr.taxe_totale), 0)} €</span></td></tr>
            </tbody>
        </Table>
    </>
})