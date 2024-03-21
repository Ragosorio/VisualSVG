import * as vscode from "vscode";
import { windowView } from "../styles/windowView";

export function showSelectedSVGByCode(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (isSVG(selectedText)) {
      const panel = vscode.window.createWebviewPanel(
        "SVG viewer by code",
        "SVG viewer by code",
        vscode.ViewColumn.Two,
        {},
      );

      // Convertir el SVG a una imagen y mostrarla en el panel
      const svgToImageURL = `data:image/svg+xml;base64,${
        Buffer.from(selectedText).toString("base64")
      }`;
      panel.webview.html = getHTMLForSVG(svgToImageURL);
    } else {
      vscode.window.showErrorMessage("El texto seleccionado no es un SVG.");
    }
  } else {
    vscode.window.showErrorMessage("No hay ningún editor de texto activo.");
  }
}

function isSVG(text: string): boolean {
  // Verificar si el texto comienza con la etiqueta <svg>
  return text.trim().startsWith("<svg");
}

function getHTMLForSVG(svgToImageURL: string): string {
  return windowView(svgToImageURL);
}
