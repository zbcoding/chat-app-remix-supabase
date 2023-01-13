import { Form, useLoaderData } from "@remix-run/react";
import createServerSupabase from "utils/supabase.server";

import Login from "components/login";

import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import RealtimeMessages from "components/realtime-messages";

export const action = async ({request}: ActionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({request, response});
  const {message} = Object.fromEntries(await request.formData()); 
  //key-value for diff form inputs
  const {error} = await supabase.from('messages').insert({content: String(message)})
  if (error) {
    console.error(error);
  }
  return json(null, { headers: response.headers })
}

export const loader = async ({request}: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({request, response});
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [] }, { headers: response.headers });
}


export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  const dataObject = JSON.stringify(messages, null, 2);
  return (
    <>
      <Login/>
      <RealtimeMessages serverMessages={messages}/>
      <Form method="post">
        <input type="text" name="message"></input>
        <button type="submit">Send</button>
      </Form>
    </>
  );
}
