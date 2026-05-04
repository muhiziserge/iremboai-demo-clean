import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ChatMessage,
  ConfirmationMessage,
  KIGALI_DISTRICTS,
  LICENSE_CATEGORIES,
  LicenseCategory,
  Slot,
  SlotResultsMessage,
  District
} from './chat.types';
import { SlotService } from './slot.service';

let msgIdCounter = 0;
const newId = () => `m_${++msgIdCounter}`;

/**
 * Chatbot modal — drives the slot-booking conversation flow.
 *
 * Flow (matches the V1 "Guided" pattern from the Figma file, with the
 * V2 inline slot list shown after both filters are collected):
 *
 *   user: "I want to view available driving test slots." (seeded)
 *   bot:  intro + asks for license category (chip choices)
 *   user: picks category
 *   bot:  asks for district (chip choices)
 *   user: picks district
 *   bot:  shows slot list inline
 *   user: picks a slot
 *   bot:  confirmation
 */
@Component({
  selector: 'app-chatbot-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot-modal.component.html',
  styleUrl: './chatbot-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotModalComponent implements OnChanges, AfterViewChecked {
  @Input() open = false;
  @Input() initialPrompt = '';
  @Output() closed = new EventEmitter<void>();

  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLElement>;
  @ViewChild('chatInput') chatInput?: ElementRef<HTMLTextAreaElement>;

  private readonly slots = inject(SlotService);

  /** Conversation log. */
  readonly messages = signal<ChatMessage[]>([]);

  /** What the user is typing (or the seeded prompt). */
  readonly draft = signal<string>('');

  /** True while the bot is "thinking" — drives the typing indicator. */
  readonly thinking = signal(false);

  /** Has the user sent the seeded message yet? Used to show a hint. */
  readonly seeded = signal(false);

  /** Filters the user has chosen during the conversation. */
  private category: LicenseCategory | null = null;
  private district: District | null = null;

  readonly categories = LICENSE_CATEGORIES;
  readonly districts = KIGALI_DISTRICTS;

  private shouldScroll = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.resetIfNeeded();
      // Pre-fill the input with the seeded prompt so the user just hits send.
      if (this.initialPrompt && !this.seeded()) {
        this.draft.set(this.initialPrompt);
        // Defer focus until the modal is on-screen.
        queueMicrotask(() => this.chatInput?.nativeElement.focus());
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.scrollArea) {
      const el = this.scrollArea.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  /** Reset state when reopening after a previous session. */
  private resetIfNeeded(): void {
    if (this.messages().length === 0) {
      this.category = null;
      this.district = null;
    }
  }

  close(): void {
    this.closed.emit();
  }

  /** Send the draft message. */
  send(): void {
    const text = this.draft().trim();
    if (!text || this.thinking()) return;

    this.appendMessage({ id: newId(), author: 'user', kind: 'text', text });
    this.draft.set('');

    if (!this.seeded()) {
      this.seeded.set(true);
      this.respondToOpener();
      return;
    }

    // Free-form fallback — bot redirects to the slot flow.
    this.botReplyDelayed(() => {
      this.appendMessage({
        id: newId(),
        author: 'bot',
        kind: 'text',
        text: "I'll help you find a slot. Could you tap one of the options above to continue?"
      });
    });
  }

  /** Handle Enter (without Shift) submitting the form. */
  onInputKey(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      this.send();
    }
  }

  /** User picks a license category from chips. */
  pickCategory(cat: LicenseCategory): void {
    if (this.category) return; // already chosen
    this.category = cat;
    this.appendMessage({ id: newId(), author: 'user', kind: 'text', text: cat });
    this.botReplyDelayed(() => {
      this.appendMessage({
        id: newId(),
        author: 'bot',
        kind: 'district-prompt',
        text: `Got it — Category ${cat} 🚗\n\nWhich district works best for you?`
      });
    });
  }

  /** User picks a district from chips. */
  pickDistrict(d: District): void {
    if (this.district) return;
    this.district = d;
    this.appendMessage({ id: newId(), author: 'user', kind: 'text', text: d });
    this.botReplyDelayed(() => {
      const slots = this.slots.getSlots(this.category!, d);
      this.appendMessage({
        id: newId(),
        author: 'bot',
        kind: 'slot-results',
        category: this.category!,
        district: d,
        slots,
        text: `Found ${slots.length} slots matching:`
      } as SlotResultsMessage);
    }, 700);
  }

  /** User picks a slot from the list. */
  pickSlot(slot: Slot): void {
    this.appendMessage({
      id: newId(),
      author: 'user',
      kind: 'text',
      text: `${slot.date} · ${slot.timeRange}`
    });
    this.botReplyDelayed(() => {
      this.appendMessage({
        id: newId(),
        author: 'bot',
        kind: 'confirmation',
        slot,
        text: 'All set — your slot is reserved.'
      } as ConfirmationMessage);
    });
  }

  /** Determine the seat-badge color from the seat count. */
  seatColor(seats: number): 'low' | 'mid' | 'high' {
    if (seats <= 5) return 'low';
    if (seats >= 20) return 'high';
    return 'mid';
  }

  /** Type guards for the template. */
  asResults(m: ChatMessage): SlotResultsMessage | null {
    return m.kind === 'slot-results' ? (m as SlotResultsMessage) : null;
  }
  asConfirm(m: ChatMessage): ConfirmationMessage | null {
    return m.kind === 'confirmation' ? (m as ConfirmationMessage) : null;
  }

  /** Should the chip row be interactive for this message? */
  isLatestPrompt(m: ChatMessage): boolean {
    const last = this.messages()[this.messages().length - 1];
    return last?.id === m.id;
  }

  /** Append a message and trigger scroll. */
  private appendMessage(m: ChatMessage): void {
    this.messages.update((list) => [...list, m]);
    this.shouldScroll = true;
  }

  /**
   * The opener — bot greets and asks for category.
   * Called once after the user sends the seeded message.
   */
  private respondToOpener(): void {
    this.botReplyDelayed(() => {
      this.appendMessage({
        id: newId(),
        author: 'bot',
        kind: 'category-prompt',
        text: 'Sure! I can help you find available driving test slots.\n\nFirst, which license category are you applying for?'
      });
    });
  }

  /** Show typing indicator briefly, then run the reply. */
  private botReplyDelayed(reply: () => void, delay = 600): void {
    this.thinking.set(true);
    this.shouldScroll = true;
    setTimeout(() => {
      this.thinking.set(false);
      reply();
    }, delay);
  }

  /** Are categories still selectable in this prompt? */
  categoryUsed(): boolean { return this.category !== null; }
  districtUsed(): boolean { return this.district !== null; }
}
