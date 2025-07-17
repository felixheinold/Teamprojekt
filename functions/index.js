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
  await db.collection("statistics").doc(nowISO).set({ leaderboard });

  console.log("Leaderboard updated at", nowISO);
  return null;
});

