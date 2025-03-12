import {MainModule} from "@open-algebra/oasis/oasis-web";

export default function ParseExpression(oasis: MainModule, expression: string): string {
    const preprocessedInput = oasis.PreProcessInFix(expression);
    const currentInputExpression = oasis.FromInFix(preprocessedInput);

    if (!currentInputExpression) {
        return "";
    }

    return oasis.ToMathMLString(currentInputExpression);
}