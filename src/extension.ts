import * as vscode from 'vscode';
import { showSelectedSVGByCode } from './functions/svgViewerByCode';
import { activateSVGViewerByClick, deactivateSVGViewerByClick } from './functions/svgViewerByClick';

export function activate(context: vscode.ExtensionContext) {
    activateSVGViewerByClick(context);

    let disposableShowByCode = vscode.commands.registerCommand('extension.showSelectedSVGByCode', () => {
        showSelectedSVGByCode(context);
    });

    context.subscriptions.push(disposableShowByCode);

}

export function deactivate() {
    deactivateSVGViewerByClick();
}
