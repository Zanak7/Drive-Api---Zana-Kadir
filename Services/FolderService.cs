using System.Collections.Generic;
using System.Threading.Tasks;
using DriveApi.Repositories;

namespace DriveApi.Services
{
    /// <summary>
    /// Service implementation for folder business logic.
    /// </summary>
    public class FolderService : IFolderService
    {
        private readonly IFolderRepository _folderRepository;
        public FolderService(IFolderRepository folderRepository)
        {
            _folderRepository = folderRepository;
        }

        /// <summary>
        /// Retrieves a folder by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the folder.</param>
        /// <returns>The folder if found; otherwise, null.</returns>
        /// <inheritdoc/>
        public async Task<Folder?> GetByIdAsync(int id)
        {
            return await _folderRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// Retrieves all folders belonging to a specific user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A collection of folders owned by the user.</returns>
        /// <inheritdoc/>
        public async Task<IEnumerable<Folder>> GetAllByUserIdAsync(string userId)
        {
            return await _folderRepository.GetAllByUserIdAsync(userId);
        }

        /// <summary>
        /// Adds a new folder to the database.
        /// </summary>
        /// <param name="folder">The folder entity to add.</param>
        /// <inheritdoc/>
        public async Task AddAsync(Folder folder)
        {
            await _folderRepository.AddAsync(folder);
        }

        /// <summary>
        /// Updates an existing folder in the database.
        /// </summary>
        /// <param name="folder">The folder entity with updated values.</param>
        /// <inheritdoc/>
        public async Task UpdateAsync(Folder folder)
        {
            await _folderRepository.UpdateAsync(folder);
        }

        /// <summary>
        /// Deletes a folder from the database.
        /// </summary>
        /// <param name="folder">The folder entity to delete.</param>
        /// <inheritdoc/>
        public async Task DeleteAsync(Folder folder)
        {
            await _folderRepository.DeleteAsync(folder);
        }
    }
}
