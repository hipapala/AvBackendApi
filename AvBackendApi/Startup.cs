using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using AvBackend;
using Microsoft.EntityFrameworkCore;

namespace AvBackendApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("AvBackendContext");
            services.AddEntityFrameworkNpgsql().AddDbContext<AvBackendContext>(options => options.UseNpgsql(connectionString));

            services.AddAuthentication(options =>
            {
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie(options =>
            {
                options.LoginPath = "";
                options.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = ctx =>
                    {
                        // if (ctx.Request.Path.StartsWithSegments("/api"))
                        // {
                        ctx.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
                        // }
                        // else {
                        //     ctx.Response.Redirect(ctx.RedirectUri);
                        // }
                        return System.Threading.Tasks.Task.FromResult(0);
                    }
                };
            });
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Default",
                     authBuilder =>
                     {
                         authBuilder.AuthenticationSchemes = new List<string>() { CookieAuthenticationDefaults.AuthenticationScheme };
                         authBuilder.RequireClaim(ClaimTypes.Name);
                     });
                options.AddPolicy("Admin",
                     authBuilder =>
                     {
                         authBuilder.AuthenticationSchemes = new List<string>() { CookieAuthenticationDefaults.AuthenticationScheme };
                         authBuilder.RequireRole("Admin");
                     });
                options.AddPolicy("User",
                     authBuilder =>
                     {
                         authBuilder.AuthenticationSchemes = new List<string>() { CookieAuthenticationDefaults.AuthenticationScheme };
                         authBuilder.RequireRole("User");
                     });
                options.DefaultPolicy = options.GetPolicy("Default");
            });

            //services.ConfigureApplicationCookie(options =>
            //{
            //    options.Cookie.HttpOnly = true;
            //    options.ExpireTimeSpan = System.TimeSpan.FromHours(1);
            //    options.LoginPath = "/ddd/dfdf";
            //    options.LogoutPath = "/ddd/dfdf";
            //});

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "catch-all",
                    template: "{*url}",
                    defaults: new { controller = "Home", action = "Index" }
                );
            });
            app.UseAuthentication();

            // app.UseMvc();
        }
    }
}
