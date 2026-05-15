export const crmActions = {
  selectLead(id: string) {
    return { type: 'crm/select-lead', payload: id } as const;
  },
};
