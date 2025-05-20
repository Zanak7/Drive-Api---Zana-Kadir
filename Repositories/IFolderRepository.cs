using System.Collections.Generic;
using System.Threading.Tasks;

namespace DriveApi.Repositories
{
    public interface IFolderRepository
    {
        Task<Folder?> GetByIdAsync(int id);
        Task<IEnumerable<Folder>> GetAllByUserIdAsync(string userId);
        Task AddAsync(Folder folder);
        Task UpdateAsync(Folder folder);
        Task DeleteAsync(Folder folder);
    }
}
