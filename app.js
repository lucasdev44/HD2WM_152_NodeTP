const express = require('express');
 
const app = express();
 
app.use(express.json());
 
 
const {v4:uuidv4} = require('uuid');
 
// =================== BDD =================== //
//Config connexion Mongodb
const mongoose = require("mongoose");
app.use(express.json());
mongoose.connection.once("open", () => {
  console.log(`Connecté à la BDD`);
});
 
mongoose.connection.on(`error`, (err) => {
  console.log(`Erreur de bdd : ${err}`);
});
 
mongoose.connect("mongodb://localhost:27017/db_articles");
 
const Article = mongoose.model(
  "Article",
  { uid: String, title: String, content: String, author: String },
  "articles"
);
///////////////////////////////////////////////////////////////////////////////////////////////
let articles = [
    {title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    {title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    {title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];
///////////////////////////////////////////////////////////////////////////////////////////////
 
 
app.get('/articles', async (req, res)=>{
    const articles = await Article.find();
    return res.json({
        code : "200",
        message: "La liste des articles a été récupérés avec succès",
        data : articles
    });
});
app.get('/article/:id', async (req, res) => {
    const idParam = req.params.id;
    const article = await Article.findOne({ uid: idParam });
    if (!article) {
        return res.json({
            code : "702",
            message: `Impossible de récupérer un article avec l'UID ${idParam}`,
            data : "Null"
        });  
    }
    return res.json({
        code : "200",
        message: "L'article a été récupéré avec succès",
        data : article
    });
});
app.post('/save-article', async (req, res) => {
    const newArticle = req.body;
 
    // Vérification des champs nécessaires
    if (!newArticle || !newArticle.title || !newArticle.content || !newArticle.author) {
        return res.json({
            code: "701",
            message: "L'article manque d'infos",
            data: "Null"
        });
    }
 
    newArticle.uid = uuidv4();
 
    // Vérifier les titres des articles existants
    const articles = await Article.find();
    let articlesTitles = [];
    articles.forEach(article => articlesTitles.push(article.title));
 
    if (articlesTitles.includes(newArticle.title)) {
        return res.json({
            code: "701",
            message: "Impossible d'ajouter un article avec un titre déjà existant",
            data: "Null"
        });
    }
 
    // Créer et sauvegarder l'article
    const createdArticle = new Article(newArticle);
    await createdArticle.save();
 
    return res.json({
        code: "200",
        message: "Article ajouté avec succès",
        data: createdArticle
    });
});
app.post('/update-article/:id', async (req, res) => {
    const newArticle = req.body;
    const idParam = req.params.id;
    const articleToUpdate = await Article.findOne({ uid: idParam });
    if (!articleToUpdate) {
        return res.json({
            code : "702",
            message: `Impossible de récupérer un article avec l'UID ${idParam}`,
            data : "Null"
        });  
    }
    articleToUpdate.title = newArticle.title;
    articleToUpdate.content = newArticle.content;
    articleToUpdate.author = newArticle.author;
    // Vérifier les titres des articles existants
    const articles = await Article.find();
    let articlesTitles = [];
    articles.forEach(article => articlesTitles.push(article.title));
 
    if (articlesTitles.includes(articleToUpdate.title)) {
        return res.json({
            code: "701",
            message: "Impossible d'ajouter un article avec un titre déjà existant",
            data: "Null"
        });
    }
 
    await articleToUpdate.save();
 
    return res.json({
        code: "200",
        message: "Article modifié avec succès",
        data: articleToUpdate
    });
});
app.delete('/article/:id', async (req, res) => {
    const idParam = req.params.id;
    const article = await Article.findOne({ uid: idParam });
    if (!article) {
        return res.json({
            code : "701",
            message: "Impossible de supprimer un article dont l'UID n'existe pas",
            data:"Null"
           
        });
    }
        await Article.deleteOne({ uid: idParam })
        return res.json({
            code : "200",
            message: `Article ${idParam} supprimé avec succès`
           
        });
   
});
 
app.listen(3000, () =>{
    console.log("working");
});