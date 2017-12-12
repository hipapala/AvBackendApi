using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using AvBackend.Helpers;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using AvBackend;

namespace AvBackendApi.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {

        private readonly AvBackendContext _ctx;

        public AuthController(AvBackendContext ctx)
        {
            _ctx = ctx;
        }
        [AllowAnonymous]
        [Authorize]
        [HttpGet]
        public dynamic Get()
        {
            if (User.Identity.IsAuthenticated)
            {
                return new { isAuthenticated = true, email = User.Identity.Name, isAdmin = User.IsInRole("Admin") };
            }
            else
            {
                return new { isAuthenticated = false };
            }
        }

        [Authorize("User")]
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { });
        }

        //[Authorize("Admin")]
        //[HttpGet("admin")]
        //public dynamic Admin()
        //{
        //    return Ok(new { Admin = "AdminBando" });
        //}
        //[AllowAnonymous]
        //[HttpGet("test")]
        //public async Task<IActionResult> Test()
        //{
        //    var claims = new List<Claim>
        //        {
        //            new Claim(ClaimTypes.Name, "Testas"),
        //            new Claim("DomainId", 1.ToString()),
        //            new Claim("UserId", 1.ToString()),
        //            new Claim(ClaimTypes.Role, "User"),
        //            new Claim(ClaimTypes.Role, "Admin")
        //        };


        //    var claimsIdentity = new ClaimsIdentity(
        //        claims,
        //        CookieAuthenticationDefaults.AuthenticationScheme);

        //    await HttpContext.SignInAsync(
        //        CookieAuthenticationDefaults.AuthenticationScheme,
        //        new ClaimsPrincipal(claimsIdentity));

        //    return Ok(new { isAuthenticated = true, email = "test" });
        //}
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]LoginModel value)
        {
            var host = Regex.Replace(Request.Host.Host.ToLower().Trim(), "^www.", "");
            var pswHash = value.Password.GetAvHash();
            var email = value.Email.ToLower().Trim();

            var dbUser = _ctx.Avuser.Where(t => t.Email == email && t.Password == pswHash).FirstOrDefault();
            var dbDomain = _ctx.Avdomain.Where(t => t.Name == host).FirstOrDefault();

            if (dbUser != null && dbDomain != null && (dbUser.Issuperadmin ||
              _ctx.Avuserdomain.Where(t => t.Domainid == dbDomain.Id && t.Userid == dbUser.Id).Any()))
            {
                var isAdmin = dbUser.Issuperadmin || _ctx.Avuserdomain.Where(t => t.Domainid == dbDomain.Id && t.Userid == dbUser.Id && t.Roleid == (byte)AvRoleEnum.Admin).Any();

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, email),
                    new Claim("DomainId", dbDomain.Id.ToString()),
                    new Claim("UserId", dbUser.Id.ToString()),
                    new Claim(ClaimTypes.Role, "User")
                };

                if (isAdmin) claims.Add(new Claim(ClaimTypes.Role, "Admin"));

                var claimsIdentity = new ClaimsIdentity(
                    claims,
                    CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                return Ok(new { isAuthenticated = true, email = email, isAdmin = isAdmin });
            }

            return Ok(new { isAuthenticated = false });
        }
    }

    public class LoginModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
