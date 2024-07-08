const Inits = require('./inits');

export const create = async () => {
  // const id = parseInt(Math.random() * 10) % 10;
  const ipfs = await Inits.initIPFS(`./ipfs_creator`, 4000);
  // const ipfs = await Inits.spawnIpfs(`./ipfs_creator`);
  let ipfsId = await ipfs.id();
  console.log('Started ipfs node. Local ipfs node id: ', ipfsId);
  // let secondIpfsId = await Inits.askQuestion("Please enter another IPFS id: ");
  // console.log("you've entered: ", secondIpfsId.toString());
  // await ipfs.swarm.connect(secondIpfsId.toString());
  const orbitdb = await Inits.initDb(ipfs, './orbitdb_creator');
  console.log('started orbit instancce');
  const access = {
    write: ['*'],
    read: ['*']
  };
  let db;
  try {
    db = await orbitdb.eventlog('player-consumption-store7'); //, access)
    await db.load();
  } catch (error) {
    console.log('failed to start dbs: ', error);
  }
  console.log('started db instance: ', db.id);
  return db;
  // adding new entries for another peer to listen on
  // let i = 0;
  // setInterval(async () => {
  //   i++;
  //   console.log("putting value: ", "first value" + i.toString());
  //   await db.put("hello" + i.toString(), {
  //     value: "first value" + i.toString(),
  //   });
  // }, 1500);
};
