import { TestBed } from '@angular/core/testing';
import { LoadingService, LoadingState } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading state', () => {
    const loadingState: LoadingState = {
      active: true,
      text: 'Loading...',
      overlay: false
    };

    service.setLoading(loadingState);
    service.getLoading().subscribe(state => {
      expect(state).toEqual(loadingState);
    });
  });

  it('should deactivate loading state', () => {
    const initialLoadingState: LoadingState = {
      active: true,
      text: 'Loading...',
      overlay: false
    };
    const deactivatedLoadingState: LoadingState = {
      active: false,
      text: 'Loading...',
      overlay: false
    };

    service.setLoading(initialLoadingState);

    service.deactivateLoading();

    service.getLoading().subscribe(state => {
      expect(state).toEqual(deactivatedLoadingState);
    });
  });
});
