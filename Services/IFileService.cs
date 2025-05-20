using System.Collections.Generic;
using System.Threading.Tasks;
using DriveApi.Repositories;

namespace DriveApi.Services
{
    /// <summary>
    /// Service interface for file business logic.
    /// </summary>
    public interface IFileService
    {
        /// <summary>
        /// Gets a file by its ID.
        /// </summary>
        /// <param name="id">The file ID.</param>
        /// <returns>The file if found, otherwise null.</returns>
        Task<File?> GetByIdAsync(int id);

        /// <summary>
        /// Gets all files for a user.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <returns>List of files.</returns>
        Task<IEnumerable<File>> GetAllByUserIdAsync(string userId);

        /// <summary>
        /// Creates a new file.
        /// </summary>
        /// <param name="file">The file to create.</param>
        Task AddAsync(File file);

        /// <summary>
        /// Updates an existing file.
        /// </summary>
        /// <param name="file">The file to update.</param>
        Task UpdateAsync(File file);

        /// <summary>
        /// Deletes a file.
        /// </summary>
        /// <param name="file">The file to delete.</param>
        Task DeleteAsync(File file);
    }
}
