import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPublicite } from '../../../Types/IPublicite';
import mouscron from '../../../Images/mouscron.jpg'
import wapi from '../../../Images/wapi.jpg'
import { GetPricesByYear } from '../../../Services/SumTax';
import { useEffect, useMemo } from 'react';
import { IPrintData } from '../../../Types/IPrintData';

interface IDeclarationPrinter {
    entreprise: Entreprise,
    printData: IPrintData,
    tarifs: any
}

export const DeclarationPrinter = ({ entreprise, printData, tarifs }: IDeclarationPrinter) => {
    const prices = useMemo(() => GetPricesByYear(tarifs, 2021), [])

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
        HeaderImages: {
            width: '90px',
            height: '90px'
        },
        HeaderText: {
            fontSize: '15px',
            fontFamily: 'Tahoma'
        },
        HeaderSubText: {
            fontSize: '13px',
            fontFamily: 'Tahoma'
        },
        SubHeader: {
            justifyContent: 'space-between',
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
        Remark: {
            padding: '2mm',
            border: '0.5px solid #000',
            height: '15mm',
            marginTop: '3mm'
        },
        Informations: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: '3mm'
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
        }
    });

    return <Page size="A4" orientation="landscape" style={styles.Page}>
                <View fixed>
                <View style={styles.Header}>
                    <View><Image src={mouscron} style={styles.HeaderImages} /></View>
                    <View>
                        <Text style={styles.HeaderText}>Déclaration des taxes communales</Text>
                        <Text style={styles.HeaderSubText}>Exercice 2022 - Situation 2022</Text>
                        <Text style={styles.HeaderSubText}>Taxe panneaux d'affichage et/ ou enseignes</Text>
                    </View>
                    <View><Image src={wapi} style={styles.HeaderImages} /></View>
                </View>
                <View style={styles.SubHeader}>
                    <Text style={styles.NormalText}>Contact : {printData.contact_person}, tél : {printData.phone}</Text>
                    <Text style={styles.NormalText} render={({ subPageNumber, subPageTotalPages }) => (
                        `Page ${subPageNumber} de ${subPageTotalPages}`
                    )} fixed />
                </View>
                </View>
                <View style={styles.BusinessInformations}>
                    <View>
                        <Text style={styles.NormalText}>Matricule Ciger : {entreprise.matricule_ciger}</Text>
                        <Text style={styles.NormalText}>Adresse : {entreprise.adresse_rue}, n° {entreprise.adresse_numero}</Text>
                        <Text style={styles.NormalText}>Code postal : {entreprise.code_postal.cp}</Text>
                        <Text style={styles.NormalText}>Localité : {entreprise.code_postal.localite}</Text>
                        <Text style={styles.NormalText}>Pays : {entreprise.code_postal.pays.nom_pays}</Text>
                    </View>
                    <View>
                        <Text style={styles.NormalText}>Nom : {entreprise.nom}</Text>
                        <Text style={styles.NormalText}>TVA : {entreprise.numero_tva}</Text>
                        <Text style={styles.NormalText}>Telephone : {entreprise.numero_telephone}</Text>
                        <Text style={styles.NormalText}>Fax : {entreprise.numero_fax}</Text>
                        <Text style={styles.NormalText}>Mail : {entreprise.mail_contact}</Text>
                    </View>
                </View>
                <View style={styles.PubsTable}>
                    <View style={styles.Row}>
                        <Text style={styles.Col}>CP</Text>
                        <Text style={styles.Col}>Code rue</Text>
                        <Text style={styles.ColXL}>Rue</Text>
                        <Text style={styles.Col}>N°</Text>
                        <Text style={styles.ColXL}>Situation</Text>
                        <Text style={styles.Col}>(1) Type</Text>
                        <Text style={styles.Col}>Qté.</Text>
                        <Text style={styles.Col}>(2) Face</Text>
                        <Text style={styles.ColLG}>Mesures</Text>
                        <Text style={styles.Col}>Surface unitaire (Dm²)</Text>
                        <Text style={styles.Col}>Surface totale (Dm²)</Text>
                        <Text style={styles.Col}>Exo.</Text>
                        <Text style={styles.Col}>P.U.</Text>
                        <Text style={styles.Col}>Prix</Text>
                    </View>
                    {entreprise.publicites.map((pub: IPublicite) => {
                        return <View style={styles.Row}>
                            <Text style={styles.Col}>{pub.rue.code_postal.cp}</Text>
                            <Text style={styles.Col}>{pub.rue.code_rue}</Text>
                            <Text style={styles.ColXL}>{pub.rue.nom_rue}</Text>
                            <Text style={styles.Col}>{pub.adresse_numero}</Text>
                            <Text style={styles.ColXL}>{pub.situation}</Text>
                            <Text style={styles.Col}>{pub.type_publicite}</Text>
                            <Text style={styles.Col}>{pub.quantite}</Text>
                            <Text style={styles.Col}>{pub.face}</Text>
                            <Text style={styles.ColLG}>{pub.mesure}</Text>
                            <Text style={styles.Col}>{pub.surface}</Text>
                            <Text style={styles.Col}>{pub.surface_totale}</Text>
                            <Text style={styles.Col}>{pub.exoneration ? 'Oui' : 'Non'}</Text>
                            <Text style={styles.Col}>{prices[pub.type_publicite]}</Text>
                            <Text style={styles.Col}>{pub.exoneration ? '0.00' : pub.taxe_totale}</Text>
                        </View>
                    })}
                </View>
                <View style={styles.TotalTax}>
                <Text>Taxe totale : {entreprise.publicites.reduce((acc: any, value: IPublicite) => {
                    if(value.exoneration) {
                        return acc
                    }
                    return acc + value.taxe_totale
                }, 0)} €</Text>
                </View>
                <View wrap={false}>
                <View style={styles.Remark}>
                    <Text style={[styles.NormalText, { fontSize: '10px' }]}>Remarques éventuelles :</Text>
                </View>
                <View style={styles.Informations}>
                    <View style={styles.NormalText}>
                        <Text style={{ fontSize: '13px' }}>A .........................., le ..........................</Text>
                        <Text style={[styles.NormalText, { marginTop: '3mm' }]}>Certifié sincère et véritable</Text>
                        <View style={{ marginTop: '5mm' }}>
                            <Text style={{ fontSize: '9px' }}>(Signature)</Text>
                        </View>
                    </View>
                    <View style={styles.NormalText}>
                        <Text style={{ fontSize: '13px' }}>A RENVOYER</Text>
                        <Text style={{ fontSize: '13px', marginTop: '3mm' }}>Par courrier : rue de Courtrai, 63 - 7700 Mouscron</Text>
                        <Text style={{ fontSize: '13px', marginTop: '3mm' }}>Par mail : {printData.mail}</Text>
                        <Text style={{ fontSize: '13px', marginTop: '6mm' }}>Pour le {printData.deadline} au plus tard.</Text>
                    </View>
                    <View style={styles.Prices}>
                        <View style={styles.PriceDetail}>
                            <Text style={styles.NormalText}>Enseignes non lumineuses (ENL) :</Text>
                            <Text style={styles.NormalText}>{prices[1]} €</Text>
                        </View>
                        <View style={[styles.PriceDetail, { marginTop: '0.5mm' }]}>
                            <Text style={styles.NormalText}>Enseignes lumineuses (EL) :</Text>
                            <Text style={styles.NormalText}>{prices[2]} €</Text>
                        </View>
                        <View style={[styles.PriceDetail, { marginTop: '0.5mm' }]}>
                            <Text style={styles.NormalText}>Enseignes clignotantes (EC) :</Text>
                            <Text style={styles.NormalText}>{prices[3]} €</Text>
                        </View>
                        <View style={[styles.PriceDetail, { marginTop: '0.5mm' }]}>
                            <Text style={styles.NormalText}>Panneaux non lumineux (PNL) :</Text>
                            <Text style={styles.NormalText}>{prices[4]} €</Text>
                        </View>
                        <View style={[styles.PriceDetail, { marginTop: '0.5mm' }]}>
                            <Text style={styles.NormalText}>Panneaux lumineux (PL) :</Text>
                            <Text style={styles.NormalText}>{prices[5]} €</Text>
                        </View>
                        <View style={[styles.PriceDetail, { marginTop: '0.5mm' }]}>
                            <Text style={styles.NormalText}>Panneaux à défilement (PD) : </Text>
                            <Text style={styles.NormalText}>{prices[6]} €</Text>
                        </View>
                        <View style={[styles.TypeDetail, { marginTop: '1mm' }]}>
                            <Text style={[styles.NormalText, { marginRight: '2mm' }]}>(S) Simple face</Text>
                            <Text style={[styles.NormalText, { marginRight: '2mm' }]}>(D) Double face</Text>
                            <Text style={styles.NormalText}>(T) Triple face</Text>
                        </View>
                    </View>
                </View>
                </View>
            </Page>
}