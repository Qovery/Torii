import { RunStatus } from "@/enums/run-status.enum";

export interface Catalog {
  slug: string;
  name: string;
  description: string;
  actions: Service[];
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  icon: string;
  icon_color: string;
  fields: Field[];
  validate: Command[];
  post_validate: Command[];
}

export interface Field {
  slug: string;
  title: string;
  description: string;
  placeholder?: string;
  type: string;
  default: string;
  required: boolean;
  autocomplete_fetcher: string;
}

export interface Command {
  command: string[];
  timeout: number | null;
  output_model?: string | null;
}

export interface ServiceRun {
  id: string;
  created_at: string;
  updated_at: string;
  section_slug: string;
  action_slug: string;
  status: RunStatus;
  input_payload: InputPayload;
  tasks: Task[];
}

export interface InputPayload {
  name: string;
}

export interface Task {
  message: null | string;
  post_validate_input: PostValidateInput;
  post_validate_output: PostValidateOutput;
  status: RunStatus;
}

export interface PostValidateInput {
  command: string[];
  timeout: number | null;
  output_model?: string | null;
}

export interface PostValidateOutput {
  execution_time_in_millis: number;
  one_liner_command: string;
  output: Record<string, any>;
}
