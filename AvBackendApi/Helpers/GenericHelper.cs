using System.Security.Claims;
using System.Security.Cryptography;
using System;

namespace AvBackend.Helpers
{
    public static class GenericHelper
    {
        public static string GetAvHash(this string text)
        {
            using(var sha256 = SHA256.Create())  
            {  
                var salt = "IQYWGI1267NIYDDDD";
                var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(text + salt + text + salt));  

                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();  
            }  
        }
    }
}