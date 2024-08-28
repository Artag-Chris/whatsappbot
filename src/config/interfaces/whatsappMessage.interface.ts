//class de un mensaje de whatsapp
export interface IncommingWhatsappMessage {
    object: string;
    entry:  Entry[];
}

interface Entry {
    id:      string;
    changes: Change[];
}

interface Change {
    value: Value;
    field: string;
}

interface Value {
    messaging_product: string;
    metadata:          Metadata;
    messages:          Messages[];
}

interface Metadata {
    display_phone_number: string;
    phone_number_id:      string;
}

interface Messages {
    id:           string;
    type:       string;
    timestamp:    string;
    from: string;
    conversation: Conversation;
    pricing:      Pricing;
}

interface Conversation {
    id:     string;
    origin: Origin;
}

interface Origin {
    type: string;
}
interface Pricing {
    billable:      boolean;
    pricing_model: string;
    category:      string;
}
