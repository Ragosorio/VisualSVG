import { Uri } from "vscode";
import { imgStyle, divStyle } from "./styles";

export function windowView(src: Uri | string): string{
    return (`<html>
    <head>
        <title>View SVG by click</title>
    </head>
    <body>
        <div style="${divStyle}">
            <img src="${src}" alt="SVG" style="${imgStyle}">
        </div>
    </body>
</html>`);
}