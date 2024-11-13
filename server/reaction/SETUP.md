# How to add a reaction step by step

This guide is based on that the service you have is already implemented in the
service management

## server/reaction/sources/utils.ts

Add example function near sendWebHookMap

### Step 1:

- Create your reaction logic\n;

const exampleFunction = async ( { reaction_id, view }: HookContext, ) => { const
findRequest = await fetch(host("DATABASE", "/reaction/find"), { method: "POST",
headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id:
reaction_id }), });

if (!findRequest.ok) { throw new Error("Failed to find reaction"); }

const { owner_id: user_id } = await findRequest.json(); const
findServiceSubscription = await getServiceSubscription( "service-name", user_id,
); const serviceSubscription = findServiceSubscription;

#TODO: Implement your service reaction

**** THIS IS ONLY EXAMPLE FOR THE SEND GMAIL **** const emailContext = {
access_token: serviceSubscription.data.access_token, subject:
`New Notification from ${reaction_id}`, body: view, };

const response = await googleSendEmail(emailContext); if (!response) { throw new
Error("Failed to send email"); } **** THIS IS ONLY EXAMPLE FOR THE SEND GMAIL
***** };

- Add "exampleFunction in sendWebHookMap

### Step 2:

- Create "createExampleWebhook" const createExampleWebhook = async ( _context:
  unknown, ) => { return { url: "", }; };

- Add "createExampleWebhook" in createWebHookMap

## server/reaction/sources/routes/v2/create.ts

- Add your service in the schema type: z.enum(["discord", "google-mail",
  "example-service"])

## server/area-composition/sources/routes/v2/compose.ts

- Add your service in the schema

## deno fmt and push

DONE!
