# WhatsApp Embedded Signup Coexistence Implementation

This document describes the implementation of WhatsApp Embedded Signup "Coexistence" support, which allows businesses to use both WhatsApp Business app and Cloud API simultaneously while keeping messaging history synchronized.

## Overview

The implementation adds support for three key Coexistence webhook events:

1. **`history`** - Syncs past messages the business has sent/received
2. **`smb_app_state_sync`** - Syncs the business's contacts (adds/edits/removes)
3. **`smb_message_echoes`** - Mirrors new messages sent via WhatsApp Business app

## Changes Made

### 1. Parsing Utilities (`lib/whatsapp/parsing.ts`)

Added comprehensive parsing functions and type definitions:

#### New Type Definitions

- **`ParsedHistoricalMessage`** - Represents a historical message from chat history
- **`ParsedHistoryEvent`** - Container for historical messages sync event
- **`ParsedContact`** - Represents a contact add/edit/remove action
- **`ParsedAppStateSync`** - Container for contact sync events
- **`ParsedMessageEcho`** - Represents a message sent by business via WhatsApp Business app

#### New Type Guards

- **`isHistoryEvent()`** - Detects history sync webhooks
- **`isAppStateSyncEvent()`** - Detects contact sync webhooks
- **`isMessageEchoEvent()`** - Detects message echo webhooks

#### New Parsers

- **`parseHistoryEvent()`** - Parses historical messages and handles declined sharing
- **`parseAppStateSyncEvent()`** - Parses contact additions/updates/removals
- **`parseMessageEchoEvent()`** - Parses messages sent via WhatsApp Business app

### 2. Webhook Handler (`pages/api/integracao/whatsapp/index.ts`)

Added three new event handlers that:

#### History Event Handler
- Detects if business declined history sharing (shows error)
- Processes historical messages (up to last 6 months)
- Downloads and stores media from historical messages
- Creates or finds clients for each conversation
- Determines message direction (business → customer or customer → business)
- Creates messages in Convex with proper author attribution

#### Contact Sync Handler
- Processes contact additions and updates
- Creates new clients when contacts are added in WhatsApp Business app
- Updates existing client names when contacts are edited
- Logs when contacts are removed (can be extended to mark as deleted)

#### Message Echo Handler
- Mirrors messages sent by business via WhatsApp Business app
- Creates or finds the customer (recipient)
- Downloads and stores media if present
- Creates message in Convex with special author ID: `"BUSINESS_APP_USER"`
- Keeps conversations synchronized between app and API

## How It Works

### Flow 1: Business Onboards with History Sharing

```
1. Business completes Embedded Signup flow
2. WhatsApp sends `history` webhook with all messages from last 6 months
3. Your webhook handler:
   - Parses all historical messages
   - Downloads any media (images, documents, etc.)
   - Creates client records for all contacts
   - Stores all messages in Convex
   - Properly attributes messages to business or customer
```

### Flow 2: Business Updates Contacts in WhatsApp Business App

```
1. Business adds/edits/removes contact in WhatsApp Business app
2. WhatsApp sends `smb_app_state_sync` webhook
3. Your webhook handler:
   - Creates new client if contact was added
   - Updates client name if contact was edited
   - Logs removal if contact was deleted
```

### Flow 3: Business Sends Message via WhatsApp Business App

```
1. Business sends message to customer using WhatsApp Business app
2. WhatsApp sends `smb_message_echoes` webhook
3. Your webhook handler:
   - Downloads media if message includes it
   - Creates/finds customer record
   - Stores message in Convex with author: "BUSINESS_APP_USER"
   - Message appears in your app's conversation view
```

## Key Features

### ✅ Comprehensive Message Support
- Text messages
- Images (with captions)
- Documents (with filenames)
- Audio messages
- Video messages
- Stickers

### ✅ Media Handling
- Automatic media download from WhatsApp
- Storage in Convex
- Proper MIME type and filename preservation

### ✅ Proper Attribution
- Historical messages correctly identify sender (business or customer)
- Message echoes tagged with `"BUSINESS_APP_USER"` author
- Regular incoming messages tagged as from client

