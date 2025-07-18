/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

//Importe für zweite Cloud Function:

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { Storage } = require('@google-cloud/storage');
const { spawn } = require('child_process');
const fs = require('fs'); 
const os = require('os');
const path = require('path');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");    
admin.initializeApp();

exports.updateLeaderboard = functions.region("europe-west1").pubsub.schedule('every 60 minutes').onRun(async (context) => {
  const db = admin.firestore();

  const usersRef = db.collection("users");
  const snapshot = await usersRef.orderBy("user_game_information.highscore", "desc").get();

  const leaderboard = [];
  let rank = 1;
  snapshot.forEach(doc => {
    const data = doc.data();
    leaderboard.push({
      user_rank: rank++,
      user_name: data.user_name || "unknown",
      user_highscore: data.user_game_information?.highscore || 0,
      user_profile_picture: data.user_profile_picture
    });
  });

  const nowISO = new Date().toISOString();
  await db.collection("statistics").doc(nowISO)
  .set({ leaderboard,
         timestamp: admin.firestore.FieldValue.serverTimestamp()
   });

  console.log("Leaderboard updated at", nowISO);
  return null;
});



// 2. Funktion: SSH-Key aus Secret Manager holen
async function fetchPrivateKey() {
  const client = new SecretManagerServiceClient();
  // Dein Projekt wird automatisch über process.env.GCP_PROJECT erkannt
  const name = `projects/${process.env.GCP_PROJECT}/secrets/ssh-private-key/versions/latest`;
  const [version] = await client.accessSecretVersion({ name });
  const keyStr = version.payload.data.toString('utf8');

  const keyPath = path.join(__dirname, 'Clusterzugang', 'id_rsa');
  // Schreibe den Key in /tmp und setze Berechtigungen
  fs.writeFileSync(keyPath, keyStr, { mode: 0o400 });
  return keyPath;
}

// 3. Deine bestehende Function, jetzt mit SSH-Logik
exports.onNewPDFUpload = functions
  .region('us-central1')
  .storage
  .bucket("edukit-tp.firebasestorage.app") 
  .object()
  .onFinalize(async (object) => {
    try {
      if (!object.name.endsWith('.pdf')) return;

      const parts = object.name.split('/');
      const modul = parts[1];
      const vorlesung = parts[2];
      const kapitel = parts[3];
      const filename = parts[4];

      const sshKey = await fetchPrivateKey();

      const storage = new Storage();
      const bucketName = object.bucket;
      const remotePath = object.name;
      const localPath = path.join(os.tmpdir(), path.basename(remotePath));

      await storage.bucket(bucketName).file(remotePath)
        .download({ destination: localPath });
      console.log(`Downloaded ${remotePath} to ${localPath}`);

      // Datei per SCP hochladen
      await new Promise((resolve, reject) => {
        const scp = spawn('scp', [
          '-i', sshKey,
          '-o', 'StrictHostKeyChecking=no',
          localPath,
          `ka_uutnq@bwunicluster.scc.kit.edu:/pfs/work9/workspace/scratch/ka_uutnq-Teamprojekt`
        ]);
        scp.stdout.on('data', d => console.log(d.toString()));
        scp.stderr.on('data', d => console.error(d.toString()));
        scp.on('close', code => code === 0 ? resolve() : reject(new Error(`SCP failed: ${code}`)));
      });

      console.log('PDF transferred to cluster.');

      // SLURM-Job auslösen
      await new Promise((resolve, reject) => {
        const pdfName = path.basename(localPath);
        const remoteInput = `/pfs/work9/workspace/scratch/ka_uutnq-Teamprojekt/${pdfName}`;
        const jobCommand = [
          '-i', sshKey,
          '-o', 'StrictHostKeyChecking=no',
          `ka_uutnq@bwunicluster.scc.kit.edu`,
          `sbatch quiz.py "${remoteInput}" "${modul}" "${vorlesung}" "${kapitel}"`
        ];

        console.log('Starting SLURM job:', jobCommand.join(' '));
        const sshJob = spawn('ssh', jobCommand);
        sshJob.stdout.on('data', d => console.log(`sbatch stdout: ${d}`));
        sshJob.stderr.on('data', d => console.error(`sbatch stderr: ${d}`));
        sshJob.on('close', code => {
          if (code === 0) {
            console.log('SLURM job submitted.');
            resolve();
          } else {
            reject(new Error(`SLURM sbatch failed with code ${code}`));
          }
        });
      });

      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn('Fehler beim Löschen der Datei:', err);
      }

      return null;

    } catch (err) {
      console.error('Fehler in onNewPDFUpload:', err);
      return null;
    }
  });



//Trigger-Funktion
exports.onNewPDFTrigger = functions
  .region('us-central1')
  .storage
  .bucket('edukit-tp.firebasestorage.app')
  .object()
  .onFinalize((object) => {
    if (object.contentType !== 'application/pdf') return;
    console.log('Neue PDF hochgeladen:', object.name);
    return null;
  });

