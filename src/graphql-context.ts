export interface GqlContext {
  req: Request & { tenantId: string; user?: any };
}
