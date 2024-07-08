const Inits = require('./inits');

async function main() {
  const ipfs = await Inits.spawnIpfs('./ipfs_creator');
  let ipfsId = await ipfs.id();
  console.log('Started ipfs node. Local ipfs node id: ', ipfsId.id);
  // let secondIpfsId = await Inits.askQuestion("Please enter another IPFS id: ");
  // console.log("you've entered: ", secondIpfsId.toString());
  // await ipfs.swarm.connect(secondIpfsId.toString());
  const orbitdb = await Inits.initDb(ipfs, './orbitdb_creator');
  console.log('started orbit instancce');
  const access = {
    write: ['*'],
    read: ['*']
  };
  let dbName = await Inits.askQuestion('please enter database id: ');
  console.log("you've entered: ", dbName.toString());
  let db;
  try {
    db = await orbitdb.keyvalue(dbName.toString()); //, access)
  } catch (error) {
    console.log('failed to start two dbs: ', error);
  }
  db.events.on('replicated', () => {
    const result = db.all;
    console.log(result);
  });
}

main();
