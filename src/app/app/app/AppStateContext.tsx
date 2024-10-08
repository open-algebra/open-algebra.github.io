import {createContext, Dispatch, ReactNode, useContext} from "react";
import {Draft} from "immer";
import ParseExpression from "@/app/app/app/ParseExpression";
import {useImmerReducer} from "use-immer";

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
    history: [], currentInputText: "", currentInputExpressionStr: "", currentInputValid: true
}

interface SubmitEntryAction {
    type: 'submitEntry'
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

export type Action = SubmitEntryAction | AppendToInputAction | SetInputAction | ClearInputAction | BackspaceInputAction;

export const AppStateContext = createContext<AppState>(defaultAppState);
export const AppStateDispatchContext = createContext<Dispatch<Action> | null>(null);

export function useAppState() {
    return useContext(AppStateContext);
}

export function useAppStateDispatch() {
    return useContext(AppStateDispatchContext);
}

export function AppStateProvider({children, oasis}: { children: ReactNode, oasis: any }) {
    function appStateReducer(draft: Draft<AppState>, action: Action) {
        switch (action.type) {
            case "submitEntry": {
                const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [draft.currentInputText]);
                const query = oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]);

                if (!query) return;

                const queryStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [query])

                let result;
                try {
                    result = oasis.ccall('Oa_SimplifyNF', 'number', ['number'], [query]);
                } catch (error) {
                    draft.history.push({query: queryStr, response: (error as Error).message, error: true})
                    draft.currentInputText = "";
                    draft.currentInputExpressionStr = "";
                    draft.currentInputValid = true;
                    return;
                }

                const resultStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [result])

                oasis.ccall('Oa_Free', 'void', ['number'], [result]);
                oasis.ccall('Oa_Free', 'void', ['number'], [query]);

                draft.history.push({query: queryStr, response: resultStr, error: false})
                draft.currentInputText = "";
                draft.currentInputExpressionStr = "";
                draft.currentInputValid = true;
            }
                break;
            case "setInput": {
                const {input} = action
                const newInputExpressionStr = ParseExpression(oasis, input);
                if (newInputExpressionStr) draft.currentInputExpressionStr = newInputExpressionStr;

                draft.currentInputText = input
                draft.currentInputValid = newInputExpressionStr.length > 0;
            }
                break;
            case "appendToInput": {
                const {addition} = action;
                draft.currentInputText += addition;
                const newInputExpressionStr = ParseExpression(oasis, draft.currentInputText);
                if (newInputExpressionStr) draft.currentInputExpressionStr = newInputExpressionStr;
                draft.currentInputValid = newInputExpressionStr.length > 0;
            }
                break;
            case "clearInput":
                draft.currentInputText = "";
                draft.currentInputExpressionStr = "";
                draft.currentInputValid = true;
                break;
            case "backspaceInput": {
                if (draft.currentInputText.length < 1) return;

                const newText = draft.currentInputText.slice(0, -1);
                const newInputExpressionStr = ParseExpression(oasis, newText);

                draft.currentInputText = newText;
                draft.currentInputExpressionStr = newInputExpressionStr || "";
                draft.currentInputValid = !!newInputExpressionStr;
            }
                break;
        }
    }

    const [appState, dispatch] = useImmerReducer(appStateReducer, defaultAppState);

    return (<AppStateContext.Provider value={appState}>
            <AppStateDispatchContext.Provider value={dispatch}>
                {children}
            </AppStateDispatchContext.Provider>
        </AppStateContext.Provider>)
}