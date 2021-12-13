import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from "../../../Types/IEntreprise";
import mouscron from '../../../Images/mouscron.jpg'
import { IPrintData } from '../../../Types/IPrintData';

interface IMinutesPrinter {
    entreprise: Entreprise,
    printData: IPrintData
}

export const MinutesPrinter = ({entreprise, printData}: IMinutesPrinter) => {
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
            fontSize: '13px',
        },
        HeaderLine: {
            width: '200px',
            height: '2mm',
            borderBottom: '1px solid black'
        }
    })

    return <Page style={styles.Page}>
         <View style={styles.Header}>
            <View><Image src={mouscron} style={styles.HeaderImages} /></View>
            <View style={styles.HeaderTitleSection}>
                <Text style={[styles.MainTitle, { textDecoration: 'underline', marginTop: '2mm' }]}>Ville de Mouscron</Text>
                <Text style={[styles.MainTitle, { marginTop: '2mm' }]}>Arrondissement de Mouscron - Province de Hainaut</Text>
                <Text style={styles.HeaderLine}></Text>
            </View>
        </View>
        <View>
            <Text style={{textTransform: 'uppercase'}}>Procès verbal {entreprise.matricule_ciger}</Text>
        </View>
        <View>
            <Text>Je soussignée, {printData.personne_contact}, fonctionnaire assermentée et spécialement désignée le 30 novembre 2020
            par le Collège Communal pour constater les infractions visées à l'article 6, Alinéa 1 de la Loi du 24 décembre 1996 relative à
             l'établissement et au recouvrement des taxes provinciales et communales, avons constaté que : {entreprise.nom}</Text>
             <Text>domicilié à {entreprise.adresse_rue}, {entreprise.adresse_numero} - {entreprise.code_postal.cp} {entreprise.code_postal.localite}</Text>
        </View>
        <View>
            <Text style={{textDecoration: 'underline', fontWeight: 'bold'}}>Nature de l'infraction</Text>
            <Text>1. N'a pas rentré la formule de déclaration relative à la taxe communale sur les panneaux d'affichage et/ou enseignes, pour un
                ou des panneaux et/ou enseignes situés :
            
            {entreprise.adresse_taxation === "Dans l'arondissement de Mouscron" ? <Text>{entreprise.adresse_taxation}</Text> : <Text>{entreprise.adresse_taxation}, {entreprise.adresse_numero_taxation} - {entreprise.adresse_code_postal_taxation} {entreprise.adresse_localite_taxation}</Text>}
            </Text>
        </View>
    </Page>
}