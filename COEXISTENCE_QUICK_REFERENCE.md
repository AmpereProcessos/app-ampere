# WhatsApp Coexistence - Quick Reference

## 🎯 What Was Implemented

Support for businesses that use **both** WhatsApp Business app **and** Cloud API simultaneously.

## 📦 Files Modified

### 1. `lib/whatsapp/parsing.ts`
Added parsing logic for 3 new webhook event types:
- ✅ History sync (past messages)
- ✅ Contact sync (address book)
- ✅ Message echoes (messages sent via app)

### 2. `pages/api/integracao/whatsapp/index.ts`
Added webhook handlers that:
- ✅ Process historical messages (up to 6 months)
- ✅ Sync contacts from WhatsApp Business app
- ✅ Mirror messages sent via WhatsApp Business app

## 🔄 Event Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│  Business Uses WhatsApp Business App & Cloud API    │
└─────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐     ┌──────────┐    ┌──────────┐
    │History │     │ Contact  │    │ Message  │
    │ Sync   │     │  Sync    │    │  Echo    │
    └────────┘     └──────────┘    └──────────┘
         │               │               │
         ▼               ▼               ▼
    Downloads      Creates/Updates  Creates Message
    historical     client records   with BUSINESS_APP_USER
    messages                        author
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Your App Shows  │
              │ Complete History │
              └──────────────────┘
```

## 📋 Webhook Events

### Event 1: `history`
**When:** Business completes onboarding
**Contains:** Last 6 months of messages
**Handler:** Downloads media, creates clients, stores messages

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "history",
      "value": {
        "history": [{
          "conversations": [...]
        }]
      }
    }]
  }]
}
```

### Event 2: `smb_app_state_sync`
**When:** Business adds/edits/removes contact
**Contains:** Contact information
**Handler:** Creates/updates client records

```json
{
  "entry": [{
    "changes": [{
      "field": "smb_app_state_sync",
      "value": {
        "state_sync": [{
          "type": "contact",
          "action": "add",
          "contact": {
            "full_name": "John Doe",
            "phone_number": "5511999999999"
          }
        }]
      }
    }]
  }]
}
```

### Event 3: `smb_message_echoes`
**When:** Business sends message via WhatsApp Business app
**Contains:** Message sent by business
**Handler:** Downloads media, stores message with special author

```json
{
  "entry": [{
    "changes": [{
      "field": "smb_message_echoes",
      "value": {
        "message_echoes": [{
          "from": "5511888888888",
          "to": "5511999999999",
          "type": "text",
          "text": { "body": "Hello!" }
        }]
      }
    }]
  }]
}
```

## 🏷️ Author Attribution

Messages are tagged with different authors:

| Source | Author ID | Author Type |
|--------|-----------|-------------|
| Customer sends message | Client's MongoDB ID | `"cliente"` |
| User sends via your web app | User's MongoDB ID | `"usuario"` |
| User sends via WhatsApp Business app | `"BUSINESS_APP_USER"` | `"usuario"` |
| Historical message from business | `"BUSINESS_APP_USER"` | `"usuario"` |
| Historical message from customer | Client's MongoDB ID | `"cliente"` |

## ⚠️ Important Limitations

| Feature | Supported? | Note |
|---------|-----------|------|
| Text messages | ✅ Yes | Fully supported |
| Media messages | ✅ Yes | Auto-downloaded |
| Last 6 months history | ✅ Yes | Older messages not synced |
| Real-time message sync | ✅ Yes | Via message echoes |
| Contact sync | ✅ Yes | Bidirectional |
| Group chats | ❌ No | Not synchronized |
| Disappearing messages | ❌ No | Auto-disabled |
| Broadcast lists | ❌ No | Become read-only |
| Throughput | ⚠️ Limited | Max 20 mps |

## 🚀 How to Enable

### 1. Configure Embedded Signup
In your Meta App Dashboard:
1. Navigate to **WhatsApp** → **Configuration**
2. Enable **Embedded Signup**
3. Enable **Coexistence** mode
4. Subscribe to webhook fields:
   - ✅ `history`
   - ✅ `smb_app_state_sync`
   - ✅ `smb_message_echoes`

### 2. Launch Signup Flow
When a business onboards:
1. They'll see option to connect existing WhatsApp Business app
2. They scan QR code with their app
3. They choose whether to share history
4. Your webhook receives all events automatically

### 3. Monitor Webhooks
Watch logs for:
```
[INFO] [WHATSAPP_WEBHOOK] [COEXISTENCE] Handling history sync event
[WHATSAPP_WEBHOOK] [COEXISTENCE] Processing 25 historical messages
[WHATSAPP_WEBHOOK] [COEXISTENCE] Historical message created: wamid.xxx
```

## 🧪 Testing Checklist

- [ ] Configure Coexistence in Embedded Signup
- [ ] Onboard test business with WhatsApp Business app
- [ ] Verify history sync webhook received
- [ ] Check historical messages appear in your app
- [ ] Add contact in WhatsApp Business app
- [ ] Verify contact sync webhook received
- [ ] Send message via WhatsApp Business app
- [ ] Verify message echo webhook received
- [ ] Confirm message shows with `BUSINESS_APP_USER` author

## 📊 Monitoring

Key metrics to track:
- Number of Coexistence onboardings
- Historical messages synced per business
- Contacts synced per business
- Message echoes per day
- Media download success rate

## 🔍 Debugging

Common issues:

**History sharing declined**
```
[WHATSAPP_WEBHOOK] [COEXISTENCE] History sharing declined:
  errorCode: 2593109
  errorMessage: "History sync is turned off..."
```
→ User chose not to share history. This is normal.

**Media download fails**
```
[WHATSAPP_WEBHOOK] [COEXISTENCE] Error downloading media: ...
```
→ Media may have expired. Message still created without media.

**Client not found**
```
[WHATSAPP_WEBHOOK] [COEXISTENCE] Created new contact: 5511999999999
```
→ System auto-creates client records. This is normal.

## 📚 Resources

- [Official Coexistence Docs](https://developers.facebook.com/docs/whatsapp/embedded-signup/custom-flows/onboarding-business-app-users/)
- Implementation details: `COEXISTENCE_IMPLEMENTATION.md`
- Code changes:
  - `lib/whatsapp/parsing.ts` (lines 424-788)
  - `pages/api/integracao/whatsapp/index.ts` (lines 274-561)

## ✅ Implementation Complete

Your webhook now supports all Coexistence features! 🎉

