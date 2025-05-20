using System.Collections.Generic;
using System.Threading.Tasks;
using DriveApi.Repositories;

namespace DriveApi.Services
{
    /// <summary>
    /// Service implementation for file business logic.
    /// </summary>
    public class FileService : IFileService
    {
        private readonly IFileRepository _fileRepository;
        public FileService(IFileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }

        /// <inheritdoc/>
        /// <summary>
        /// Retrieves a file by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the file.</param>
        /// <returns>The file if found; otherwise, null.</returns>
        public async Task<File?> GetByIdAsync(int id)
        {
            return await _fileRepository.GetByIdAsync(id);
        }

        /// <inheritdoc/>
        /// <summary>
        /// Retrieves all files belonging to a specific user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A collection of files owned by the user.</returns>
        public async Task<IEnumerable<File>> GetAllByUserIdAsync(string userId)
        {
            return await _fileRepository.GetAllByUserIdAsync(userId);
        }

        /// <inheritdoc/>
        /// <summary>
        /// Adds a new file to the database.
        /// </summary>
        /// <param name="file">The file entity to add.</param>
        public async Task AddAsync(File file)
        {
            await _fileRepository.AddAsync(file);
        }

        /// <inheritdoc/>
        /// <summary>
        /// Updates an existing file in the database.
        /// </summary>
        /// <param name="file">The file entity with updated values.</param>
        public async Task UpdateAsync(File file)
        {
            await _fileRepository.UpdateAsync(file);
        }

        /// <inheritdoc/>
        /// <summary>
        /// Deletes a file from the database.
        /// </summary>
        /// <param name="file">The file entity to delete.</param>
        public async Task DeleteAsync(File file)
        {
            await _fileRepository.DeleteAsync(file);
        }
    }
}
