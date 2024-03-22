import * as vscode from "vscode";
import { showSelectedSVGByCode } from "./functions/svgViewerByCode";
import { activateSvgViewerByHover} from "./functions/svgViewerByHover";
import {
  activateSVGViewerByClick,
  deactivateSVGViewerByClick,
} from "./functions/svgViewerByClick";
import { activateSvgViewerByFile } from "./functions/svgViewerByFile";

export function activate(context: vscode.ExtensionContext) {
  activateSVGViewerByClick(context);
  activateSvgViewerByFile(context);
  activateSvgViewerByHover(context);

  let disposableShowByCode = vscode.commands.registerCommand(
    "extension.showSelectedSVGByCode",
    () => {
      showSelectedSVGByCode(context);
    },
  );

  context.subscriptions.push(disposableShowByCode);
}

export function deactivate() {
  deactivateSVGViewerByClick();
}
