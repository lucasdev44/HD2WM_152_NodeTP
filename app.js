const express = require('express');
 
const app = express();
app.use(express.json());
let articles = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];
 
app.get('/articles', (req, res)=>{
    return res.json(articles);
});
app.get('/article/:id', (req, res) => {
    const articleId = parseInt(req.params.id);
    const article = articles.find(article => article.id === articleId);
    if (article) {
        return res.json(article);
    } else {
        return res.status(404).json({ message: 'Article non trouvé' });
    }
});
app.post('/save-article', (req, res) => {
    const newArticle = req.body;
    if (newArticle && newArticle.title && newArticle.content && newArticle.author) {
        // Assigner un nouvel ID à l'article
        const newId = articles.length > 0 ? articles[articles.length - 1].id + 1 : 1;
        newArticle.id = newId;
        articles.push(newArticle);
        return res.status(201).json(newArticle);
    } else {
        return res.status(400).json({ message: 'Données d\'article invalides' });
    }
});
app.delete('/article/:id', (req, res) => {
    const articleId = parseInt(req.params.id);
    const articleIndex = articles.findIndex(article => article.id === articleId);
    if (articleIndex !== -1) {
        articles.splice(articleIndex, 1);
        return res.json({ message: 'Article supprimé avec succès' });
    } else {
        return res.status(404).json({ message: 'Article non trouvé' });
    }
});
 
app.listen(3000, () =>{
    console.log("working");
});