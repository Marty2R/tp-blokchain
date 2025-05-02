const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(express.json());

// GET /blocks : retourne la chaîne
app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

// POST /mine : ajoute un nouveau bloc avec les données fournies
app.post('/mine', (req, res) => {
    const { data } = req.body;
    const block = blockchain.addBlock(data);
    res.json({ message: 'New block mined', block });
});

// Port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


const P2PServer = require('./p2p-server');
const p2pServer = new P2PServer(blockchain);
p2pServer.listen();

// Après minage, synchronise
app.post('/mine', (req, res) => {
    const { data } = req.body;
    const block = blockchain.addBlock(data);
    p2pServer.syncChains();  // ← ici
    res.json({ message: 'New block mined', block });
});
