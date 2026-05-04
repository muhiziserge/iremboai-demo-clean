/**
 * Domain models for the IremboAI chatbot demo.
 *
 * Kept intentionally small — this is a UX prototype, not a backend.
 */

export type Author = 'user' | 'bot';

/** Stable kinds that map to bubble renderers in the modal. */
export type MessageKind =
  | 'text'                // plain text bubble
  | 'category-prompt'     // bot asks for license category, with chip choices
  | 'district-prompt'     // bot asks for district
  | 'slot-results'        // bot returns the inline form + slot list
  | 'confirmation';       // bot confirms a booked slot

export interface BaseMessage {
  id: string;
  author: Author;
  kind: MessageKind;
  text?: string;
}

export interface SlotResultsMessage extends BaseMessage {
  kind: 'slot-results';
  category: string;
  district: string;
  slots: Slot[];
}

export interface ConfirmationMessage extends BaseMessage {
  kind: 'confirmation';
  slot: Slot;
}

export type ChatMessage = BaseMessage | SlotResultsMessage | ConfirmationMessage;

export interface Slot {
  id: string;
  date: string;            // dd-mm-yyyy
  center: string;
  timeRange: string;       // e.g. "7:00 AM - 9:00 AM"
  seats: number;
}

export const LICENSE_CATEGORIES = ['A', 'B', 'C', 'D'] as const;
export type LicenseCategory = (typeof LICENSE_CATEGORIES)[number];

export const KIGALI_DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge'] as const;
export type District = (typeof KIGALI_DISTRICTS)[number];
