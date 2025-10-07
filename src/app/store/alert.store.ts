import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  Alert,
  Alerts as AlertState,
  AlertWithTimeout,
} from './models/alert-store.model';

const initialState: AlertState = { alerts: [] };

export const AlertStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialState),
  withMethods((store) => {
    const removeAlert = (alert?: AlertWithTimeout) => {
      patchState(store, (state: AlertState) => {
        if (alert) {
          clearTimeout(alert.timeout);
        }
        state.alerts.shift();
        return { ...state };
      });
    };
    const addAlert = (alert: Alert) => {
      patchState(store, (state: AlertState) => {
        const timeout = window.setTimeout(() => {
          removeAlert();
        }, 15000);

        if (state.alerts.length > 4) {
          removeAlert();
        }

        return {
          ...state,
          alerts: [...state.alerts, { ...alert, timeout }],
        };
      });
    };
    return {
      removeAlert,
      addAlert,
    };
  })
);
