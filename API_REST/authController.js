const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";


// exports.getUsers = async function (req, res) { // permet de voir les utilisateurs présents dans la bd
//     try {
//         db = await MongoClient.connect(url);
//         let dbo = db.db("taches");
//         let datas = await dbo.collection("utilisateur").find({}).toArray();
//         res.status(200).json(datas);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err })
//     }
// };

exports.signIn = [
    async function (req, res) {
        let utilisateur = req.body;
        try {
            db = await MongoClient.connect(url);
            let dbo = db.db("taches");
            let utilisateurs = await dbo.collection("utilisateur").find({}).toArray();
            let utilisateurFiltred = utilisateurs.filter(user => user.login == utilisateur.login);
            if (utilisateurFiltred.length > 0) { //vérification qu'il n'existe pas déjà un utilisateur avec l'identifiant avant de l'ajouter à la base
                res.status(401).json({ message: 'Compte déjà existant' });
            }
            else {
                await dbo.collection("utilisateur").insertOne(utilisateur);
                res.status(200).send();
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err })
        }
    }
];

exports.login = [
    async function (req, res) {

        // SOlution 1
        /* try {
             let utilisateur = req.body;
             db = await MongoClient.connect(url);
             let dbo = db.db("taches");
             let utilisateurs = await dbo.collection("utilisateur").find(
                 { login: utilisateur.login, password: utilisateur.password }).toArray();
             if (utilisateurs.length > 0) {
                 req.session.user = utilisateurs[0].login;
                 res.status(200).send();
             } else {
                 res.status(401).json({ message: 'Unauthorized' });
             }
         }
         catch (err) {
             console.log(err);
             res.status(500).json({ message: err })
         }*/

        //Solution 2
        try {
            let utilisateur = req.body;
            db = await MongoClient.connect(url);
            let dbo = db.db("taches");
            let utilisateurs = await dbo.collection("utilisateur").find(
                {}).toArray();
            let utilisateurFiltred = utilisateurs.filter(user =>
                user.login == utilisateur.login &&
                user.password == utilisateur.password)

            if (utilisateurFiltred.length > 0) {
                req.session.user = utilisateurFiltred[0].login;
                res.status(200).send();
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err })
        }
    }
];

exports.logout = [
    async function (req, res) {
        if (req.session)
            await req.session.destroy();
        res.status(200).end();
    }
];

exports.isConnected = [
    async function (req, res) {
        res.status(200).end();
        /*
        let result;
        if (req.session.user) {
            result = true;
        } else {
            result = false;
        }
        res.status(200).send(result);
        */
    }
];