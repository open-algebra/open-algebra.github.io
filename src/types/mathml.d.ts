import type { SVGProps } from "react";

type MathMLProps = SVGProps<SVGElement> & {
    display?: "block" | "inline" | string;
};

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            math: MathMLProps;
            mfrac: MathMLProps;
            mi: MathMLProps;
            mn: MathMLProps;
            mo: MathMLProps;
            msup: MathMLProps;
        }
    }
}
