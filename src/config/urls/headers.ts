import { envs } from "../envs/envs";

export const header= {
    Authorization: `Bearer ${envs.GRAPH_API_TOKEN}`,
  };

