using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AvBackend;
using System.ComponentModel.DataAnnotations;
using AvBackend.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace AvBackendApi.Areas.Admin.Controllers
{
    [Authorize("Admin")]
    [Produces("application/json")]
    [Route("api/Users")]
    public class UsersController : Controller
    {

        private readonly AvBackendContext _ctx;

        public UsersController(AvBackendContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
        public dynamic Get()
        {
            var domainId = User.GetDomainId();
            var users = _ctx.Avuser.Where(t => t.Avuserdomain.Any(tt => tt.Domainid == domainId))
                       .Select(t => new { id = t.Id, email = t.Email, isAdmin = t.Avuserdomain.Any(tt => tt.Domainid == domainId && tt.Roleid == (byte)AvRoleEnum.Admin) }).ToArray();
            return users;
        }

        [HttpPost]
        public dynamic Post([FromBody]UserModel value)
        {
            var domainId = User.GetDomainId();
            if (value.Id > 0)
            {
                var user = _ctx.Avuser.Where(t => t.Id == value.Id && t.Avuserdomain.Any(tt => tt.Domainid == domainId)).SingleOrDefault();
                if (user != null)
                {
                    if (!string.IsNullOrWhiteSpace(value.Password) && !_ctx.Avuserdomain.Any(tt => tt.Domainid != domainId && tt.Userid == value.Id))
                    {
                        user.Password = value.Password.GetAvHash();
                    }
                    if (_ctx.Avuserdomain.Any(t => t.Domainid == domainId && t.Userid == value.Id && t.Roleid == (byte)AvRoleEnum.Admin) != value.IsAdmin)
                    {
                        if (value.IsAdmin)
                        {
                            _ctx.Avuserdomain.Add(new Avuserdomain() { Roleid = (byte)AvRoleEnum.Admin, Userid = value.Id, Domainid = domainId });
                        }
                        else
                        {
                            var roles = _ctx.Avuserdomain.Where(t => t.Domainid == domainId && t.Userid == value.Id && t.Roleid == (byte)AvRoleEnum.Admin).ToArray();
                            _ctx.RemoveRange(roles);
                        }
                    }
                    _ctx.SaveChanges();
                }
            }
            else
            {
                var email = value.Email.ToLower().Trim();
                var user = _ctx.Avuser.Where(t => t.Email == email).SingleOrDefault();
                if (user == null)
                {
                    user = new Avuser() { Email = email, Password = value.Password.GetAvHash() };
                    _ctx.Avuser.Add(user);
                }
                if (!_ctx.Avuserdomain.Any(t => t.Domainid == domainId && t.Userid == user.Id && t.Roleid == (byte)AvRoleEnum.User))
                {
                    _ctx.Avuserdomain.Add(new Avuserdomain() { Roleid = (byte)AvRoleEnum.User, User = user, Domainid = domainId });
                }
                if (value.IsAdmin && !_ctx.Avuserdomain.Any(t => t.Domainid == domainId && t.Userid == user.Id && t.Roleid == (byte)AvRoleEnum.Admin))
                {
                    _ctx.Avuserdomain.Add(new Avuserdomain() { Roleid = (byte)AvRoleEnum.Admin, User = user, Domainid = domainId });
                }
                _ctx.SaveChanges();
            }

            return new { };
        }

        [HttpDelete("{id}")]
        public dynamic Delete(int id)
        {
            var domainId = User.GetDomainId();

            var user = _ctx.Avuser.Where(t => t.Id == id && t.Avuserdomain.Any(tt => tt.Domainid == domainId) && !t.Avuserdomain.Any(tt => tt.Domainid == domainId && tt.Roleid == (byte)AvRoleEnum.Admin)).SingleOrDefault();

            if(user != null)
            {
                _ctx.Remove(user);
                _ctx.SaveChanges();
            }

            return new { };
        }
    }

    public class UserModel
    {
        public int Id { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
    }
}