import {AppStateContext, HistoryEntry} from "@/app/app/app/AppStateContext";
import {NavDropdown} from "react-bootstrap";
import React, {useContext} from "react";

function downloadXML(history: HistoryEntry[]) {

    const xmlDoc = document.implementation.createDocument(null, "root");
    const domParser = new window.DOMParser();

    for (const {query, response, error} of history) {
        const entryElem = xmlDoc.createElement("Entry");

        const queryElem = xmlDoc.createElement("Query");

        const queryMathElem = xmlDoc.createElement("math");
        queryMathElem.setAttribute("display", "block");

        const queryElemContent = domParser.parseFromString(query, 'text/xml');
        queryMathElem.appendChild(queryElemContent.documentElement.cloneNode(true));

        queryElem.appendChild(queryMathElem);

        const responseElem = xmlDoc.createElement(error ? "Error" : "Response")
        if (error) {
            responseElem.textContent = response;
        } else {
            const responseMathElem = xmlDoc.createElement("math");
            responseMathElem.setAttribute("display", "block");

            const responseElemContent = domParser.parseFromString(response, 'text/xml');
            responseMathElem.appendChild(responseElemContent.documentElement.cloneNode(true));

            responseElem.appendChild(responseMathElem);
        }

        entryElem.appendChild(queryElem);
        entryElem.appendChild(responseElem);
        xmlDoc.documentElement.appendChild(entryElem);
    }

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);

    const blob = new Blob([xmlString], {type: "text/xml"});
    const url = URL.createObjectURL(blob);
    window.open(url);
}

export default function DownloadXMLButton() {
    const {history} = useContext(AppStateContext);

    return (<NavDropdown.Item as={"button"} onClick={() => downloadXML(history)}>Export
        as
        XML</NavDropdown.Item>)
}