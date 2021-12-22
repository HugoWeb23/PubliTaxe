using System;

namespace Taxes.Services
{
    public class RandomPassword
    {
        public static string GenerateRandomPassword()
        {
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var chain = new char[8];
            var random = new Random();

            for (int i = 0; i < chain.Length; i++)
            {
                chain[i] = characters[random.Next(characters.Length)];
            }

            return new String(chain);
        }
    }
}
