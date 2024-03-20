import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-ext-ts" is now active!');

	let disposable = vscode.commands.registerCommand('extension.showSelectedSVG', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (isSVG(selectedText)) {
				const panel = vscode.window.createWebviewPanel(
                    'svgViewer',
                    'SVG viewer by code',
                    vscode.ViewColumn.Two,
                    {}
                );

                // Convertir el SVG a una imagen y mostrarla en el panel
                const svgToImageURL = `data:image/svg+xml;base64,${Buffer.from(selectedText).toString('base64')}`;
                panel.webview.html = `<html>
				<head>
					<style>
						body {
							margin: 0;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
						}
						img {
							max-width: 100%;
							max-height: 100%;
						}
					</style>
				</head>
				<body>
					<img src="${svgToImageURL}" alt="SVG" />
				</body>
				</html>`;

            } else {
                vscode.window.showErrorMessage('El texto seleccionado no es un SVG.');
            }
        } else {
            vscode.window.showErrorMessage('No hay ningún editor de texto activo.');
        }
    });

    context.subscriptions.push(disposable);
}

function isSVG(text: string): boolean {
    // Verificar si el texto comienza con la etiqueta <svg>
    return text.trim().startsWith('<svg');
}

// This method is called when your extension is deactivated
export function deactivate() {}
