import {createContext, Dispatch} from "react";

export interface HistoryEntry {
    query: string,
    response: string
    error: boolean
}

export interface AppState {
    history: HistoryEntry[]
    currentInputText: string
    currentInputExpressionStr: string
    currentInputValid: boolean
}

export const defaultAppState = {
    history: [],
    currentInputText: "",
    currentInputExpressionStr: "",
    currentInputValid: true
}

interface AddToHistoryAction {
    type: 'addToHistory'
    query: string,
    response: string
}

interface AddErrorToHistoryAction {
    type: 'addErrorToHistory'
    query: string,
    error: string
}

interface AppendToInputAction {
    type: 'appendToInput'
    addition: string
}

interface SetInputAction {
    type: 'setInput'
    input: string
}

interface ClearInputAction {
    type: 'clearInput'
}

interface BackspaceInputAction {
    type: 'backspaceInput',
}

export type Action =
    AddToHistoryAction
    | AddErrorToHistoryAction
    | AppendToInputAction
    | SetInputAction
    | ClearInputAction
    | BackspaceInputAction;

export const AppStateContext = createContext<AppState>(defaultAppState);
export const AppStateDispatchContext = createContext<Dispatch<Action> | null>(null);