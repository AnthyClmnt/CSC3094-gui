import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

export interface LoadingState {
  active: boolean;
  text: string;
  overlay: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private globalLoadingSubject = new BehaviorSubject<LoadingState>({
    active: false,
    text: 'Loading...',
    overlay: false
  });

  setLoading(loadingState: LoadingState): void {
    this.globalLoadingSubject.next(loadingState);
  }

  deactivateLoading(): void {
    this.globalLoadingSubject.next({
      active: false,
      text: this.globalLoadingSubject.getValue().text,
      overlay: this.globalLoadingSubject.getValue().overlay
    })
  }

  getLoading(): Observable<LoadingState> {
    return this.globalLoadingSubject.asObservable();
  }
}
