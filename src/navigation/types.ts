export type RootStackParamList = {
  Tabs: undefined;
  ProfessionDetail: { professionId: string };
};

export type TabParamList = {
  Home: undefined;
  Assistant: { professionId?: string } | undefined;
};
