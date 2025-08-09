export type UserSettingsData = {
  allow_account_aliases: boolean;
  app_theme: "light" | "dark" | "system"; // puedes ajustar si hay más opciones
  app_glass_mode: boolean;
  auto_format_on_save: boolean;
  auto_save_file: boolean;
  decimal_separator: "," | "."; // puedes agregar más si es necesario
  editor_line_numbers: boolean | null;
  editor_minimap_enabled: boolean | null;
  editor_theme: "vs-dark" | "vs-light" | string; // puedes especificar más temas si los conoces
  editor_word_wrap: boolean | null;
  font_size: number;
  id: string; // UUID
  language: string; // ej. 'en', 'es'
  parent_accounts: {
    Assets: string;
    Equity: string;
    Expenses: string;
    Income: string;
    Liabilities: string;
  };
  thousands_separator: "," | "." | " ";
  time_format: "12h" | "24h";
  timezone: string;
  user_id: string; // UUID
};

export type ResponseUserSettings = {
  data: UserSettingsData;
  sucess?: boolean;
};
