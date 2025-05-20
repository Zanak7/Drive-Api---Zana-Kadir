namespace DriveApi
{
    public class File
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public int FolderId { get; set; }
        public string UserId { get; set; } = string.Empty;

        public Folder? Folder { get; set; }
        public User? User { get; set; }
    }
}
