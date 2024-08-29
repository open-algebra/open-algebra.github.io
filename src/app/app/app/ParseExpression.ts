export default function ParseExpression(oasis: any, expression: string): string {
    const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [expression]);
    const currentInputExpression = oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]);

    if (!currentInputExpression) {
        return "";
    }

    const currentInputExpressionStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [currentInputExpression])
    oasis.ccall('Oa_Free', 'void', ['number'], [currentInputExpression]);

    return currentInputExpressionStr;
}