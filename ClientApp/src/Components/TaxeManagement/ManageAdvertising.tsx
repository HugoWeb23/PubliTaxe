import { useEffect, useRef, useState } from 'react'
import {
    Table,
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { boolean } from 'yup/lib/locale'
import { apiFetch } from '../../Services/apiFetch'
import { IPublicite } from '../../Types/IPublicite'
import { ConfirmModal } from '../UI/ConfirmModal'
import { Eye } from '../UI/Eye'
import { Pencil } from '../UI/Pencil'
import { Trash } from '../UI/Trash'
import { AdvertisingModal } from './AdvertisingModal'

interface IManageAdvertising {
    pubs: IPublicite[],
    matricule: number,
    onSubmit: (publicites: IPublicite[]) => void
}

export const ManageAdvertising = ({ pubs = [], matricule, onSubmit }: IManageAdvertising) => {
    const isMounted = useRef(false)
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [type, setType] = useState<'edit' | 'create'>('edit')
    const [publicites, setPublicites] = useState<IPublicite[]>(pubs)
    const [publicite, setPublicite] = useState<IPublicite | null>(null)
    const [deleteModal, setDeleteModal] = useState<{show: boolean, element: IPublicite | null}>({show: false, element: null})


    useEffect(() => {
        if(isMounted.current == false) {
            isMounted.current = true
        } else if(isMounted.current == true) {
           onSubmit(publicites)
        }
    }, [publicites])

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

    const handleSubmit = async(data: any, type: 'create' | 'edit') => {
        if(type == 'edit') {
            setPublicites(publicites => publicites.map((pub: IPublicite) => publicite?.numero_panneau == pub.numero_panneau ? data : pub))
        } else {
            setPublicites(publicites => [...publicites, data])
        }
    }

    const closeConfirmModal = () => {
        setDeleteModal({show: false, element: null})
    }

    const deletePub = (pub: IPublicite) => {
        setPublicites(publicites => publicites.filter((publicite: IPublicite) => publicite != pub))
        setDeleteModal({show: false, element: null})
    }

    return <>
        {((type == 'edit' && publicite != null) || (type == 'create' && publicite == null)) && <AdvertisingModal type={type} show={showEdit} publicite={publicite} matricule={matricule} handleClose={handleUnSelectPub} onValidate={handleSubmit}/>}
        <div className="d-flex justify-content-start mb-2"><Button variant="primary" onClick={setCreateMode}>Créer un panneau</Button></div>
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
                    <th>N° rue</th>
                    <th>Rue</th>
                    <th>N°</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {publicites.length == 0 && <tr><td colSpan={6}>Aucun panneau</td></tr> }
                {publicites.map((publicite: IPublicite, index: number) => {
                    return <tr key={index}>
                        <td>{publicite.exercice_courant}</td>
                        <td>{publicite.rue.code_postal.cp}</td>
                        <td>{publicite.rue.code_rue}</td>
                        <td>{publicite.rue.nom_rue}</td>
                        <td>{publicite.adresse_numero}</td>
                        <td className="d-flex">
                        <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Consulter
                            </Tooltip>
                        }
                    >
                    <Button size="sm" variant="info" className="me-1"><Eye /></Button>
                    </OverlayTrigger>
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
                    <Button size="sm" variant="danger" onClick={() => setDeleteModal({show: true, element: publicite})}><Trash /></Button>
                    </OverlayTrigger></td>
                    </tr>
                })}
            </tbody>
        </Table>
    </>
}