const csv = require('csvtojson')
const express = require("express");
const app = express();

app.use(express.static("dist"));

app.get("/dict", async (req, res) => {
  var dict = await createDictionary();

  res.send(JSON.stringify(dict));
});

app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;

async function createDictionary() {
  const csvParticlesPath = 'event000000000-fatras-particles.csv'; 
  const csvHitsPath = 'event000000000-hits.csv';
  const csvTruthPath = 'event000000000-truth.csv';

  particles = await csv().fromFile(csvParticlesPath); 
  hits = await csv().fromFile(csvHitsPath); 
  truth = await csv().fromFile(csvTruthPath); 

  /*Main dictionary. Its structure looks like this:
  {
    particle_id: [[starting_position_x, starting_position_y, starting_position_z],
                  [hit1_x, hit1_y, hit1_z],
                  [hit2_x, hit2_y, hit2_z],
                  ...
                 ]
    ...
  }
  */
  particleToCords = {}

  //Adding initial position to every particle
  particles.forEach(particle => {
    particleId = particle['particle_id']
    x = parseFloat(particle['vx'])
    y = parseFloat(particle['vy'])
    z = parseFloat(particle['vz'])

    particleToCords[particleId] = [[x, y, z]]
  });

  /*Auxiliary dictionary to reduce complexity of creating the main one. Its structure looks like this:
    hit_id: [position_x, position_y, position_z]
  */
  hitsToCords = {}

  hits.forEach(hit => {
    hitId = hit['hit_id']
    x = parseFloat(hit['x'])
    y = parseFloat(hit['y'])
    z = parseFloat(hit['z'])

    if (! (isNaN(x) || isNaN(y) || isNaN(z)))
      hitsToCords[hitId] = [x, y, z]
  });

  //Adding positions of particle hits
  truth.forEach(hit => {
    particleId = hit['particle_id']
    hitId = hit['hit_id']

    hitCords = hitsToCords[hitId];

    if (hitCords !== undefined)
      particleToCords[particleId].push(hitCords);
  });

  return particleToCords;
}
