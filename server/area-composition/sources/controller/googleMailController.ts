import { host } from "../utils";

/**
 * Gets the stored history_id for a given email from the database.
 * @param email
 * @returns history_id as a string. If the email is not found, an empty string is returned.
 */
export const fetchGoogleMailHistory = async (
  email: string,
): Promise<string> => {
  try {
    const response = await fetch(
      host("DATABASE", "/service-management/get-google-mail"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );
    if (!response.ok) {
      return "";
    }
    const res = await response.json();
    return res.history_id;
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error("Failed to process request");
  }
};

/**
 * Updates the stored history_id for a given email in the database.
 * @param email
 * @param history_id
 * @returns true or false depending on the success of the operation.
 */
export const updateGoogleMailHistory = async (
  email: string,
  history_id: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      host("DATABASE", "/service-management/update-google-mail"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          history_id,
        }),
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error("Failed to process request");
  }
};

/**
 * Creates a new record in the database with the given email and history_id.
 * @param email
 * @param history_id
 * @returns true or false depending on the success of the operation.
 */
export const createGoogleMailHistory = async (
  email: string,
  history_id: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      host("DATABASE", "/service-management/create-google-mail"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          history_id,
        }),
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error("Failed to process request");
  }
};

export const fetchGmailHistory = async (
  access_token: string,
  start_history_id: string,
) => {
  const url =
    `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${start_history_id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Gmail history: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch Gmail history:", error);
    throw error;
  }
};

export const handleHistoryList = async (history: any) => {
  const history_id = history.historyId;
  let message_id = "";
  try {
    if (history.history && history.history.length > 0) {
      for (const entry of history.history) {
        if (entry.messagesAdded && entry.messagesAdded.length > 0) {
          message_id = entry.messagesAdded[0].message.id;
          break;
        }
      }
    }
    return { history_id, message_id };
  } catch (error) {
    return { history_id, message_id };
  }
};

export const fetchGmailMessage = async (
  accessToken: string,
  messageId: string,
) => {
  const url =
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Gmail message: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Gmail message:", error);
    throw error;
  }
};

export const handleGmailMessage = async (message: any) => {
  try {
    const subjectHeader = message.payload.headers.find((
      header: { name: string },
    ) => header.name === "Subject");

    if (subjectHeader) {
      console.log("Email Subject:", subjectHeader.value);
    } else {
      console.log("Subject header not found in the email.");
    }
  } catch (error) {
    console.error("Failed to process Gmail message:", error);
    throw error;
  }
};
