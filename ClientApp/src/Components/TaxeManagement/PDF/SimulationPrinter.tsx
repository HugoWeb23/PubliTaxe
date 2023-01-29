import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPublicite } from '../../../Types/IPublicite';
import mouscron from '../../../Images/mouscron.jpg'
import wapi from '../../../Images/wapi.jpg'
import { GetPricesByYear, SumTax } from '../../../Services/SumTax';
import { useEffect, useMemo } from 'react';
import { IPrintData } from '../../../Types/IPrintData';
import { IExercice } from '../../../Types/IExercice';
import { ISimulation } from '../../../Types/ISimulation';
import { IPubliciteSimulation } from '../../../Types/IPubliciteSimulation';
import { IPrice } from '../../../Types/IPrice';

interface ISimulationPrinter {
    simulation: ISimulation,
    allFiscalYears: IExercice[],
    tarifs: IPrice[]
}

export const SimulationPrinter = ({ simulation, allFiscalYears, tarifs }: ISimulationPrinter) => {

    Font.register({
        family: 'Tahoma', fonts: [
            {
                src: '/Fonts/Tahoma.ttf'
            },
            {
                src: '/Fonts/TahomaBold.ttf',
                fontWeight: 'bold'
            }
        ]
    });

    const styles = StyleSheet.create({
        Page: {
            padding: '5mm'
        },
        Header: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
        },
        MouscronImage: {
            width: '140px',
            height: '90px'
        },
        WapiImage: {
            width: '90px',
            height: '90px'
        },
        HeaderText: {
            fontSize: '15px',
            fontFamily: 'Tahoma'
        },
        HeaderSubText: {
            fontSize: '11px',
            fontFamily: 'Tahoma'
        },
        SubHeader: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: '3mm'
        },
        NormalText: {
            fontSize: '10px',
            fontFamily: 'Tahoma'
        },
        BusinessInformations: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: '3mm',
            border: '0.5px solid #000',
            padding: '2mm',
            marginBottom: '3mm'
        },
        PubsTable: {
            border: '0.5px solid #000'
        },
        Row: {
            flexDirection: 'row',
            justifyContent: 'center',
            textAlign: 'center'
        },
        Col: {
            flex: 1,
            fontSize: '10px',
            fontFamily: 'Tahoma',
            borderRight: '0.5px solid #000',
            borderBottom: '0.5px solid #000',
            paddingTop: '1.5mm',
            paddingBottom: '1.5mm'
        },
        ColLG: {
            flex: 2,
            fontSize: '10px',
            fontFamily: 'Tahoma',
            borderRight: '0.5px solid #000',
            borderBottom: '0.5px solid #000',
            paddingTop: '1.5mm',
            paddingBottom: '1.5mm'
        },
        ColXL: {
            flex: 4,
            fontSize: '10px',
            fontFamily: 'Tahoma',
            borderRight: '0.5px solid #000',
            borderBottom: '0.5px solid #000',
            paddingTop: '1.5mm',
            paddingBottom: '1.5mm'
        },
        Prices: {
            padding: '1mm',
            border: '0.5px solid #000'
        },
        PriceDetail: {
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        TypeDetail: {
            justifyContent: 'flex-start',
            flexDirection: 'row'
        },
        TotalTax: {
            justifyContent: 'flex-end',
            flexDirection: 'row',
            fontSize: '12px',
            fontFamily: 'Tahoma',
            borderRight: '0.5px solid #000',
            borderBottom: '0.5px solid #000',
            borderLeft: '0.5px solid #000',
            padding: '1mm'
        },
        RowPrice: {
            flexDirection: 'row',
            justifyContent: 'center',
            textAlign: 'left'
        },
        ColPricesHead: {
            flex: 1,
            fontSize: '10px',
            fontFamily: 'Tahoma',
            paddingTop: '1.8mm',
            paddingBottom: '1.5mm',
            fontWeight: 'bold'
        },
        ColPricesBody: {
            flex: 1,
            fontSize: '10px',
            fontFamily: 'Tahoma',
            paddingTop: '1.5mm',
        },
        Exercice: {
            fontSize: '10px',
            fontFamily: 'Tahoma',
            padding: '2px',
            border: '0.5px solid #000'
        },
        ExerciceTotalTax: {
            fontSize: '10px',
            fontFamily: 'Tahoma',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        }
    });

    return <Document>
        <Page size="A4" orientation="landscape" style={styles.Page}>
            <View fixed>
                <View style={styles.Header}>
                    <View><Image src={mouscron} style={styles.MouscronImage} /></View>
                    <View>
                        <Text style={styles.HeaderText}>Simulation de tarification</Text>
                        <Text style={styles.HeaderSubText}>
                            Exercice{simulation.exercices.length > 1 && 's'}
                            {simulation.exercices.map((e: number, index: number) => {
                                const exercice = allFiscalYears.find((fisc: IExercice) => fisc.id == e)?.annee_exercice
                                return `${index === 0 ? ' ' : ''}${exercice}${index + 1 < simulation.exercices.length ? ', ' : ''}`
                            })}
                        </Text>
                    </View>
                    <View><Image src={wapi} style={styles.WapiImage} /></View>
                </View>
                <View style={styles.SubHeader}>
                    <Text style={styles.NormalText} render={({ subPageNumber, subPageTotalPages }) => (
                        `Page ${subPageNumber} sur ${subPageTotalPages}`
                    )} fixed />
                </View>
            </View>
            <View style={styles.BusinessInformations}>
                <View>
                    <Text style={styles.NormalText}>Adresse : {simulation.adresse_rue}, n° {simulation.adresse_numero} {simulation.adresse_boite > 0 && `(boite ${simulation.adresse_boite})`}</Text>
                    <Text style={styles.NormalText}>Code postal : {simulation.code_postal.cp}</Text>
                    <Text style={styles.NormalText}>Localité : {simulation.code_postal.localite}</Text>
                    <Text style={styles.NormalText}>Pays : {simulation.code_postal.pays.nom_pays}</Text>
                </View>
                <View>
                    <Text style={styles.NormalText}>Nom : {simulation.nom}</Text>
                    <Text style={styles.NormalText}>TVA : {simulation.numero_tva}</Text>
                    <Text style={styles.NormalText}>Téléphone : {simulation.numero_telephone}</Text>
                    <Text style={styles.NormalText}>Mail : {simulation.mail_contact}</Text>
                </View>
            </View>
            <View style={styles.PubsTable}>
                <View style={styles.Row}>
                    <Text style={styles.Col}>N°</Text>
                    <Text style={styles.Col}>CP</Text>
                    <Text style={styles.Col}>Code rue</Text>
                    <Text style={styles.ColXL}>Rue</Text>
                    <Text style={styles.Col}>N°</Text>
                    <Text style={styles.ColXL}>Situation</Text>
                    <Text style={styles.Col}>Type</Text>
                    <Text style={styles.Col}>Qté.</Text>
                    <Text style={styles.Col}>Face</Text>
                    <Text style={styles.ColLG}>Mesures</Text>
                    <Text style={styles.Col}>Surface unitaire (Dm²)</Text>
                    <Text style={styles.Col}>Surface totale (Dm²)</Text>
                    <Text style={styles.Col}>Exo.</Text>
                </View>
                {simulation.publicites.map((pub: IPubliciteSimulation, index: number) => {
                    let type_publicite_text: string = ""
                    let face_text: string = ""
                    switch (pub.type_publicite) {
                        case 1:
                            type_publicite_text = "ENL"
                            break;
                        case 2:
                            type_publicite_text = "EL"
                            break;
                        case 3:
                            type_publicite_text = "EC"
                            break;
                        case 4:
                            type_publicite_text = "PNL"
                            break;
                        case 5:
                            type_publicite_text = "PL"
                            break;
                        case 6:
                            type_publicite_text = "PD"
                            break;
                        default:
                            type_publicite_text = ""
                            break;
                    }

                    switch (pub.face) {
                        case 1:
                            face_text = "S"
                            break;
                        case 2:
                            face_text = "D"
                            break;
                        case 3:
                            face_text = "T"
                            break;
                        default:
                            face_text = ""
                            break;
                    }
                    return <View style={styles.Row}>
                        <Text style={styles.Col}>{index + 1}</Text>
                        <Text style={styles.Col}>{pub.rue.code_postal.cp}</Text>
                        <Text style={styles.Col}>{pub.rue.code_rue}</Text>
                        <Text style={styles.ColXL}>{pub.rue.nom_rue}</Text>
                        <Text style={styles.Col}>{pub.adresse_numero}</Text>
                        <Text style={styles.ColXL}>{pub.situation}</Text>
                        <Text style={styles.Col}>{type_publicite_text}</Text>
                        <Text style={styles.Col}>{pub.quantite}</Text>
                        <Text style={styles.Col}>{face_text}</Text>
                        <Text style={styles.ColLG}>{pub.mesure}</Text>
                        <Text style={styles.Col}>{pub.surface}</Text>
                        <Text style={styles.Col}>{pub.surface_totale}</Text>
                        <Text style={styles.Col}>{pub.exoneration ? 'Oui' : 'Non'}</Text>
                    </View>
                })}
            </View>
            <View style={{ marginTop: '7px' }}>
                {simulation.exercices.map((e: number) => {
                    const exercice = allFiscalYears.find((fisc: IExercice) => fisc.id == e)?.annee_exercice
                    return <>
                        <Text style={styles.Exercice}>Exercice {exercice}</Text>
                        <View style={styles.RowPrice}>
                            <Text style={styles.ColPricesHead}>N°</Text>
                            <Text style={styles.ColPricesHead}>Taxe</Text>
                            <Text style={styles.ColPricesHead}>Exonération</Text>
                        </View>
                        {simulation.publicites.map((pub: IPubliciteSimulation, index: number) => {
                            return <View style={styles.RowPrice}>
                                <Text style={styles.ColPricesBody}>{index + 1}</Text>
                                <Text style={styles.ColPricesBody}>{SumTax(e, pub.quantite, pub.surface, pub.face, pub.type_publicite, pub.exoneration, tarifs)} €</Text>
                                <Text style={styles.ColPricesBody}>{pub.exoneration ? "Oui" : "Non"}</Text>
                            </View>
                        })}
                        <View style={{ marginTop: '5px', marginBottom: '7px' }}>
                            <Text style={styles.ExerciceTotalTax}>Taxe totale {exercice} : {simulation.publicites.reduce((acc: any, curr: IPubliciteSimulation) => {
                                if (curr.exoneration) {
                                    return acc
                                } else {
                                    const tax: any = SumTax(e, curr.quantite, curr.surface, curr.face, curr.type_publicite, curr.exoneration, tarifs)
                                    return acc + parseFloat(tax)
                                }
                            }, 0)} €</Text>
                        </View>
                    </>
                })}
            </View>
        </Page>
    </Document>
}