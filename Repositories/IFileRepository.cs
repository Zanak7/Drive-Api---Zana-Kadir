using System.Collections.Generic;
using System.Threading.Tasks;

namespace DriveApi.Repositories
{
    public interface IFileRepository
    {
        Task<File?> GetByIdAsync(int id);
        Task<IEnumerable<File>> GetAllByUserIdAsync(string userId);
        Task AddAsync(File file);
        Task UpdateAsync(File file);
        Task DeleteAsync(File file);
    }
}
