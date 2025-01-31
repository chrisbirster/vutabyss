import { lazy } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";
import { LoggedInView } from "./pages/LoggedInView";
import DashboardLayout from "./layouts/DashboardLayout";

// Generic Routes
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/LoginWithSocials"));
const Signup = lazy(() => import("./pages/Signup"));

// Decks
const ListDecks = lazy(() => import("./pages/Decks"));
const DeckDetails = lazy(() => import("./pages/CardsByDeck"));
const CreateNewDeck = lazy(() => import("./pages/NewDeck"));

// Cards
const ListCards = lazy(() => import("./pages/Cards"));
const CardDetail = lazy(() => import("./pages/Cards"));
const CreateNewCard = lazy(() => import("./pages/NewCard"));
const EditCard = lazy(() => import("./pages/Cards"));

// Card Templates
const ListCardTemplates = lazy(() => import("./pages/Templates"));
const CardTemplateDetails = lazy(() => import("./pages/TemplateDetails"));
const CreateNewCardTemplate = lazy(() => import("./pages/NewTemplate"));
const EditCardTemplate = lazy(() => import("./pages/NewCard"));

// Notes 
const ListNotes = lazy(() => import("./pages/NewCard"));
const NoteDetails = lazy(() => import("./pages/NewCard"));
const CreateNewNote = lazy(() => import("./pages/NewCard"));
const EditNote = lazy(() => import("./pages/NewCard"));


export const Routes = () => {
  return (
    <Router>
      {/* --- Unauthenticated routes --- */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* --- Authenticated routes --- */}
      <Route path="/app" component={DashboardLayout}>
        {/* --- Authenticated [General] routes --- */}
        <Route path="/" component={() => <Navigate href={"/app/library"} />} />
        <Route path="/library" component={Dashboard} />
        <Route path="/stats" component={LoggedInView} />
        <Route path="/sync" component={LoggedInView} />

        {/* --- Authenticated [Deck] routes --- */}
        <Route path="/decks" component={ListDecks} />
        <Route path="/decks/new" component={CreateNewDeck} />
        <Route path="/decks/:deckID" component={DeckDetails} />
        <Route path="/decks/:deckID/cards/new" component={CreateNewCard} />
        <Route path="/decks/:deckID/cards/:cardID" component={CardDetail} />
        <Route path="/decks/:deckID/cards/:cardID/edit" component={EditCard} />

        {/* --- Authenticated [Card] routes --- */}
        <Route path="/cards" component={ListCards} />
        <Route path="/cards/:cardID" component={ListCards} />
        <Route path="/cards/:cardID/edit" component={ListCards} />
        <Route path="/cards/:cardID/new" component={ListCards} />

        {/* --- Authenticated [Card Template] routes --- */}
        <Route path="/templates" component={ListCardTemplates} />
        <Route path="/templates/:templateID" component={CardTemplateDetails} />
        <Route path="/templates/:templateID/edit" component={EditCardTemplate} />
        <Route path="/templates/new" component={CreateNewCardTemplate} />

        {/* --- Authenticated [Note] routes --- */}
        <Route path="/notes" component={ListCards} />
        <Route path="/notes/:noteID" component={ListCards} />
        <Route path="/notes/:noteID/edit" component={ListCards} />
        <Route path="/notes/:noteID/new" component={ListCards} />

      </Route>

    </Router>
  );
};
