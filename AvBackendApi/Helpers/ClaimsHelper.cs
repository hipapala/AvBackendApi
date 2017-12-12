using System.Security.Claims;

namespace AvBackend.Helpers
{
    public static class ClaimsHelper
    {
        public static int GetUserId(this ClaimsPrincipal principal)
        {
            var claim = principal.FindFirst("UserId");
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        public static int GetDomainId(this ClaimsPrincipal principal)
        {
            var claim = principal.FindFirst("DomainId");
            return claim != null ? int.Parse(claim.Value) : 0;
        }
    }
}