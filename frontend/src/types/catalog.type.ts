export type Catalog = {
  slug: string;
  name: string;
  description: string;
  services: Service[];
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
  placeholder: string | null;
  type: string;
  default: string | null;
  required: boolean | null;
  autocomplete_fetcher: string | null;
};

export type Command = {
  command: string[];
  timeout: number | null;
  output_model?: string | null;
};
