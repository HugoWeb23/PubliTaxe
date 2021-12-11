import { useEffect, useMemo, useState } from "react"
import { usePrices } from "../../Hooks/PricesHook"
import {
    Container,
    Table,
    Button,
    Row,
    Col,
    Badge
} from 'react-bootstrap'
import { PlusIcon } from "../../UI/PlusIcon"
import { Pencil } from "../../UI/Pencil"
import { toast } from 'react-toastify';
import { IPrice } from "../../../Types/IPrice"
import { PriceModal } from "./PriceModal"
import { IExercice } from "../../../Types/IExercice"
import { apiFetch } from "../../../Services/apiFetch"

export const ManagePrices = () => {
    const { prices, getAll, editPrice, newPrice } = usePrices()
    const [selectedPrice, setSelectedPrice] = useState<{ price: IPrice, show: boolean, type: string }>({ price: {} as IPrice, show: false, type: 'create' })
    const [fiscalYears, setFiscalYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            await getAll()
            if (fiscalYears.length == 0) {
                const fiscalYears = await apiFetch('/fiscalyears/all')
                setFiscalYears(fiscalYears)
            }
            setLoader(false)
        })()
    }, [])

    const handleSubmit = async ({ type, data }: any) => {
        try {
            if (type == 'create') {
                await newPrice(data)
                setSelectedPrice(elem => ({ ...elem, show: false }))
                toast.success("Le tarif a été créé")
            } else if (type == 'edit') {
                await editPrice(data)
                setSelectedPrice(elem => ({ ...elem, show: false }))
                toast.success("L'exercice a été modifié")
            }
        } catch (e: any) {
            toast.error('Une erreur est survenue')
        }
    }

    const memoPricesIds:  number[] = useMemo(() => {
        const fiscalYearsUsed = prices.map((price: IPrice) => price.exerciceId)
        return fiscalYearsUsed
    }, [prices])

    return <>
        <PriceModal element={selectedPrice} fiscalYears={fiscalYears} fiscalYearsUsed={memoPricesIds} handleClose={() => setSelectedPrice(price => ({ ...price, show: false, type: 'create' }))} onSubmit={handleSubmit} />
        <Container fluid="sm">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mt-2 mb-3">Gestion des tarifs</h2>
                <div className="link" onClick={() => setSelectedPrice(price => ({ ...price, show: true, type: 'create' }))}><PlusIcon /> Nouveau tarif</div>
            </div>
            <Table striped bordered hover style={{verticalAlign: "middle", textAlign: "center"}}>
                <thead>
                    <tr>
                        <th>Exercice</th>
                        <th>Prix</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loader == false && prices.map((price: IPrice, index: number) => {
                        return <tr>
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
                            <td><Button size="sm" onClick={() => setSelectedPrice({ price: price, show: true, type: 'edit' })}><Pencil /></Button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}