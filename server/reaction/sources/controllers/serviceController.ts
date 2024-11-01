import { host } from "../utils";

/**
 * Get a service subcription from service management service
 * This should always return an a service subscription object where the access token is valid
 * @param service
 * @param user_id
 * @returns
 */
export const getServiceSubscription = async (
  service: string,
  user_id: number,
) => {
  const response = await fetch(
    host("SERVICE_MANAGEMENT", "/auth/get-service-subscription"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service,
        user_id,
      }),
    },
  );
  if (!response.ok) {
    console.log(
      "Failed to retrieve service subscription: ",
      await response.text(),
    );
    return undefined;
  } else {
    const serviceSubscription = await response.json();
    return serviceSubscription;
  }
};

// deno-fmt-ignore
export const createFileInDrive = async (access_token: string, file_name: any, file_content: any) => {
    const boundary = 'foo_bar_baz';
    const metadata = {
        name: file_name,
        mimeType: 'application/vnd.google-apps.document'
    };

    const body = `
--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(metadata)}
--${boundary}
Content-Type: text/plain

${file_content}
--${boundary}--`;

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: body
    });
    if (response.ok) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
        console.log('Failed to create file in drive: ', response);
        console.log("Access token: ", access_token);
        return new Response(JSON.stringify({ success: false }), { status: 500 });
    }
};
