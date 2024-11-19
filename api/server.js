const { Client } = require('@elastic/elasticsearch');

// change this for your cert
const certificateBase64 = `
`;

const uname = '';
const passwrd = '';

const certBuffer = Buffer.from(certificateBase64, 'base64');

const client = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: uname,
        password: passwrd,
    },
    tls: {
        ca: certBuffer, 
        rejectUnauthorized: false 
    }
});

client.ping({}, (err, response) => {
    if (err) {
        console.error('Elasticsearch cluster is down!', err);
    } else {
        console.log('Elasticsearch is up!', response);
    }
});

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query string is required' });
    }

    console.log('---------------------------------------------------------------');

    try {
        let searchQuery;
        const alcoholicKeywords = ['alc', 'nalc', 'optalc'];
        if (alcoholicKeywords.includes(query.toLowerCase())) {
            searchQuery = {
                index: 'cocktail_data_bm25',
                body: {
                    query: {
                        match: {
                            strAlcoholic: {
                                query: query.toLowerCase(),
                                operator: 'or'
                            }
                        }
                    }
                }
            };
        } else {
            searchQuery = {
                index: 'cocktail_data_bm25',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        strDrink: {
                                            query: query.toLowerCase(),
                                            fuzziness: 1,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        ingredients: {
                                            query: query.toLowerCase(),
                                            fuzziness: 1,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        strIBA: {
                                            query: query.toLowerCase(),
                                            fuzziness: 1,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        strCategory: {
                                            query: query.toLowerCase(),
                                            fuzziness: 1,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        strGlass: {
                                            query: query.toLowerCase(),
                                            fuzziness: 1,
                                            operator: 'or'
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            };
        }

        const result = await client.search(searchQuery);

        const hits = result.hits.hits.map(hit => {
            const strAlcoholic = hit._source.strAlcoholic || 'N/A';
            const alcoholStatus = strAlcoholic === 'alc' ? 'Alcoholic' :
                                  strAlcoholic === 'nalc' ? 'Non-Alcoholic' :
                                  strAlcoholic === 'optalc' ? 'Optional Alcohol' :
                                  strAlcoholic;

            return {
                idDrink: hit._source.idDrink || 'N/A',
                strDrink: hit._source.strDrink || 'N/A',
                ingredients: hit._source.ingredients || 'N/A',
                strAlcoholic: alcoholStatus, 
                strCategory: hit._source.strCategory || 'N/A',
                strGlass: hit._source.strGlass || 'N/A',
                strDrinkThumb: hit._source.strDrinkThumb || 'N/A',
                strIBA: hit._source.strIBA || 'N/A',
                strInstructions: hit._source.strInstructions || 'N/A'
            };
        });

        res.status(200).json(hits);
    } catch (error) {
        console.error('Elasticsearch query error:', error);
        res.status(500).json({ message: 'Error querying Elasticsearch', error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
