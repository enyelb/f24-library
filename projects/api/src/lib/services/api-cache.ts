import { Observable, of } from "rxjs";

/**
 * F24APICache
 */
export class F24APICache {

  /**
   * set
   * @param cache 
   * @param key 
   * @param data 
   */
  public static set(cache: { [key:string] : any }, key: string, data: any) : void {
    cache[key] = data;
  }

  /**
   * set
   * @param cache 
   * @param key 
   * @param data 
   */
  public static get(cache: { [key:string] : any }, key: string) : any | undefined {
    return cache[key];
  }

  /**
   * api
   * @param cache 
   * @param key 
   * @param api 
   * @returns 
   */
  public static api<Generic>(cache: { [key:string] : any }, key: string | undefined, api: (() => Observable<Generic>)) : Observable<Generic> {
    if (key) {
      const chace = F24APICache.get(cache, key);
      if (chace) {
        return of(chace);
      }
    }
    const observable = api();
    if (key) {
      observable.subscribe(data => {
        if (key) {
          F24APICache.set(cache, key, data);
        }
        return data;
      });
    }

    return observable;
  }
}
