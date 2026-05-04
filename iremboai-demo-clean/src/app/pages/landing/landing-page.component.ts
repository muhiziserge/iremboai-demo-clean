import { Component, signal } from '@angular/core';
import { ChatbotModalComponent } from '../../components/chatbot-modal/chatbot-modal.component';
import { AskButtonComponent } from '../../components/ask-button/ask-button.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ChatbotModalComponent, AskButtonComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  readonly chatOpen = signal(false);

  /** Open the chatbot modal seeded with the slot-booking question. */
  openChat(): void {
    this.chatOpen.set(true);
  }

  closeChat(): void {
    this.chatOpen.set(false);
  }
}
