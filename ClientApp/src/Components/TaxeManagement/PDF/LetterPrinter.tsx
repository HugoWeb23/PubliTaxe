import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPrintData } from '../../../Types/IPrintData';
import mouscron from '../../../Images/mouscron.jpg'
import wapi from '../../../Images/wapi.jpg'
import transversal from '../../../Images/transversal.jpg'

interface ILetterPrinter {
    entreprise: Entreprise,
    printData: IPrintData,
    tarifs: any
}

export const LetterPrinter = ({ entreprise, printData, tarifs }: ILetterPrinter) => {
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
            fontSize: '12px'
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
        }
    })
    return <Page style={styles.Page}>
        <View style={styles.Header}>
            <View><Image src={mouscron} style={styles.HeaderImages} /></View>
            <View>
                <Text style={styles.HeaderText}>Administration communale de Mouscron</Text>
            </View>
            <View><Image src={wapi} style={styles.HeaderImages} /></View>
        </View>
        <View style={styles.CityName}>
            <View>
                <Text style={{fontSize: '14px'}}>Administration Communale</Text>
                <Text style={styles.NormalText}>Service de la Recette</Text>
                <Text style={styles.NormalText}>Rue de Courtrai, 63</Text>
                <Text style={styles.NormalText}>B-7700 Mouscron</Text>
                <Text style={styles.NormalText}>Tel.: +32(0)56/ 860.280</Text>
            </View>
            <View style={styles.EntrepriseInfo}>
                <Text style={styles.NormalText}>Matricule : {entreprise.matricule_ciger}</Text>
                <Text style={styles.NormalText}>{entreprise.nom}</Text>
                <Text style={styles.NormalText}>{entreprise.adresse_rue}, {entreprise.adresse_numero}</Text>
                <Text style={styles.NormalText}>{entreprise.code_postal.cp} {entreprise.code_postal.localite}</Text>
            </View>
        </View>
        <View style={styles.TransversalLogo}>
            <View>
                <Image src={transversal} style={styles.TransversalLogoImg}/>
            </View>
            <View style={{marginRight: '40mm'}}>
                <Text style={styles.NormalText}>Mouscron, le {printData.print_date}</Text>
            </View>
        </View>
        <View style={{marginTop: '10mm'}}>
            <Text style={styles.NormalText}>Madame, Monsieur,</Text>
        </View>
        <View style={{marginTop: '10mm'}}>
            <Text style={styles.NormalText}>Concerne : Taxe communale sur les panneaux publicitaires et les enseignes</Text>
        </View>
    </Page>
}