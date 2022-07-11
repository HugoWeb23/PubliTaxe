import ReactPDF, { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from "../../../Types/IEntreprise";
import mouscron from '../../../Images/mouscron.jpg'
import { IPrintData } from '../../../Types/IPrintData';
import { IMotif_majoration } from '../../../Types/IMotif_majoration';

interface IMinutesPrinter {
    entreprise: Entreprise,
    printData: IPrintData,
    motifsMajoration?: IMotif_majoration[]
}

export const MinutesPrinter = ({ entreprise, printData, motifsMajoration }: IMinutesPrinter) => {
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

    const styles = StyleSheet.create({
        Page: {
            padding: '8mm'
        },
        Header: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'row'
        },
        HeaderImages: {
            width: '140px',
            height: '100px'
        },
        HeaderTitleSection: {
            marginLeft: '5mm'
        },
        MainTitle: {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '18px',
        },
        Subtitle: {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        HeaderLine: {
            width: '100%',
            height: '2mm',
            borderBottom: '1px solid black',
            marginTop: '5mm'
        },
        NormalText: {
            fontSize: '10px',
            fontFamily: 'Arial'
        },
        AlignTextCenter: {
            justifyContent: 'center',
            flexDirection: 'row'
        }
    })

    const MotifMajoration = (): any => {
        if(motifsMajoration != undefined) {
            const libelle = motifsMajoration.find((motif: IMotif_majoration) => entreprise.motif_majorationId == motif.id_motif)?.libelle
            if(libelle !== undefined) {
                return <Text style={[styles.NormalText, {marginTop: '4mm', textDecoration: 'underline'}]}>{libelle}</Text>
            } else {
                return <Text style={[styles.NormalText, {marginTop: '4mm'}]}>(aucun motif)</Text>
            }
        } else {
            return <Text style={[styles.NormalText, {marginTop: '4mm'}]}>(aucun motif)</Text>
        }
    }

    return <Page style={styles.Page}>
        <View style={styles.Header}>
            <View><Image src={mouscron} style={styles.HeaderImages} /></View>
            <View>
                <View style={styles.AlignTextCenter}>
                <Text style={[styles.MainTitle, { textDecoration: 'underline', marginTop: '2mm' }]}>Ville de Mouscron</Text>
                </View>
                <View style={styles.HeaderTitleSection}>
                <Text style={[styles.Subtitle, { marginTop: '5mm' }]}>Arrondissement de Mouscron - Province de Hainaut</Text>
                <Text style={styles.HeaderLine}></Text>
            </View>
            </View>
        </View>
        <View style={styles.AlignTextCenter}>
            <Text style={[styles.Subtitle, { textTransform: 'uppercase' }]}>Procès verbal n° {entreprise.matricule_ciger}</Text>
        </View>
        <View style={{marginTop: '10mm'}}>
            <Text style={[styles.NormalText]}>Je soussignée, {printData.personne_contact}, fonctionnaire assermentée et spécialement désignée le 30 novembre 2020
                par le Collège Communal pour constater les infractions visées à l'article 6, Alinéa 1er de la Loi du 24 décembre 1996 relative à
                l'établissement et au recouvrement des taxes provinciales et communales, avons constaté que : <Text style={[styles.NormalText, {fontWeight: 'bold'}]}>{entreprise.nom}</Text></Text>
            <Text style={[styles.NormalText, {marginTop: '2mm'}]}>domicilié à <Text style={[styles.NormalText, {fontWeight: 'bold'}]}>{entreprise.adresse_rue}, {entreprise.adresse_numero} - {entreprise.code_postal.cp} {entreprise.code_postal.localite} - {entreprise.code_postal.pays.nom_pays}</Text></Text>
        <Text style={[styles.NormalText, { textDecoration: 'underline', fontWeight: 'bold', marginTop: '10mm', marginBottom: '6mm' }]}>Nature de l'infraction</Text>
        <Text style={[styles.NormalText]}>1. N'a pas rentré la formule de déclaration relative à la taxe communale sur les panneaux d'affichage et/ou enseignes, pour un ou des panneaux et/ou enseignes situés : </Text>
        <View style={{marginTop: '4mm'}}>
        <Text style={[styles.NormalText, {fontWeight: 'bold', marginLeft: '9mm'}]}>VOIR DETAIL EN ANNEXE</Text>
        </View>
        <Text style={[styles.NormalText, {marginTop: '6mm'}]}>2. a rentré à l'Administration Communale de Mouscron une formule de déclaration relative à la taxe communale sur les panneaux d'affichage et/ou enseignes, pour un ou des panneaux et/ou enseignes situés :</Text>
        <View style={{marginTop: '4mm'}}>
        <Text style={[styles.NormalText, {textDecoration: 'underline'}]}>{entreprise.adresse_taxation === "Dans l'arondissement de Mouscron" ? entreprise.adresse_taxation : `${entreprise.adresse_taxation}, ${entreprise.adresse_numero_taxation} - ${entreprise.adresse_code_postal_taxation} ${entreprise.adresse_localite_taxation}`}</Text>
        </View>
        <Text style={[styles.NormalText, {marginTop: '6mm'}]}>Ladite formule de déclaration est incomplète , incorrecte ou imprécise pour les motifs suivants :</Text>
        {MotifMajoration()}
        <Text style={[styles.NormalText, { textDecoration: 'underline', fontWeight: 'bold', marginTop: '10mm', marginBottom: '6mm' }]}>Éléments de taxation</Text>
        <Text style={[styles.NormalText, {fontWeight: 'bold', marginLeft: '9mm'}]}>VOIR DETAIL EN ANNEXE</Text>
        <Text style={[styles.NormalText, { textDecoration: 'underline', fontWeight: 'bold', marginTop: '10mm', marginBottom: '6mm' }]}>Calcul et montant de la taxe</Text>
        <Text style={[styles.NormalText, {fontWeight: 'bold', marginLeft: '9mm'}]}>VOIR DETAIL EN ANNEXE</Text>
        <Text style={[styles.NormalText, {marginTop: '10mm'}]}>En foi de quoi, le présent procès-verbal a été dressé aux fins de procéder à l'enrôlement d'office, en application des articles 6 et 8 de la Loi du 24 décembre 1996 relative à l'établissement et au recouvrement des taxes
        provinciales et communales et des articles 5, 6 et 7 du règlement de la taxe communale sur les panneaux
        d'affichage et/ou enseignes.</Text>
        <Text style={[styles.NormalText, {marginTop: '10mm'}]}>Dressé à Mouscron, le {printData.date_impression}</Text>
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
        <Text style={[styles.NormalText, {marginTop: '10mm'}]}>Signature</Text>
        </View>
    </View>
    </Page>
}