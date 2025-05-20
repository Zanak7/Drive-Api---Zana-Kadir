using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DriveApi.Repositories
{
    public class FolderRepository : IFolderRepository
    {
        private readonly ApplicationDbContext _context;
        public FolderRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Folder?> GetByIdAsync(int id)
        {
            return await _context.Folders.Include(f => f.SubFolders).Include(f => f.Files).FirstOrDefaultAsync(f => f.Id == id);
        }
        public async Task<IEnumerable<Folder>> GetAllByUserIdAsync(string userId)
        {
            return await _context.Folders.Include(f => f.SubFolders).Include(f => f.Files).Where(f => f.UserId == userId).ToListAsync();
        }
        public async Task AddAsync(Folder folder)
        {
            await _context.Folders.AddAsync(folder);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Folder folder)
        {
            var tracked = await _context.Folders.FindAsync(folder.Id);
            if (tracked == null) return;
            _context.Entry(tracked).CurrentValues.SetValues(folder);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Folder folder)
        {
            _context.Folders.Remove(folder);
            await _context.SaveChangesAsync();
        }
    }
}
