using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace DriveApi
{
    public class User : IdentityUser
    {
        public ICollection<Folder> Folders { get; set; } = new List<Folder>();
        public ICollection<File> Files { get; set; } = new List<File>();
    }
}
