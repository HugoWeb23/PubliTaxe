using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taxes.Entities;
using MediatR;
using Taxes.Queries;
using Taxes.Commands;
using System;
using Taxes.Filters;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Taxes.Services;
using Taxes.ViewModels;

namespace Taxes.Controllers
{
    [ApiController]
    [AuthorizeRole(MinRole: 1)]
    [ErrorFormatter]
    [Route("api/entreprises")]

    public class EntrepriseController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _environment;

        public EntrepriseController(IMediator mediator, IWebHostEnvironment environment)
        {
            _mediator = mediator;
            _environment = environment;
        }

        [HttpPost("names")]
        public async Task<IActionResult> GetNames(SearchFiltersViewModel Filters)
        {
            try
            {
                EntreprisesViewModel model = await _mediator.Send(new GetEntreprisesQuery(Filters));
                return Ok(model);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [HttpGet("searchbyid/{Matricule}")]
        public async Task<IActionResult> SearchById(long Matricule)
        {
            try
            {
                Entreprise entreprise = await _mediator.Send(new GetEntrepriseById(Matricule));
                var filtered = new
                {
                    Matricule_ciger = entreprise.Matricule_ciger,
                    Nom = entreprise.Nom,
                    Nombre_panneaux = entreprise.Publicites.Count,
                    Recu = entreprise.Recu
                };
                return Ok(filtered);
            } catch(Exception ex)
            {
                return BadRequest(new {error = ex.Message});
            }
            
        }

        [HttpPost("searchbyname")]
        public async Task<IActionResult> GetEntreprisesByName(GetEntreprisesByNameViewModel Entreprise)
        {
            try
            {
                List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesByNameQuery(Entreprise.Name));
                return Ok(entreprises.Select(ent => new
                {
                    Matricule_ciger = ent.Matricule_ciger,
                    Nom = ent.Nom,
                    Nombre_panneaux = ent.Publicites.Count,
                    Recu = ent.Recu
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpGet("id/{matricule}")]
        public async Task<IActionResult> GetById(long matricule)
        {
            try
            {
                Entreprise entreprise = await _mediator.Send(new GetEntrepriseById(matricule));
                if (entreprise == null)
                {
                    return BadRequest(new { error = "Aucun enregistrement ne correspond à ce matricule" });
                }
                return Ok(entreprise);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPost("new")]
        public async Task<IActionResult> NewEntreprise(Entreprise entreprise)
        {
            try
            {
                Entreprise entr = await _mediator.Send(new InsertEntrepriseCommand(entreprise));
                return Ok(entr);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPut("edit/{matricule_ciger}")]
        public async Task<IActionResult> EditEntreprise(Entreprise entreprise)
        {
            try
            {
                Entreprise entr = await _mediator.Send(new UpdateEntrepriseCommand(entreprise));
                return Ok(entr);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPut("editpub")]
        public async Task<IActionResult> EditEntreprise(Publicite publicite)
        {
            try
            {
                Publicite entr = await _mediator.Send(new UpdatePubliciteCommand(publicite));
                return Ok(publicite);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPost("publicite/uploadimage")]
        public async Task<IActionResult> UploadImageAsync([FromForm] List<IFormFile> images)
        {
            if(images == null || images.Count == 0)
            {
                return BadRequest(new { error = "Veuillez sélectionner au moins une image"});
            }
            UploadImage UploadImage = new UploadImage(_environment);
            try
            {
                List<string> filesNames = await UploadImage.Upload(images);
                return Ok(filesNames);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }

        }

        [AuthorizeRole(MinRole: 2)]
        [HttpDelete("publicite/deleteimage/{imagename}")]
        public async Task<IActionResult> DeleteImage(string imagename)
        {
            UploadImage UploadImage = new UploadImage(_environment);
            try
            {
                await UploadImage.DeleteImage(imagename);
                await _mediator.Send(new DeleteImageCommand(imagename));
                return Ok(new { success = "L'image a été supprimée" });
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [HttpGet("printallbycity/{citytype}")]
        public async Task<IActionResult> PrintAllByCity(int citytype)
        {
            try
            {
                List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesByCityType(citytype));
                return Ok(entreprises);
            } catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            
        }

        [HttpGet("printallminutes")]
        public async Task<IActionResult> PrintAllMinutes()
        {
            try
            {
                List<Entreprise> entreprises = await _mediator.Send(new GetEntreprisesByMinutesQuery());
                return Ok(entreprises);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
            
        }

        [AuthorizeRole(MinRole: 2)]
        [HttpGet("notreceived/{FiscalYear}")]
        public async Task<IActionResult> GetNotReceived(long FiscalYear)
        {
            try
            {
                List<Entreprise> entreprises = await _mediator.Send(new GetNotReceivedQuery(FiscalYear));
                var filtered = entreprises.Select(x => new { x.Matricule_ciger, x.Nom, nombre_panneaux = x.Publicites.Count }).ToList();
                return Ok(filtered);
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message});
            }
            
        }

        [AuthorizeRole(MinRole: 2)]
        [HttpDelete("delete/{Matricule}")]
        public async Task<IActionResult> Delete(long Matricule)
        {
            try
            {
                bool isDeleted = await _mediator.Send(new DeleteEntrepriseCommand(Matricule));
                if(isDeleted == false)
                {
                    return BadRequest(new { error = "Une erreur est survenue lors de la suppression de l'entreprise" });
                }
                return Ok(new { success = "L'entreprise a été supprimée"});
            } catch(Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [AuthorizeRole(MinRole: 2)]
        [HttpPost("encodereceived")]
        public async Task<IActionResult> EncodeReceived(EncodeReceivedViewModel Matricules)
        {
            try
            {
                List<Entreprise> entreprises = await _mediator.Send(new EncodeReceivedCommand(Matricules.Matricules));
                return Ok(entreprises.Select(ent => new { Matricule_ciger = ent.Matricule_ciger, Recu = ent.Recu}));
            } catch(Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
            
        }

    }
}
