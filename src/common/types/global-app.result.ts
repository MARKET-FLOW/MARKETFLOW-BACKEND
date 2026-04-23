export abstract class GlobalAppResult<T> {
  protected readonly _data: T | null;
  protected readonly _error: string | null;

  constructor(data: T | null = null, error: string | null = null) {
    if (data !== null && error !== null) {
      throw new Error(
        'Une réponse ne peut pas contenir à la fois des données et une erreur.',
      );
    }
    if (data === null && error === null) {
      throw new Error(
        'Une réponse doit contenir soit des données, soit une erreur.',
      );
    }

    this._data = data;
    this._error = error;
  }

  /**
   * Vérifie si la réponse est un succès.
   */
  get isSuccess(): boolean {
    return this._data !== null;
  }

  /**
   * Vérifie si la réponse est une erreur.
   */
  get isError(): boolean {
    return this._error !== null;
  }

  /**
   * Retourne les données de succès.
   * @throws Error si c'est une erreur.
   */
  get data(): T {
    if (this._data === null) {
      throw new Error(
        "Tentative d'accéder aux données sur une réponse d'erreur.",
      );
    }
    return this._data;
  }

  /**
   * Retourne le message d'erreur.
   * @throws Error si c'est un succès.
   */
  get error(): string {
    if (this._error === null) {
      throw new Error(
        "Tentative d'accéder à l'erreur sur une réponse de succès.",
      );
    }
    return this._error;
  }
}
