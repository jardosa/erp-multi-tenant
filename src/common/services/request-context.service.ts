import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private readonly store = new Map<string, any>();

  set<T = any>(key: string, value: T) {
    this.store.set(key, value);
  }

  get<T = any>(key: string): T {
    return this.store.get(key);
  }
}
