// ---------------------------------------------------------------------------
// SERVICES — BARREL EXPORT
// Clean single-import point for all service modules.
//
// Usage:
//   import { authService, profileService, venueService } from '../services';
// ---------------------------------------------------------------------------

import * as authService from './gateway/authService';
import * as apiClient from './gateway/apiClient';

import * as profileService from './player/profileService';
import * as matchingService from './player/matchingService';
import * as chatService from './player/chatService';

import * as venueService from './venue/venueService';
import * as slotService from './venue/slotService';
import * as bookingService from './venue/bookingService';

import * as notificationService from './external/notificationService';
import * as mapsService from './external/mapsService';
import * as paymentService from './external/paymentService';

export {
  // Gateway
  authService,
  apiClient,
  // Player services
  profileService,
  matchingService,
  chatService,
  // Venue services
  venueService,
  slotService,
  bookingService,
  // External services
  notificationService,
  mapsService,
  paymentService,
};
