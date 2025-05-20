using DriveApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            return Ok(files);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var file = await _fileService.GetByIdAsync(id);
            if (file == null || file.UserId != userId) return NotFound();
            return Ok(file);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromBody] UploadFileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var file = new File
            {
                Name = request.Name,
                Content = request.Content,
                FolderId = request.FolderId,
                UserId = userId
            };
            await _fileService.AddAsync(file);
            return CreatedAtAction(nameof(GetById), new { id = file.Id }, file);
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
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public int FolderId { get; set; }
    }
}
