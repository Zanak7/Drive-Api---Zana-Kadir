using DriveApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DriveApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FoldersController : ControllerBase
    {
        private readonly IFolderService _folderService;
        public FoldersController(IFolderService folderService)
        {
            _folderService = folderService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyFolders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var folders = await _folderService.GetAllByUserIdAsync(userId);
            return Ok(folders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var folder = await _folderService.GetByIdAsync(id);
            if (folder == null || folder.UserId != userId) return NotFound();
            return Ok(folder);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Folder folder)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            folder.UserId = userId;
            await _folderService.AddAsync(folder);
            return CreatedAtAction(nameof(GetById), new { id = folder.Id }, folder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Folder folder)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            if (id != folder.Id) return BadRequest();
            var existing = await _folderService.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return NotFound();
            folder.UserId = userId;
            await _folderService.UpdateAsync(folder);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var folder = await _folderService.GetByIdAsync(id);
            if (folder == null || folder.UserId != userId) return NotFound();
            await _folderService.DeleteAsync(folder);
            return NoContent();
        }
    }
}
