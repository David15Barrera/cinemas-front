import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Auth } from './models/auth-store.model';
import { inject } from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Router } from '@angular/router';
import { Rol, Session } from 'app/modules/session/models/auth';

export const INITIAL_STATE: Auth = {
    session: {
        token: "",
        id: '',
        email: "",
        active:false,
        fullName:"",
        roleName: Rol.CLIENTE,
    }
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState((localStorageService = inject(LocalStorageService)) => localStorageService.getState()),
    withMethods((store, router = inject(Router), localStorageService = inject(LocalStorageService)) => ({
        updateEmail(email: string) {
            patchState(store, state => {
              const newState = {
                session: {
                  ...state.session,
                  email
                }
              };
              localStorageService.saveState(newState); 
              return newState;
            });
          },
          
        updateSession(session: Session) {
            patchState(store, { session });
            localStorageService.saveState({ session });
        },
        logout() {
            patchState(store, INITIAL_STATE);
            localStorageService.saveState(INITIAL_STATE);
            router.navigate(['/session']);
        }
    }))
);