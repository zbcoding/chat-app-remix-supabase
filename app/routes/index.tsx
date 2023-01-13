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
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [], session }, { headers: response.headers });
}


export default function Index() {
  const { messages, session } = useLoaderData<typeof loader>();
  const dataObject = JSON.stringify(messages, null, 2);
  return (
    <>
      <Login/>
      <p>While logged in users can read messages, only allowlisted users can write messages.</p>
      <RealtimeMessages serverMessages={messages}/>
      
      {session?.access_token && 
      <Form method="post" autoComplete="off" >
        <input type="text" name="message"></input>
        <button type="submit">Send</button>
      </Form>}
    </>
  );
}
