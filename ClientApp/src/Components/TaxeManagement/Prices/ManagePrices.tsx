import { useEffect, useMemo, useState } from "react"
import { usePrices } from "../../Hooks/PricesHook"
import {
    Container,
    Table,
    Button,
    Badge,
    Alert
} from 'react-bootstrap'
import { PlusIcon } from "../../UI/PlusIcon"
import { Pencil } from "../../UI/Pencil"
import { toast } from 'react-toastify';
import { IPrice } from "../../../Types/IPrice"
import { PriceModal } from "./PriceModal"
import { IExercice } from "../../../Types/IExercice"
import { ApiErrors, apiFetch } from "../../../Services/apiFetch"
import { Link } from "react-router-dom"

interface IManagePrices {
    currentFiscalYear: IExercice,
    handleEdit: (price: IPrice) => void,
    handleCreate: (price: IPrice) => void
}

export const ManagePrices = ({ currentFiscalYear, handleEdit, handleCreate }: IManagePrices) => {
    const { prices, getAll, editPrice, newPrice } = usePrices()
    const [selectedPrice, setSelectedPrice] = useState<{ price: IPrice, show: boolean, type: string }>({ price: {} as IPrice, show: false, type: 'create' })
    const [fiscalYears, setFiscalYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })

    useEffect(() => {
        (async () => {
            try {
                await getAll()
                if (fiscalYears.length == 0) {
                    const fiscalYears = await apiFetch('/fiscalyears/all')
                    setFiscalYears(fiscalYears)
                }
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const handleSubmit = async ({ type, data }: any) => {
        try {
            if (type == 'create') {
                const price: IPrice = await newPrice(data)
                setSelectedPrice(elem => ({ ...elem, show: false }))
                handleCreate(price)
                toast.success("Le tarif a été créé")
            } else if (type == 'edit') {
                await editPrice(data)
                setSelectedPrice(elem => ({ ...elem, show: false }))
                handleEdit(data)
                toast.success("Le tarif a été modifié")
            }
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const memoPricesIds: number[] = useMemo(() => {
        const fiscalYearsUsed = prices.map((price: IPrice) => price.exerciceId)
        return fiscalYearsUsed
    }, [prices])

    return <>
        <PriceModal element={selectedPrice} fiscalYears={fiscalYears} fiscalYearsUsed={memoPricesIds} handleClose={() => setSelectedPrice(price => ({ ...price, show: false, type: 'create' }))} onSubmit={handleSubmit} />
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des tarifs</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                <h2 className="mb-0">Gestion des tarifs</h2>
                <div className="link" onClick={() => setSelectedPrice(price => ({ ...price, show: true, type: 'create' }))}><PlusIcon /> Nouveau tarif</div>
            </div>
            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <Table striped bordered hover size="sm" style={{ verticalAlign: "middle", textAlign: "center" }}>
                <thead>
                    <tr>
                        <th>Exercice</th>
                        <th>Prix</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loader && <tr><td align="left" colSpan={3}>Chargement...</td></tr>}
                    {(loader === false && prices.length === 0) && <tr><td colSpan={3}>Aucun résultat</td></tr>}
                    {loader === false && prices.map((price: IPrice) => {
                        const exercice: any = fiscalYears.find((y: IExercice) => price.exerciceId === y.id)
                        return <tr key={price.id}>
                            <td>{fiscalYears.find((fisc: IExercice) => fisc.id == price.exerciceId)?.annee_exercice}</td>
                            <td>
                                <div className="d-flex justify-content-around">
                                    <div>
                                        <div className="d-flex justify-content-between flex-row">
                                            <div className="me-5">P.U. enseigne non lumineuse</div>
                                            <div><Badge bg="secondary">{price.prix_unitaire_enseigne_non_lumineuse} €</Badge> </div>
                                        </div>
                                        <div className="d-flex justify-content-between flex-row">
                                            <div className="me-5">P.U. enseigne lumineuse</div>
                                            <div><Badge bg="secondary">{price.prix_unitaire_enseigne_lumineuse} €</Badge></div>
                                        </div>
                                        <div className="d-flex justify-content-between flex-row">
                                            <div className="me-5">P.U. enseigne clignotante</div>
                                            <div><Badge bg="secondary">{price.prix_unitaire_enseigne_clignotante} €</Badge></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between flex-row">
                                            <div className="me-5">P.U. panneau non lumineux</div>
                                            <div><Badge bg="secondary">{price.prix_unitaire_panneau_non_lumineux} €</Badge></div>
                                        </div>
                                        <div className="d-flex justify-content-between flex-row">
                                            <div className="me-5">P.U. panneau lumineux</div>
                                            <div><Badge bg="secondary">{price.prix_unitaire_panneau_lumineux} €</Badge></div>
                                        </div>
                                        <div className="d-flex justify-content-between flex-row">
                                            <div className="me-5">P.U. panneau à défilement</div>
                                            <div><Badge bg="secondary">{price.prix_unitaire_panneau_a_defilement} €</Badge></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td><Button size="sm" disabled={exercice?.annee_exercice < currentFiscalYear.annee_exercice} onClick={() => setSelectedPrice({ price: price, show: true, type: 'edit' })}><Pencil /> Modifier</Button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}