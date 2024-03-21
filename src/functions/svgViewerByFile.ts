import * as vscode from 'vscode';
import * as path from 'path';
import { windowView } from '.././styles/windowView'; 

export function activateSvgViewerByFile(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.viewSvg', (resource: vscode.Uri) => {
        if (resource && resource.fsPath && path.extname(resource.fsPath) === '.svg') {
            openViewer(resource.fsPath);
        } else {
            vscode.window.showErrorMessage('The selected file is not an SVG.');
        }
    });

    context.subscriptions.push(disposable);
}

async function openViewer(fileName: string): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
        'SVG viewer by file',
        'SVG viewer by file',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const fileUri = vscode.Uri.file(fileName);
    const fileWebviewUri = panel.webview.asWebviewUri(fileUri);

    panel.webview.html = windowView(fileWebviewUri);
}

export function deactivate() {}