import * as vscode from 'vscode';

export function activateSvgViewerByHover(context: vscode.ExtensionContext) {
    let disposable = vscode.languages.registerHoverProvider("*", {
        provideHover(document, position, token) {
            // Obtener la posición actual del cursor
            const currentPosition = document.positionAt(document.offsetAt(position));

            // Definir los rangos para la etiqueta <svg>
            let svgRange = {
                start: undefined as vscode.Position | undefined,
                end: undefined as vscode.Position | undefined,
            };

            // Expresión regular para encontrar la etiqueta de apertura <svg>
            const openingTagRegex = /<svg[^>]*>/;
            // Expresión regular para encontrar la etiqueta de cierre </svg>
            const closingTagRegex = /<\/svg>/;

            // Buscar hacia atrás desde la posición actual para encontrar la etiqueta de apertura <svg>
            for (let line = currentPosition.line; line >= 0; line--) {
                const lineText = document.lineAt(line).text;
                const startMatch = lineText.match(openingTagRegex);
                if (startMatch) {
                    const startIndex = lineText.indexOf(startMatch[0]);
                    const startOffset = document.offsetAt(
                        new vscode.Position(line, startIndex),
                    );
                    svgRange.start = document.positionAt(startOffset);
                    break;
                }
            }

            // Buscar hacia adelante desde la posición actual para encontrar la etiqueta de cierre </svg>
            for (let line = currentPosition.line; line < document.lineCount; line++) {
                const lineText = document.lineAt(line).text;
                const endMatch = lineText.match(closingTagRegex);
                if (endMatch) {
                    const endIndex = lineText.indexOf(endMatch[0]) + endMatch[0].length;
                    const endOffset = document.offsetAt(
                        new vscode.Position(line, endIndex),
                    );
                    svgRange.end = document.positionAt(endOffset);
                    break;
                }
            }

            // Verificar si se encontraron ambas etiquetas <svg> y </svg>
            if (svgRange.start !== undefined && svgRange.end !== undefined) {
                // Obtener el texto dentro del rango de las etiquetas <svg> y </svg>
                const svgText = document.getText(
                    new vscode.Range(svgRange.start, svgRange.end),
                );

                // Encuentra el primer '>' en el texto SVG
                const firstGreaterThanIndex = svgText.indexOf(">");

                // Encuentra el atributo width existente (si lo hay)
                const existingWidthMatch = svgText.match(/width="[^"]*"/i);

                // Encuentra el atributo height existente (si lo hay)
                const existingHeightMatch = svgText.match(/height="[^"]*"/i);

                // Modifica el atributo width
                let modifiedSvgText = existingWidthMatch
                    ? svgText.replace(existingWidthMatch[0], 'width="100"')
                    : svgText.substring(0, firstGreaterThanIndex) + ` width="100"` +
                    svgText.substring(firstGreaterThanIndex);

                // Modifica el atributo height
                modifiedSvgText = existingHeightMatch
                    ? modifiedSvgText.replace(existingHeightMatch[0], 'height="100"')
                    : modifiedSvgText.substring(0, firstGreaterThanIndex) +
                    ` height="100"` + modifiedSvgText.substring(firstGreaterThanIndex);

                const markdownText = new vscode.MarkdownString();
                const svgDataURL = `data:image/svg+xml;base64,${
                    Buffer.from(modifiedSvgText).toString("base64")
                }`;
                markdownText.appendMarkdown(`![SVG](${svgDataURL})`);

                // Devolver el hover con el contenido de la etiqueta <svg> en HTML
                return new vscode.Hover(markdownText);
            }
        },
    });

    context.subscriptions.push(disposable);
}