namespace DriveApi.Controllers
{
    public class FileResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int FolderId { get; set; }
    }

    public class FolderResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<FileResponseDto>? Files { get; set; }
    }
}
