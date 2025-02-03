import { JSX } from "solid-js";

/**
 * Represents an AuthProvider record.
 */
export interface AuthProvider {
  id: number;
  apid: string;
  user_id: number;
  provider_name: string;
  provider_user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Card record.
 */
export interface Card {
  id: number;
  cid: string;
  note_id: number;
  card_template_id: number;
  due_date: string | null;
  stability: number | null;
  difficulty: number | null;
  interval: number | null;
  status: string | null;
  reps: number | null;
  lapses: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a CardTemplate record.
 */
export interface CardTemplate {
  id: number;
  template_name: string;
  front_html: string;
  back_html: string;
  css: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Deck record.
 */
export interface Deck {
  id: number;
  deck_name: string;
  deck_description: string | null;
  card_count: number;
}

/**
 * Represents a DeckCollaborator record.
 */
export interface DeckCollaborator {
  id: number;
  dcid: string;
  deck_id: number;
  user_id: number;
  role: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Migration record.
 */
export interface Migration {
  id: number;
  mid: string;
  count: number | null;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Note record.
 */
export interface Note {
  id: number;
  nid: string;
  deck_id: number;
  note_type_id: number;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a NoteField record.
 */
export interface NoteField {
  id: number;
  nfid: string;
  note_id: number;
  field_name: string;
  field_content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a NoteType record.
 */
export interface NoteType {
  id: number;
  ntid: string;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Rating record.
 */
export interface Rating {
  id: number;
  rid: string;
  name: string;
}

/**
 * Represents a Review record.
 */
export interface Review {
  id: number;
  rid: string;
  card_id: number;
  review_time: string;
  rating_id: number | null;
  review_seconds: number | null;
  new_interval: number | null;
  new_stability: number | null;
  new_difficulty: number | null;
  new_due_date: string | null;
  session_id: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Session record.
 */
export interface Session {
  id: number;
  sid: string;
  user_id: number;
  mode: string | null;
  name: string | null;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  session_deck_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a SessionCard record.
 */
export interface SessionCard {
  id: number;
  scid: string;
  session_id: number;
  card_id: number;
  status: string | null;
  next_cram_due: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a SessionDeck record.
 */
export interface SessionDeck {
  id: number;
  sdid: string;
  session_id: number;
  deck_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Team record.
 */
export interface Team {
  id: number;
  tid: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a TeamMember record.
 */
export interface TeamMember {
  id: number;
  tmid: string;
  team_id: number;
  user_id: number;
  role: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a User record.
 */
export interface User {
  id: number;
  uid: string;
  email: string | null;
  password_hash: string | null;
  display_name: string | null;
  is_verified: boolean;
  created_at: string;
}

export type NullableFloat64 = {
  Float64: number;
  Valid: boolean;
};

export type NullableString = {
  String: string;
  Valid: boolean;
};

export type NullableInt64 = {
  Int64: number;
  Valid: boolean;
};

export type NullableDateTime = {
  Time: string;
  Valid: boolean;
};

export type DeckType = "Owned" | "Shared" | "All";

export interface CardDetails {
  card_id: string;
  due_date: string;
  stability: number;
  difficulty: number;
  interval: number;
  status: string;
  reps: number;
  lapses: number;
  created_at: string;
  updated_at: string;
  template_name: string;
  front_html: string;
  back_html: string;
  css: string;
  // Note details
  note_id: string;
  note_name: string;
  note_description: string;
  note_type_id: string;
  note_type_name: string;
  note_field_id: string;
  front_content: string;
  back_content: string;
}

export type FieldType = {
  id: string;
  logo: (props: any) => JSX.Element;
  label: string;
};

/** 
 * Each field has:
 * - a unique ID
 * - a name (shown in the text input)
 * - whether the gear menu is open or not
 */
export type TField = {
  id: number;
  name: string;
  type: FieldType;
  gearMenuOpen?: boolean;
};



