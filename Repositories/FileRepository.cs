using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DriveApi.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly ApplicationDbContext _context;
        public FileRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<File?> GetByIdAsync(int id)
        {
            return await _context.Files.Include(f => f.Folder).FirstOrDefaultAsync(f => f.Id == id);
        }
        public async Task<IEnumerable<File>> GetAllByUserIdAsync(string userId)
        {
            return await _context.Files.Include(f => f.Folder).Where(f => f.UserId == userId).ToListAsync();
        }
        public async Task AddAsync(File file)
        {
            await _context.Files.AddAsync(file);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(File file)
        {
            var tracked = await _context.Files.FindAsync(file.Id);
            if (tracked == null) return;
            _context.Entry(tracked).CurrentValues.SetValues(file);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(File file)
        {
            _context.Files.Remove(file);
            await _context.SaveChangesAsync();
        }
    }
}
