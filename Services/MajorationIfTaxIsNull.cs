namespace Taxes.Services
{
    public class MajorationIfTaxIsNull
    {
        public static int Calculate(int pourcentage)
        {
            if (pourcentage == 10)
            {
                return 5;
            }
            else if (pourcentage == 50)
            {
                return 10;
            }
            else if (pourcentage == 100)
            {
                return 20;
            }
            else if (pourcentage == 200)
            {
                return 40;
            }
            else
            {
                return 5;
            }
        }
    }
}
