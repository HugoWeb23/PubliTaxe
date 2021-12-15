import { useMemo } from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPrintData } from '../../../Types/IPrintData';
import mouscron from '../../../Images/mouscron.jpg'
import wapi from '../../../Images/wapi.jpg'
import transversal from '../../../Images/transversal.jpg'
import blancke_signature from '../../../Images/blancke_signature.jpg'
import aubert_signature from '../../../Images/aubert_signature.jpg'
import cachet_ville from '../../../Images/cachet_ville.jpg'
import { GetPricesByYear } from '../../../Services/SumTax';
import { IExercice } from '../../../Types/IExercice';
import { IPublicite } from '../../../Types/IPublicite';

interface ILetterPrinter {
    entreprise: Entreprise,
    printData: IPrintData,
    currentFiscalYear: IExercice
}

export const RegisteredLetter = ({ entreprise, printData, currentFiscalYear }: ILetterPrinter) => {
    Font.register({
        family: 'Arial', fonts: [
            {
                src: '/Fonts/Arial.ttf'
            },
            {
                src: '/Fonts/ArialBold.ttf',
                fontWeight: 'bold'
            }
        ]
    });

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
            padding: '8mm'
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
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        HeaderSubText: {
            fontSize: '13px'
        },
        SubHeader: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: '3mm'
        },
        NormalText: {
            fontSize: '10px',
            fontFamily: 'Arial'
        },
        BoldText: {
            fontFamily: 'Arial',
            fontWeight: 'bold'
        },
        CityName: {
            marginTop: '3mm',
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        EntrepriseInfo: {
            marginLeft: '45mm'
        },
        TransversalLogo: {
            marginTop: '3mm',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        },
        TransversalLogoImg: {
            height: '130px',
            width: '70px'
        },
        SignatureSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '15mm',
            paddingRight: '25mm',
            paddingLeft: '25mm'

        },
        BlanckeSignature: {
            width: '120px',
            height: '70px'
        },
        AubertSignature: {
            width: '120px',
            height: '70px'
        },
        CachetVille: {
            width: '90px',
            height: '90px'
        },
        RegulationNormalText: {
            fontFamily: 'Tahoma',
            fontSize: '10px'
        },
        RegulationBoldText: {
            fontFamily: 'Tahoma',
            fontWeight: 'bold',
            fontSize: '10px'
        },
        TaxPricesContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            maxWidth: '100%'
        },
        TaxPrice: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'row'
        }
    })
    const taxe_totale = entreprise.publicites.reduce((acc: any, value: IPublicite) => {
        if(value.exoneration) {
            return acc
        }
        return acc + value.taxe_totale
    }, 0)

    return <Page style={styles.Page}>
        <View style={styles.Header}>
            <View><Image src={mouscron} style={styles.MouscronImage} /></View>
            <View>
                <Text style={[styles.HeaderText]}>NOTIFICATION AU REDEVABLE DE L'APPLICATION DE
                    LA PROCÉDURE DE TAXATION D'OFFICE</Text>
            </View>
            <View><Image src={wapi} style={styles.WapiImage} /></View>
        </View>
        <View style={styles.CityName}>
            <View style={{ marginTop: '10mm' }}>
                <Text style={styles.NormalText}>Contact : {printData.telephone_contact}</Text>
                <Text style={styles.NormalText}>Notre Réf. : {entreprise.matricule_ciger}</Text>
            </View>
            <View style={styles.EntrepriseInfo}>
                <Text style={[styles.NormalText, { textDecoration: 'underline', marginBottom: '5mm' }]}>Lettre recommandée à la poste : {entreprise.matricule_ciger}</Text>
                <Text style={[styles.NormalText, { marginBottom: '5mm' }]}>Ville de Mouscron, le : {printData.date_impression}</Text>
                <Text style={[styles.NormalText, { fontWeight: 'bold' }]}>{entreprise.matricule_ciger}</Text>
                <Text style={[styles.NormalText, { fontWeight: 'bold' }]}>{entreprise.nom}</Text>
                <Text style={[styles.NormalText, { fontWeight: 'bold' }]}>{entreprise.adresse_rue}, {entreprise.adresse_numero}</Text>
                <Text style={[styles.NormalText, { fontWeight: 'bold' }]}>{entreprise.code_postal.cp} {entreprise.code_postal.localite}</Text>
            </View>
        </View>
        <View style={{ marginTop: '10mm' }}>
            <Text style={styles.NormalText}>Madame, Monsieur,</Text>
        </View>
        <View style={{ marginTop: '10mm' }}>
            <Text style={[styles.NormalText, styles.BoldText]}>Concerne : Taxe sur les panneaux publicitaires et enseignes {currentFiscalYear.annee_exercice} / Notification de taxation d'office</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Conformément au règlement du sur les panneaux publicitaires et enseignes, l'administration communale adresse au contribuable une fomule de déclaration que celui-ci est tenu de renvoyer, dument remplie et signée, avant l'échéance mentionnée sur celle-ci.</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>En outre, conformément à l'article L3321-6 du Code de la démocratie locale et de la décentralisation, lorsque le règlement de taxation prévoit une obligation de déclaration, la non-déclaration dans les délais prévus par ce même règlement ou la déclaration incorrecte, incomplète ou imprécise de la part du redevable entraîne l'enrôlement d'office de la taxe.</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Or, selon procès-verbal dressé le {printData.date_impression} par le fonctionnaire assermenté à cette fin, conformément à l'article L3321-7 du Code de la démocratie locale et de la décentralisation, il s'avère que</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>????????????????</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Le collège communal se voit dès lors dans l'obligation de vous enrôler d'office à la taxe sur les panneaux publicitaires
                et enseignes pour un montant calculé sur la base des éléments suivants: <Text style={{ textDecoration: 'underline' }}>VOIR DETAIL EN ANNEXE</Text>.</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Montant de la taxe {(taxe_totale).toFixed(2)} €</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Le montant dû est majoré de {entreprise.pourcentage_majoration} %, conformément à la délibération du Conseil communal du 24 octobre 2016.</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Soit {(taxe_totale * entreprise.pourcentage_majoration / 100).toFixed(2)} €</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Vous disposez d'un délai de trente jours à compter de la date d'envoi de la présente notification pour faire valoir vos
            observations, par écrit uniquement.</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Nous vous prions de croire, Madame, Monsieur, en nos salutations distinguées.</Text>
        </View>
    </Page>
}