### ✅ Client Management
- Auto-creates clients from historical conversations
- Syncs contact information from WhatsApp Business app
- Updates client names when contacts are edited

### ✅ Error Handling
- Gracefully handles declined history sharing
- Logs errors without blocking webhook processing
- Always returns 200 OK to prevent WhatsApp retries

## Important Considerations

### 1. Author IDs for Coexistence Messages

When messages come from the WhatsApp Business app, they use special author IDs:
- **`"BUSINESS_APP_USER"`** - For messages sent by business via WhatsApp Business app

This allows you to distinguish between:
- Messages sent via your web app (have real user IDs)
- Messages sent via WhatsApp Business app (use `BUSINESS_APP_USER`)

### 2. Throughput Limitation

⚠️ **Important:** Phone numbers in Coexistence mode have a fixed throughput of **20 messages per second (mps)** to remain compatible with WhatsApp Business app.

### 3. Unsupported Features

The following WhatsApp Business app features are **NOT** synced:
- Group chats
- Disappearing messages (automatically disabled)
- View once messages (automatically disabled)
- Live location messages (automatically disabled)
- Broadcast lists (become read-only)
- Voice/video calls
- Business tools (catalog, orders, status)
- Quick replies and labels

### 4. Message History Limitations

- Only messages from the **last 6 months** are synced
- History sharing requires user consent (can be declined)
- If declined, you'll receive an error webhook but no messages

### 5. Linked Devices

When a business onboards with Coexistence:
- All companion devices are initially unlinked
- They can be re-linked after onboarding
- WhatsApp for Windows and WearOS are **not supported**

## Webhook Subscription Requirements

To use Coexistence features, subscribe to these webhook fields in your Meta App Dashboard:

1. **`history`** - For historical message sync
2. **`smb_app_state_sync`** - For contact sync
3. **`smb_message_echoes`** - For message echo sync

Already subscribed:
- ✅ `messages` - Incoming messages
- ✅ `message_template_status_update` - Template approvals
- ✅ `message_template_quality_update` - Template quality changes

## Testing

To test the implementation:

1. **Enable Coexistence in Embedded Signup**
   - Configure Embedded Signup for Coexistence mode
   - Launch signup flow with a WhatsApp Business app account

2. **Test History Sync**
   - Onboard a business with existing message history
   - Check webhook logs for `[COEXISTENCE] Handling history sync event`
   - Verify messages appear in your app

3. **Test Contact Sync**
   - Add/edit a contact in WhatsApp Business app
   - Check webhook logs for `[COEXISTENCE] Handling contact sync event`
   - Verify client record is created/updated

4. **Test Message Echo**
   - Send a message from WhatsApp Business app to a customer
   - Check webhook logs for `[COEXISTENCE] Handling message echo event`
   - Verify message appears in your app with `BUSINESS_APP_USER` author

## Logging

All Coexistence events include detailed logging with the `[COEXISTENCE]` prefix:

```
[INFO] [WHATSAPP_WEBHOOK] [COEXISTENCE] Handling history sync event
[WHATSAPP_WEBHOOK] [COEXISTENCE] Processing 25 historical messages
[WHATSAPP_WEBHOOK] [COEXISTENCE] Historical message created: wamid.xxx
[WHATSAPP_WEBHOOK] [COEXISTENCE] Finished processing historical messages
```

## Reference Documentation

For complete details, see the official WhatsApp documentation:
https://developers.facebook.com/docs/whatsapp/embedded-signup/custom-flows/onboarding-business-app-users/

## Support

The implementation follows Meta's best practices:
- Returns 200 OK within 20 seconds for all webhooks
- Handles errors gracefully without blocking
- Logs all actions for debugging
- Validates webhook structures before processing

## Next Steps

Consider implementing:
1. User assignment for `BUSINESS_APP_USER` messages (map to specific team member)
2. UI indicator showing which messages came from WhatsApp Business app vs web app
3. Contact merge/deduplication logic if needed
4. Metrics tracking for Coexistence usage
5. Admin panel to view Coexistence status per phone number

