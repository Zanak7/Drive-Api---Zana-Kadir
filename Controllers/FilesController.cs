using DriveApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;

namespace DriveApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;
        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyFiles()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var files = await _fileService.GetAllByUserIdAsync(userId);
            // Use the full namespace for FileResponseDto to avoid ambiguity
            var fileDtos = files.Select(f => new DriveApi.Controllers.FileResponseDto
            {
                Id = f.Id,
                Name = f.Name,
                FolderId = f.FolderId
            }).ToList();
            return Ok(fileDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var file = await _fileService.GetByIdAsync(id);
            if (file == null || file.UserId != userId) return NotFound();

            // Try to preview as text if possible (first 200 bytes)
            string? preview = null;
            try
            {
                var bytes = file.Content.Take(200).ToArray();
                preview = System.Text.Encoding.UTF8.GetString(bytes);
                // If binary, fallback
                if (preview.Any(c => char.IsControl(c) && c != '\r' && c != '\n' && c != '\t'))
                    preview = "[Preview not available]";
            }
            catch
            {
                preview = "[Preview not available]";
            }

            var dto = new {
                Id = file.Id,
                Name = file.Name,
                FolderId = file.FolderId,
                Preview = preview
            };
            return Ok(dto);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromBody] UploadFileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var file = new File
            {
                Name = request.Name,
                Content = Convert.FromBase64String(request.Content), // Decode base64 to byte[]
                FolderId = request.FolderId,
                UserId = userId
            };
            await _fileService.AddAsync(file);
            // Use the full namespace for FileResponseDto to avoid ambiguity
            var dto = new DriveApi.Controllers.FileResponseDto
            {
                Id = file.Id,
                Name = file.Name,
                FolderId = file.FolderId
            };
            return CreatedAtAction(nameof(GetById), new { id = file.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, File file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            if (id != file.Id) return BadRequest();
            var existing = await _fileService.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return NotFound();
            file.UserId = userId;
            await _fileService.UpdateAsync(file);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var file = await _fileService.GetByIdAsync(id);
            if (file == null || file.UserId != userId) return NotFound();
            await _fileService.DeleteAsync(file);
            return NoContent();
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var file = await _fileService.GetByIdAsync(id);
            if (file == null || file.UserId != userId) return NotFound();
            return File(file.Content, "application/octet-stream", file.Name);
        }
    }

    public class UploadFileRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty; // Accept base64 string
        public int FolderId { get; set; }
    }
}
