import { Injectable } from '@angular/core';
import type { District, LicenseCategory, Slot } from './chat.types';

/**
 * Mock service returning driving-test slots.
 *
 * The data mirrors the example slots shown in the Figma reference UI
 * (Kanombe – Rubirizi test center, dates in early May 2026).
 */
@Injectable({ providedIn: 'root' })
export class SlotService {
  /** Return slots for the given filters. The dataset is deterministic. */
  getSlots(_category: LicenseCategory, district: District): Slot[] {
    // The actual data doesn't change with category/district in this demo,
    // but the function shape mirrors what a real API would look like.
    const centerByDistrict: Record<District, string> = {
      Gasabo: 'KANOMBE - RUBIRIZI (GAS)',
      Kicukiro: 'KICUKIRO - GAHANGA (KCK)',
      Nyarugenge: 'NYARUGENGE - GITEGA (NYG)'
    };
    const center = centerByDistrict[district];

    return [
      { id: 's1', date: '05-05-2026', center, timeRange: '7:00 AM - 9:00 AM', seats: 3 },
      { id: 's2', date: '06-05-2026', center, timeRange: '7:00 AM - 9:00 AM', seats: 19 },
      { id: 's3', date: '07-05-2026', center, timeRange: '7:00 AM - 9:00 AM', seats: 20 },
      { id: 's4', date: '08-05-2026', center, timeRange: '7:00 AM - 9:00 AM', seats: 19 },
      { id: 's5', date: '11-05-2026', center, timeRange: '7:00 AM - 9:00 AM', seats: 15 }
    ];
  }
}
