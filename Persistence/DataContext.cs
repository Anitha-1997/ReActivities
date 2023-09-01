using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.AppUser)
            .WithMany(o => o.Activities)
            .HasForeignKey(a => a.AppUserId);
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.Activity)
            .WithMany(o => o.Attendees)
            .HasForeignKey(a => a.ActivityId);
            builder.Entity<Comment>()
            .HasOne(u => u.Activity)
            .WithMany(o => o.Comments)
            .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });
                b.HasOne(o => o.Observer)
                .WithMany(f => f.Followings)
                .HasForeignKey(k => k.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);
                b.HasOne(o => o.Target)
                .WithMany(f => f.Followers)
                .HasForeignKey(k => k.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}