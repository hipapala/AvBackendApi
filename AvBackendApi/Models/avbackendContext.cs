using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AvBackend
{
    public partial class AvBackendContext : DbContext
    {
        public virtual DbSet<Avconfig> Avconfig { get; set; }
        public virtual DbSet<Avdomain> Avdomain { get; set; }
        public virtual DbSet<Avenumrole> Avenumrole { get; set; }
        public virtual DbSet<Avproject> Avproject { get; set; }
        public virtual DbSet<Avuser> Avuser { get; set; }
        public virtual DbSet<Avuserdomain> Avuserdomain { get; set; }
        public virtual DbSet<Avxml> Avxml { get; set; }

        public AvBackendContext(DbContextOptions<AvBackendContext> options) : base(options) { }

        //        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //        {
        //            if (!optionsBuilder.IsConfigured)
        //            {
        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
        //                optionsBuilder.UseNpgsql(@"Host=localhost;Database=avbackend;Username=postgres;Password=qwerasdf");
        //            }
        //        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Avconfig>(entity =>
            {
                entity.ToTable("avconfig");

                entity.HasIndex(e => e.Projectid)
                    .HasName("avconfig_un")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Data)
                    .IsRequired()
                    .HasColumnName("data")
                    .HasColumnType("json");

                entity.Property(e => e.Projectid).HasColumnName("projectid");

                entity.HasOne(d => d.Project)
                    .WithOne(p => p.Avconfig)
                    .HasForeignKey<Avconfig>(d => d.Projectid)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("avconfig_project_fkey");
            });

            modelBuilder.Entity<Avdomain>(entity =>
            {
                entity.ToTable("avdomain");

                entity.HasIndex(e => e.Name)
                    .HasName("av_domain_unkey")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnName("created")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Avenumrole>(entity =>
            {
                entity.ToTable("avenumrole");

                entity.HasIndex(e => e.Name)
                    .HasName("avenumroleun")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Avproject>(entity =>
            {
                entity.ToTable("avproject");

                entity.HasIndex(e => new { e.Domainid, e.Code })
                    .HasName("event_eventdomainid_code_key")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Code).HasColumnName("code");

                entity.Property(e => e.Created)
                    .HasColumnName("created")
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.Domainid).HasColumnName("domainid");

                entity.Property(e => e.Isdefault)
                    .HasColumnName("isdefault")
                    .HasDefaultValueSql("true");

                entity.Property(e => e.Modified)
                    .HasColumnName("modified")
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Title).HasColumnName("title");

                entity.HasOne(d => d.Domain)
                    .WithMany(p => p.Avproject)
                    .HasForeignKey(d => d.Domainid)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("projectdomainid_fkey");
            });

            modelBuilder.Entity<Avuser>(entity =>
            {
                entity.ToTable("avuser");

                entity.HasIndex(e => e.Email)
                    .HasName("useremailun")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnName("created")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Email).HasColumnName("email");

                entity.Property(e => e.Issuperadmin)
                    .HasColumnName("issuperadmin")
                    .HasDefaultValueSql("false");

                entity.Property(e => e.Modified)
                    .HasColumnName("modified")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Password).HasColumnName("password");
            });

            modelBuilder.Entity<Avuserdomain>(entity =>
            {
                entity.ToTable("avuserdomain");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnName("created")
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Domainid).HasColumnName("domainid");

                entity.Property(e => e.Roleid).HasColumnName("roleid");

                entity.Property(e => e.Userid).HasColumnName("userid");

                entity.HasOne(d => d.Domain)
                    .WithMany(p => p.Avuserdomain)
                    .HasForeignKey(d => d.Domainid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("userdomain_fkey");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Avuserdomain)
                    .HasForeignKey(d => d.Roleid)
                    .HasConstraintName("avuserdomain_rolefr");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Avuserdomain)
                    .HasForeignKey(d => d.Userid)
                    .HasConstraintName("avuserdomain_userfr");
            });

            modelBuilder.Entity<Avxml>(entity =>
            {
                entity.ToTable("avxml");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnName("created")
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Data)
                    .IsRequired()
                    .HasColumnName("data")
                    .HasColumnType("xml");

                entity.Property(e => e.Modified)
                    .HasColumnName("modified")
                    .HasColumnType("timestamptz")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Name).HasColumnName("name");

                entity.Property(e => e.Projectid).HasColumnName("projectid");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.Avxml)
                    .HasForeignKey(d => d.Projectid)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("xmlprojectid_fkey");
            });
        }
    }
}
