using System.Collections.Generic;

namespace DriveApi
{
    public class Folder
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentFolderId { get; set; }
        public string UserId { get; set; } = string.Empty;

        public Folder? ParentFolder { get; set; }
        public ICollection<Folder> SubFolders { get; set; } = new List<Folder>();
        public ICollection<File> Files { get; set; } = new List<File>();
        public User? User { get; set; }
    }
}
