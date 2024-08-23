'use client'

import {Row, RowProps} from "react-bootstrap";
import {useMagicGrid} from "use-magic-grid";

export default function MagicGrid({ children, ...props }: RowProps ) {

    useMagicGrid({ container: '#magicGrid', gutter: 0 })

    return (
        <Row id={'magicGrid'} {...props}>
            {children}
        </Row>
    )
}