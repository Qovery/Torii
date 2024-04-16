export type Catalog = {
  slug: string;
  name: string;
  description: string;
  actions: Service[];
};

export type Service = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  icon_color: string;
  fields: Field[];
  validate: Command[];
  post_validate: Command[];
};

export type Field = {
  slug: string;
  title: string;
  description: string;
  placeholder?: string;
  type: string;
  default: string;
  required: boolean;
  autocomplete_fetcher: string;
};

export type Command = {
  command: string[];
  timeout: number | null;
  output_model?: string | null;
};
