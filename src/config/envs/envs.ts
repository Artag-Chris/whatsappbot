import "dotenv/config";
import {get} from "env-var"

export const envs={
    PORT:get('PORT').required().asPortNumber(),
    WEBHOOK_VERIFY_TOKEN:get('WEBHOOK_VERIFY_TOKEN').required().asString(),
    GRAPH_API_TOKEN:get('GRAPH_API_TOKEN').required().asString(),

}
  