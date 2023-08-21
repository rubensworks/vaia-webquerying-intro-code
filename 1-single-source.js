const { QueryEngine } = require("@comunica/query-sparql");
const { RdfStore } = require("rdf-stores");
const { DataFactory } = require("rdf-data-factory");

(async function(){
    const myEngine = new QueryEngine();
    const DF = new DataFactory();
    const store = RdfStore.createDefault();

    store.addQuad(DF.quad(
        DF.namedNode('https://comunica.dev/#software'),
        DF.namedNode('http://xmlns.com/foaf/0.1/name'),
        DF.literal("Software"),
    ));
    store.addQuad(DF.quad(
        DF.namedNode('https://comunica.dev/'),
        DF.namedNode('http://xmlns.com/foaf/0.1/primaryTopic'),
        DF.namedNode('https://comunica.dev/#website'),
    ));
    store.addQuad(DF.quad(
        DF.namedNode('https://comunica.dev/#website'),
        DF.namedNode('http://xmlns.com/foaf/0.1/name'),
        DF.literal("Website"),
    ));

    const bindingsStream = await myEngine.queryBindings(`SELECT * WHERE { ?s ?p ?o } LIMIT 1`, {
        sources: [
            store,
            // 'https://fragments.dbpedia.org/2016-04/en',
        ],
    });

    bindingsStream.on('data', (bindings) => {
        console.log(bindings.toString());
    });
    bindingsStream.on('error', console.error);
    bindingsStream.on('end', () => {
        console.log('Done!');
    });
})();
