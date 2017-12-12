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
using System.Xml.Linq;

namespace AvBackendApi.Areas.Xml.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Xmls")]
    public class XmlsController : Controller
    {

        private readonly AvBackendContext _ctx;

        public XmlsController(AvBackendContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
        public dynamic Get()
        {
            var domainId = User.GetDomainId();
            var items = _ctx.Avxml.Where(t => t.Project.Domainid == domainId)
                       .Select(t => new { id = t.Id, name = t.Name, created = t.Created }).ToArray();
            return items;
        }

        [HttpGet("{id}")]
        public dynamic Get(int id)
        {
            var domainId = User.GetDomainId();
            var item = _ctx.Avxml.Where(t => t.Id == id && t.Project.Domainid == domainId).SingleOrDefault();
            var xml = XDocument.Parse(item.Data);
            var tree = CreateNode(xml.Root);

            return new { id = item.Id, name = item.Name, tree = tree };
        }

        private MyNode CreateNode(XElement el)
        {
            var node = new MyNode()
            {
                name = el.Name.ToString(),
                attributes = el.Attributes().Select(t => new MyAttribute() { name = t.Name.ToString(), value = t.Value }).ToArray(),
                childs = el.Elements().Select(t => CreateNode(t)).ToArray()
            };
            return node;
        }

        [HttpGet("download/{id}")]
        public dynamic Download(int id)
        {
            var domainId = User.GetDomainId();
            var item = _ctx.Avxml.Where(t => t.Id == id && t.Project.Domainid == domainId).SingleOrDefault();

            return File(System.Text.Encoding.UTF8.GetBytes(item.Data), "text/xml", "data.xml");
        }

        [HttpDelete("{id}")]
        public dynamic Delete(int id)
        {
            var domainId = User.GetDomainId();
            var item = _ctx.Avxml.Where(t => t.Id == id && t.Project.Domainid == domainId).SingleOrDefault();
            _ctx.Avxml.Remove(item);
            _ctx.SaveChanges();

            return new { };
        }

        [HttpPost]
        public dynamic Post([FromBody]XmlModel value)
        {
            var domainId = User.GetDomainId();
            if (!_ctx.Avproject.Where(t => t.Domainid == domainId).Any())
            {
                _ctx.Avproject.Add(new Avproject() { Title = "-", Code = "-", Domainid = domainId });
                _ctx.SaveChanges();
            }
            var project = _ctx.Avproject.Where(t => t.Domainid == domainId).FirstOrDefault();

            _ctx.Avxml.Add(new Avxml() { Name = value.Name, Data = CreateElement(value.Node).ToString(), Project = project });
            _ctx.SaveChanges();
            return new { };
        }

        [HttpPut("{id}")]
        public dynamic Put(int id, [FromBody]XmlModel value)
        {
            var domainId = User.GetDomainId();

            var item = _ctx.Avxml.Where(t => t.Id == id && t.Project.Domainid == domainId).SingleOrDefault();
            item.Name = value.Name;
            item.Data = CreateElement(value.Node).ToString();
            _ctx.SaveChanges();
            return new { };
        }

        [HttpPost("upload")]
        public dynamic Upload()
        {
            var file = this.Request.Form.Files[0];
            var xml = XDocument.Load(file.OpenReadStream(), LoadOptions.None);
            var tree = CreateNode(xml.Root);

            return new { tree = tree };
        }

        private XElement CreateElement(MyNode node)
        {
            var element = new XElement(node.name);
            if (node.attributes != null)
            {
                foreach (var att in node.attributes)
                {
                    element.SetAttributeValue(att.name, att.value);
                }
            }
            if (node.childs != null)
            {
                foreach (var child in node.childs)
                {
                    element.Add(CreateElement(child));
                }
            }
            return element;
        }
    }

    public class XmlModel
    {
        public string Name { set; get; }
        public MyNode Node { set; get; }
    }

    public class MyNode
    {
        public string name { set; get; }
        public MyNode[] childs { set; get; }
        public MyAttribute[] attributes { set; get; }
    }

    public class MyAttribute
    {
        public string name { set; get; }
        public string value { set; get; }
    }
}