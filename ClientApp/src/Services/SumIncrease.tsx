import { IExercice } from "../Types/IExercice";
import { INotReceived } from "../Types/INotReceived";
import { INotReceivedHistory } from "../Types/INotReceivedHistory";

export const SumIncrease = (NotReceivedList: INotReceivedHistory[], currentFiscalYear: IExercice): Promise<number> => {

    return new Promise((resolve) => {

        const Sum = (percentage: number) => {
            switch (percentage) {
                case 10:
                    return 50
                case 50:
                    return 100
                case 100:
                    return 200
                case 200:
                    return 200
                default:
                    return 10
            }
        }

        const NotReceived: INotReceivedHistory[] = NotReceivedList.slice(0, 5)
        const UnderFourYears = currentFiscalYear.annee_exercice - 4

        const Found = NotReceived.some((current: INotReceivedHistory) => parseInt(current.exercice) >= UnderFourYears)
        if (Found) {
            resolve(Sum(NotReceived[0].pourcentage_majoration))
        } else {
            resolve(10)
        }
    })
}