using System.Collections.Generic;
using System.Threading.Tasks;
using DriveApi.Repositories;

namespace DriveApi.Services
{
    /// <summary>
    /// Service interface for folder business logic.
    /// </summary>
    public interface IFolderService
    {
        /// <summary>
        /// Gets a folder by its ID.
        /// </summary>
        /// <param name="id">The folder ID.</param>
        /// <returns>The folder if found, otherwise null.</returns>
        Task<Folder?> GetByIdAsync(int id);

        /// <summary>
        /// Gets all folders for a user.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <returns>List of folders.</returns>
        Task<IEnumerable<Folder>> GetAllByUserIdAsync(string userId);

        /// <summary>
        /// Creates a new folder.
        /// </summary>
        /// <param name="folder">The folder to create.</param>
        Task AddAsync(Folder folder);

        /// <summary>
        /// Updates an existing folder.
        /// </summary>
        /// <param name="folder">The folder to update.</param>
        Task UpdateAsync(Folder folder);

        /// <summary>
        /// Deletes a folder.
        /// </summary>
        /// <param name="folder">The folder to delete.</param>
        Task DeleteAsync(Folder folder);
    }
}
