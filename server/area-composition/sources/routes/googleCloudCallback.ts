import {
  createGoogleMailHistory,
  fetchGmailHistory,
  fetchGmailMessage,
  fetchGoogleMailHistory,
  handleGmailMessage,
  handleHistoryList,
  updateGoogleMailHistory,
} from "../controller/googleMailController";
import type { Route } from "../types";
import { z } from "zod";

const schema = z.any();

const access_token =
  "ya29.a0AeDClZCXVG9Y9qzhDXfkZJrf7I00YKNB21mwcEaEsJaz06hDr2XbP-jRfY0jKS_5SW-7yM5ogr-yXYDlvFmHHC7uE64EZEOEQuVX5Ramg-fMJgnW83DEej2FLEE1ufQVgC_rqtD3DU8MQh1Vzt0DiLfi7aV-uNHW6Pe_TLOEaCgYKAXoSARMSFQHGX2MiVcqFk-V7ENL00XkWTX0RjQ0175";

const route: Route<typeof schema> = {
  path: "/callback/gmail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const body = await request.json();
      const data = JSON.parse(
        Buffer.from(body.message.data, "base64").toString("utf-8"),
      );
      console.log("data", data);
      const { emailAddress: email, historyId: history_id } = data;
      console.log("emailAddress", email, "historyId", history_id);
      const old_history_id = await fetchGoogleMailHistory(email);
      const start_history_id = (old_history_id != "")
        ? old_history_id
        : history_id;

      const history = await fetchGmailHistory(access_token, start_history_id);
      const { history_id: new_history_id, message_id } =
        await handleHistoryList(history);
      console.log("historyId", new_history_id, "messages", message_id);
      if (message_id != "") {
        const message = await fetchGmailMessage(access_token, message_id);
        handleGmailMessage(message);
      }
      if (old_history_id == "") {
        createGoogleMailHistory(email, new_history_id);
      } else {
        updateGoogleMailHistory(email, new_history_id);
      }
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Gmail callback error", error);
      return new Response("OK", { status: 200 });
    }
  },
};

export default route;
