/**
 * FilterStorage
 */
export class FilterStorage {
  /**
   * storage
   */
  public static get(id: string | null | undefined): any {
    /**
     * obtener los filtros guardados en local storage
     */
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
    /**
     * validar si el id existe en los filtros y guardar los filtros
     */
    if (id && id in filters) {
      return filters[id];
    }
    return null;
  }
  /**
   * storage
   */
  public static set(id: string | null | undefined, value: any) {
    /**
     * obtener los filtros guardados en local storage
     */
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
    /**
     * validar si el id existe en los filtros y guardar los filtros
     */
    if (id) {
      if (value instanceof Array && value.length === 0) {
        delete filters[id];
      } else if (value) {
        filters[id] = value;
      } else {
        delete filters[id];
      } 
      localStorage.setItem("filters", JSON.stringify(filters));
    }
  }
}