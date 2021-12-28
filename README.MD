# PubliTaxe

### Base de données
[Data.sql](https://github.com/HugoWeb23/PubliTaxe/tree/master/Database)

### Points d'attention
* [settings.json](https://github.com/HugoWeb23/PubliTaxe/blob/master/ClientApp/src/settings.json) définit les URL de production et de développement. Ce fichier est utilisé dans [apiFetch](https://github.com/HugoWeb23/PubliTaxe/blob/master/ClientApp/src/Services/apiFetch.tsx) qui gère tous les appels d'API, dans [AdvertisingModal](https://github.com/HugoWeb23/PubliTaxe/blob/master/ClientApp/src/Components/TaxeManagement/AdvertisingModal.tsx#L355) et [ViewAdvertisingModal](https://github.com/HugoWeb23/PubliTaxe/blob/master/ClientApp/src/Components/TaxeManagement/ViewAdvertisingModal.tsx#L99) pour afficher les images des enseignes publicitaires.

* Les images uploadées depuis l'application sont stockées dans le fichier **Uploads/images**. Le fichier est accessible de manière statique via le chemin **/api/images**.

```cs
app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "Uploads/images")),
                RequestPath = "/api/images"
            });
```

* En mode développement, l'instance NPM (*cd ClientApp* *npm start*) est utilisée pour distribuer l'application.

```cs
if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
```

### Utilisateur par défaut

Un utilisateur est déjà présent dans la base de données, e-mail : **john.doe@gmail.com**, mot de passe **abcd1234**.