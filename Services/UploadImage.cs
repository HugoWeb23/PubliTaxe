using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Text;
using System.Linq;

namespace Taxes.Services
{
    public class UploadImage
    {
        private IWebHostEnvironment _environment;

        public UploadImage(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public async Task<List<string>> Upload(List<IFormFile> images)
        {
           
            List<string> fileNames = new List<string>();
            string[] permittedExtensions = { ".png", ".jpeg", ".jpg" };
            foreach (var image in images)
            {
                try
                {
                    string extension = Path.GetExtension(image.FileName);
                    if (permittedExtensions.Contains(extension))
                    {
                        StringBuilder fileName = new StringBuilder();
                        fileName.AppendFormat("{0}-{1}", Guid.NewGuid(), extension);
                        string path = Path.Combine(_environment.ContentRootPath, "Uploads", "images/" + fileName);
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await image.CopyToAsync(stream);
                        }
                        fileNames.Add(fileName.ToString());
                    }
                } catch(Exception)
                {
                    throw new Exception("Une erreur est survenue");
                }
                
            }

            return fileNames;
        }

        public Task<Boolean> DeleteImage(string imageName)
        {
            try
            {
                string path = Path.Combine(_environment.ContentRootPath, "Uploads", "images/" + imageName);
                File.Delete(path);
                return Task.FromResult(true);

            } catch(Exception)
            {
                throw new Exception("Une erreur est survenue");
            }
            
        }
    }
}
