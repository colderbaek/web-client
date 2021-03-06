import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export enum GLOBAL_DIALOG_TYPE {
  SIGN_IN,
  SIGN_UP,
  WALLET,
  VERIFICATION_NEEDED,
  EXTRA,
}

export interface IDialogState {
  isLoading: boolean;
  hasError: boolean;
  isOpen: boolean;
  type: GLOBAL_DIALOG_TYPE;
}

export interface IDialogStateRecord extends TypedRecord<IDialogStateRecord>, IDialogState {}

const initialDialogState = {
  isLoading: false,
  hasError: false,
  isOpen: false,
  type: GLOBAL_DIALOG_TYPE.EXTRA,
};

export const DialogStateFactory = makeTypedFactory<IDialogState, IDialogStateRecord>(initialDialogState);

export const DIALOG_INITIAL_STATE = DialogStateFactory();
