const express = require('express');
const { readFile, writeFile } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  next();
});

app.get('/products', async (req, res) => {
  const data = await readFile('./data.json');
  res.write(JSON.stringify(data));
  res.end();
});

app.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const data = await readFile('./data.json');
  const product = data.find((product) => product.id === id);
  res.write(JSON.stringify(product || {}));
  res.end();
});

app.post('/products', async (req, res) => {
  let chunks = '';
  req.on('data', (chunk) => (chunks += chunk));
  req.on('end', async () => {
    const product = {
      id: new Date().getTime(),
      ...JSON.parse(chunks),
    };
    const products = await readFile('./data.json');
    products.push(product);
    await writeFile('./data.json', JSON.stringify(products));
    res.end();
  });
});

app.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  let chunks = '';
  req.on('data', (chunk) => (chunks += chunk));
  req.on('end', async () => {
    const product = {
      id: id,
      ...JSON.parse(chunks),
    };
    const products = await readFile('./data.json');
    const index = products.findIndex(product => product.id === id);
    products.splice(index, 1, product);
    await writeFile('./data.json', JSON.stringify(products));
    res.end();
  });
});

app.delete('/products/:uid', async (req, res) => {
  const id = Number(req.params.uid);
  const products = await readFile('./data.json');
  const filteredProducts = products.filter((product) => product.id !== id);
  await writeFile('./data.json', JSON.stringify(filteredProducts));
  res.end();
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
