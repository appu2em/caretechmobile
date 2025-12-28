# n8n Main Router & Agency SOP

## 1. Main Router Workflow (JSON)
Save this content as `n8n-main-router.json` and import it into your n8n instance.

```json
{
  "name": "MAIN_WABA_ROUTER",
  "nodes": [
    {
      "id": 1,
      "name": "WhatsApp Inbound Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [200, 300],
      "parameters": {
        "path": "waba-inbound",
        "httpMethod": "POST",
        "responseMode": "onReceived"
      }
    },
    {
      "id": 2,
      "name": "Normalize Payload",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [400, 300],
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "name": "from",
              "value": "={{$json.entry[0].changes[0].value.messages[0].from}}",
              "type": "string"
            },
            {
              "name": "message",
              "value": "={{$json.entry[0].changes[0].value.messages[0].text.body}}",
              "type": "string"
            },
            {
              "name": "phone_number_id",
              "value": "={{$json.entry[0].changes[0].value.metadata.phone_number_id}}",
              "type": "string"
            }
          ]
        }
      }
    },
    {
      "id": 3,
      "name": "Route by Number",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [600, 300],
      "parameters": {
        "value1": "={{$json.phone_number_id}}",
        "rules": [
          {
            "operation": "equal",
            "value2": "PHONE_NUMBER_ID_SHOP_A"
          },
          {
            "operation": "equal",
            "value2": "PHONE_NUMBER_ID_RESTAURANT_B"
          },
          {
            "operation": "equal",
            "value2": "PHONE_NUMBER_ID_SALON_C"
          }
        ]
      }
    },
    {
      "id": 4,
      "name": "Run Shop Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1,
      "position": [850, 150],
      "parameters": {
        "workflowId": "SHOP_CUSTOMER_A_WABA"
      }
    },
    {
      "id": 5,
      "name": "Run Restaurant Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1,
      "position": [850, 300],
      "parameters": {
        "workflowId": "RESTAURANT_CUSTOMER_B_WABA"
      }
    },
    {
      "id": 6,
      "name": "Run Salon Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1,
      "position": [850, 450],
      "parameters": {
        "workflowId": "SALON_CUSTOMER_C_WABA"
      }
    },
    {
      "id": 7,
      "name": "Unknown Number Handler",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [850, 600]
    }
  ],
  "connections": {
    "WhatsApp Inbound Webhook": {
      "main": [[{ "node": "Normalize Payload", "type": "main", "index": 0 }]]
    },
    "Normalize Payload": {
      "main": [[{ "node": "Route by Number", "type": "main", "index": 0 }]]
    },
    "Route by Number": {
      "main": [
        [{ "node": "Run Shop Workflow", "type": "main", "index": 0 }],
        [{ "node": "Run Restaurant Workflow", "type": "main", "index": 0 }],
        [{ "node": "Run Salon Workflow", "type": "main", "index": 0 }],
        [{ "node": "Unknown Number Handler", "type": "main", "index": 0 }]
      ]
    }
  }
}
```

## 2. Restaurant Workflow Logic
**Workflow Name:** `Restaurant_Booking_Menu_[CustomerName]`
**Trigger:** Webhook (from Router)
**Check:** Keywords (Table, Booking, Menu)

### Path A: Booking
- **Input:** "Table tomorrow 7pm"
- **Action:** Check DB/Sheets for slots.
- **Reply:** "Available slots: 1. 6pm, 2. 7:30pm"
- **Confirm:** Save to DB, Send Reference #.
- **Reminder:** 24h before.

### Path B: Menu
- **Input:** "Menu"
- **Reply:** Send Menu Text/Link + CTA "Reply BOOKING".

## 3. Salon Workflow Logic
**Workflow Name:** `Salon_Appointments_[CustomerName]`
**Trigger:** Webhook (from Router)
**Check:** Service Keywords (Haircut, Massage)

### Flow
- **Selection:** "Appointment" -> Send Service List.
- **Slotting:** User picks service -> Show duration-filtered slots.
- **Booking:** Confirm -> Block Slot -> Notify Admin.

## 4. Onboarding Checklist (15-Min SOP)
**Do not share with customers.**

1. **Meta Setup (3 min):** Confirm WABA access, get `phone_number_id`.
2. **n8n Config (4 min):** Duplicate template workflow. Update variables (`phone_number_id`, `business_name`). Create DB/Sheet.
3. **Router Setup (2 min):** Add `phone_number_id` rule to Main Router Switch node in n8n.
4. **Testing (1 min):** Send "Menu", "Booking". Verify response.
5. **Go-Live:** Activate workflow. Handover number to client.
