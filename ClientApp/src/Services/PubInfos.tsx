export const PubInfos = (type_pub: number | string, type_face: number | string): {type_pub: string, type_face: string} => {

    switch (type_pub) {
        case 1:
            type_pub = "ENL"
            break;
        case 2:
            type_pub = "EL"
            break;
        case 3:
            type_pub = "EC"
            break;
        case 4:
            type_pub = "PNL"
            break;
        case 5:
            type_pub = "PL"
            break;
        case 6:
            type_pub = "PD"
            break;
        default:
            type_pub = ""
            break;
    }

    switch (type_face) {
        case 1:
            type_face = "S"
            break;
        case 2:
            type_face = "D"
            break;
        case 3:
            type_face = "T"
            break;
        default:
            type_face = ""
            break;
    }

    return {type_pub, type_face}
}