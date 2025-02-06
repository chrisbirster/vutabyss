import { action, redirect } from "@solidjs/router";

export const routes = {
  authLogin: "/auth/login",
  authLogout: "/auth/logout",
  authSignup: "/auth/signup",
  apiMe: "/api/me",
  apiDecks: "/api/decks",
  apiResources: "/api/resource",
  apiTemplates: "/api/templates",
  apiTemplateByID: "/api/templates/:templateID",
  apiCardsByDeck: "/api/decks/:deckID/cards",
  appCreateNewCards: "/app/decks/:deckID/cards/new",
}

const getFetch = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Error in response: ${err}`);
  } else {
    const result = await response.json();
    return result;
  }
}

const postFetch = async (url: string, data: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Unknown error occurred');
  }
  const results = await response.json();
  return results;
}

export const login = action(async (fd: FormData) => {
  try {
    const email = String(fd.get("email"))
    const password = String(fd.get("password"))
    const response = await postFetch(routes.authLogin, JSON.stringify({ email, password }))
    console.log(response)
    return redirect("/app")
  } catch (error) {
    throw new Error(`Error during login: ${error}`);
  }
});

export const createUser = action(async (fd: FormData) => {
  try {
    const email = String(fd.get("email"))
    const password = String(fd.get("password"))
    const response = await postFetch(routes.authSignup, JSON.stringify({ email, password }))
    console.log(response)
    return redirect("/app")
  } catch (error) {
    throw new Error(`Error creating account: ${error}`);
  }
});

export const getDecks = async () => {
  try {
    const response = await getFetch(routes.apiDecks)
    return response;
  } catch (err) {
    throw new Error(`Error fetching decks: ${err}`);
  }
}

export const createDeck = action(async (fd: FormData) => {
  try {
    // get form values
    const name = String(fd.get("name"));
    const description = String(fd.get("description"));

    // send request
    const data = JSON.stringify({ name, description });
    const response = await postFetch(routes.apiDecks, data);
    if (response.deck_id) {

      const url = routes.appCreateNewCards.replace(":deckID", response.deck_id)
      return redirect(url);
    } else {
      return new Error("Invalid response from server");
    }
  } catch (error) {
    return new Error(`Error creating account: ${error}`);
  }
});

export const getDashboard = async () => {
  try {
    const response = await getFetch(routes.apiResources)
    return response;
  } catch (err) {
    throw new Error(`Error fetching resources: ${err}`);
  }
}

export const getCardsByDeck = async (deckID: string) => {
  try {
    const url = routes.apiCardsByDeck.replace(":deckID", deckID)
    const response = await getFetch(url)
    return response
  } catch (err) {
    throw new Error(`Error fetching cards for deck: ${err}`);
  }
}

export const getTemplates = async () => {
  try {
    const response = await getFetch(routes.apiTemplates)
    return response;
  } catch (err) {
    throw new Error(`Error fetching resources: ${err}`);
  }
}

export const getTemplateByID = async (templateID: string) => {
  try {
    const url = routes.apiTemplateByID.replace(":templateID", templateID);
    const response = await getFetch(url)
    return response;
  } catch (err) {
    throw new Error(`Error fetching resources: ${err}`);
  }
}

export const createTemplate = action(async (fd: FormData) => {
  // TODO: get generated template from submission
  const templateName = String(fd.get("templateName"))
  const templateDescription = String(fd.get("templateDescription"))

  // dynamic field data, pattern [field-<id>-name]
  const dynamicFields: { key: string; name: string }[] = [];
  for (const [key, value] of fd.entries()) {
    if (key.startsWith("field-") && key.endsWith("-name")) {
      dynamicFields.push({
        key,
        name: String(value),
      });
    }
  }
  console.log("createTemplate data: ", { templateName, templateDescription })
});
