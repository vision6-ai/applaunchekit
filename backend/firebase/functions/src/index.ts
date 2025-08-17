import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as serviceAccount from "../applaunchkit-test-firebase-adminsdk-vjk28-482e5268ee.json";

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export const sendPushNotification = onRequest(
  async (request: any, response: any) => {
    logger.info("Sending push notification");

    // Validate request body
    const { user_id, title, body } = request.body;
    if (!user_id || !title || !body) {
      logger.error("Missing required fields in request body");
      return response.status(400).json({ error: "Missing fields" });
    }

    try {
      // Query Firestore for the Expo push tokens associated with the user_id
      const tokenSnapshot = await db
        .collection("expo_tokens")
        .where("user_id", "==", user_id)
        .get();

      if (tokenSnapshot.empty) {
        logger.info("No matching documents for user_id:", user_id);
        return response.status(404).json({ error: "No tokens found" });
      }

      const expoTokens = tokenSnapshot.docs.map((doc) => doc.data().token);
      logger.info("Found Expo tokens:", expoTokens);

      // Create an array of notification messages
      const messages = expoTokens.map((token) => ({
        to: token,
        sound: "default",
        body: body,
        title: title,
      }));

      // Send POST request to Expo push notification API
      console.log(JSON.stringify(messages[0]), "hellllo");
      const fetchResponse = await fetch(
        "https://exp.host/--/api/v2/push/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
        }
      );

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      const expoResponse = await fetchResponse.json();
      logger.info("Expo API response:", expoResponse);

      // Handle any errors from the Expo API response
      if (expoResponse.errors && expoResponse.errors.length > 0) {
        logger.error("Expo API returned errors:", expoResponse.errors);
        return response
          .status(500)
          .json({ error: "Expo API error", details: expoResponse.errors });
      }

      return response.status(200).json(expoResponse);
    } catch (error) {
      logger.error("Error sending push notifications:", error);
      return response.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to send push notifications",
      });
    }
  }
);
