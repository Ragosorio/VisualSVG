import * as vscode from 'vscode';
import { windowView } from '../styles/windowView';

let panel: vscode.WebviewPanel | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;

export function activateSVGViewerByClick(context: vscode.ExtensionContext): void {
    setupStatusBar(context);

    if (statusBarItem) {
        context.subscriptions.push(
            statusBarItem,
            vscode.commands.registerCommand('extension.openExtensionPage', openExtensionPage),
            vscode.commands.registerCommand('extension.openPreviewOnFocus', openPreviewOnFocus),
            vscode.commands.registerCommand('extension.openPreviewMenu', openPreviewMenu),
            vscode.commands.registerCommand('extension.openPreviewOnEditorShortcut', openPreviewOnEditorButton),
            vscode.workspace.onDidOpenTextDocument(openTextDoc)
        );
    }
}

export function deactivateSVGViewerByClick(): void {
    panel?.dispose();
    statusBarItem?.dispose();
}

function isSVGFile(fileName: string): boolean {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return fileExtension === 'svg';
}

function updateWebviewContent(fileName: string): void {
    if (!panel) {
        return;
    }

    const fileUri = vscode.Uri.file(fileName);
    const fileWebviewUri = panel.webview.asWebviewUri(fileUri);

    panel.webview.html = windowView(fileWebviewUri);
}

async function openViewer(fileName: string): Promise<void> {
    panel?.reveal(vscode.ViewColumn.One);

    if (!panel) {
        panel = vscode.window.createWebviewPanel(
            'SVG viewer by click',
            'SVG viewer by click',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.onDidDispose(() => panel = undefined);
    }

    updateWebviewContent(fileName);
}

function setupStatusBar(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        10000
    );

    statusBarItem.text = "SVG-Viewer";
    statusBarItem.tooltip = "Looking for SVG files";
    statusBarItem.command = "extension.openExtensionPage";
    statusBarItem.show();
}

function openExtensionPage(): void {
    const extensionPageUrl = `vscode:extension/Dheovani.svg-viewer`;
    vscode.env.openExternal(vscode.Uri.parse(extensionPageUrl));
}

function openPreviewOnFocus(): void {
    const activeTextEditor = vscode.window.activeTextEditor;

    if (!activeTextEditor) {
        vscode.window.showInformationMessage("There's no open textfile.");
        return;
    }

    const fileName = activeTextEditor.document.fileName;
    openViewer(fileName);
}

function openPreviewMenu(resource: vscode.Uri): void {
    if (resource) {openViewer(resource.fsPath);
}}

function openPreviewOnEditorButton(resource: vscode.Uri): void {
    if (resource) {openViewer(resource.fsPath);
}
}
function openTextDoc(document: vscode.TextDocument): void {
    const fileName: string = document.fileName;

    if (isSVGFile(fileName)) {
        const selectedOption = !panel
            ? vscode.window.showInformationMessage("View SVG?", "Yes", "No")
            : Promise.resolve("Yes");

        selectedOption.then((option) => {
            if (option === "Yes") {openViewer(fileName);}
        });
    }
}