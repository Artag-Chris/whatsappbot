import "dotenv/config";
import {get} from "env-var"

export const envs={
    PORT:get('PORT').required().asPortNumber(),
    WEBHOOK_VERIFY_TOKEN:get('WEBHOOK_VERIFY_TOKEN').required().asString(),
    GRAPH_API_TOKEN:get('GRAPH_API_TOKEN').required().asString(),
    Version:get('Version').required().asString(),
    URLCREATEMESSAGE:get('URLCREATEMESSAGE').required().asString(),
    URLCREATENEWUSER:get('URLCREATENEWUSER').required().asString(),
    URLIMAGEROUTE:get('URLIMAGEROUTE').required().asString(),
    URLAUDIOROUTE:get('URLAUDIOROUTE').required().asString(),
    URLVIDEOROUTE:get('URLVIDEOROUTE').required().asString(),
    URLDOCROUTE:get('URLDOCROUTE').required().asString(),
    WABA_ID:get('WABA_ID').required().asString(),
    URL_BASE:get('URL_BASE').required().asString(), 
}
  