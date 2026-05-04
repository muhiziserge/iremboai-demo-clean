import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ask-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="fab"
      (click)="clicked.emit()"
      aria-label="Ask IremboAI"
    >
      <span class="fab-icon" aria-hidden="true">
        <!-- Smiling assistant icon -->
        <svg viewBox="0 0 24 24" width="22" height="22">
          <circle cx="12" cy="12" r="11" fill="#fff" />
          <circle cx="12" cy="12" r="11" fill="none" stroke="#0063cf" stroke-width="2" stroke-dasharray="40 14" stroke-linecap="round" transform="rotate(-50 12 12)" />
          <circle cx="9" cy="11" r="1.4" fill="#0063cf" />
          <circle cx="15" cy="11" r="1.4" fill="#0063cf" />
          <path d="M9 14.5q3 2 6 0" stroke="#0063cf" stroke-width="1.6" fill="none" stroke-linecap="round" />
        </svg>
      </span>
      <span class="fab-label">Ask IremboAI</span>
    </button>
  `,
  styles: [`
    .fab {
      position: fixed;
      left: 25px;
      bottom: 32px;
      height: 54px;
      padding: 0 18px 0 12px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(258deg, #0063cf 6%, #0097e7 98%);
      border: 2px solid var(--accent-yellow);
      color: #fff;
      border-radius: 32px;
      box-shadow: var(--shadow-fab);
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 16px;
      z-index: 50;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(0, 99, 207, 0.45);
    }

    .fab:active { transform: translateY(0); }

    .fab-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }

    .fab-label {
      letter-spacing: -0.1px;
    }

    .fab[hidden] { display: none; }

    @media (max-width: 600px) {
      .fab { bottom: 16px; left: 16px; }
    }
  `]
})
export class AskButtonComponent {
  @Output() clicked = new EventEmitter<void>();
}
