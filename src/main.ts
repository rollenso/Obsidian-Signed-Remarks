import {Editor, MarkdownView, Plugin} from "obsidian";
import {PluginSettingsTab, TextSetting} from "./settings";


interface PluginSettings {
	textSettings: TextSetting[];
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	textSettings: []
};

export default class SignedRemarksPlugin extends Plugin {
	settings: PluginSettings;
	async loadSettings(){
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	async saveSettings() {

		await this.saveData(this.settings);
		this.settings.textSettings.forEach(item  => {
			this.removeCommand(`simple-signs${item.id}`);
			if(item.imageLink != '') {
				this.addCommand({

					id: `simple-signs${item.id}`,
					name: `Sign №${item.id}`,
					editorCallback: (editor: Editor, view: MarkdownView) => {
						const nowText = editor.getSelection().length > 0 ? editor.getSelection() : "type your text here";

						const template = `<div class="warning-box" style="border: 0.5px solid ${item.colorHex};box-shadow: 0 1px 6px ${item.colorHex}">
  <img src="${item.imageLink}" alt="warning">
  <div class="warning-text" style="white-space: pre-line">
    ${nowText} 
  </div>
</div>`;
						const from = editor.getCursor('from');
						const to = editor.getCursor('to');
						for (let i = from.line; i <= to.line; i++) {
							editor.setLine(i, ``);
						}
						editor.setLine(editor.getCursor("to").line, template);
					},
				});
			}
		});

	}



	async onload() {
		await this.loadSettings();
		this.addSettingTab(new PluginSettingsTab(this.app, this));
		this.settings.textSettings.forEach(item  => {
			if(item.imageLink != ''){
			this.addCommand({

				id: `simple-signs${item.id}`,
				name: `Sign №${item.id}`,
				editorCallback: (editor: Editor, view: MarkdownView) => {
					const nowText = editor.getSelection().length >0 ? editor.getSelection() : "type your text here";

					const template = `<div class="warning-box" style="border: 0.5px solid ${item.colorHex};box-shadow: 0 1px 6px ${item.colorHex}">
  <img src="${item.imageLink}" alt="warning">
  <div class="warning-text" style="white-space: pre-line">
    ${nowText}
  </div>
</div>`;
					const from = editor.getCursor('from');
					const to = editor.getCursor('to');
					for (let i = from.line; i <= to.line; i++) {
						editor.setLine(i, ``);
					}
					editor.setLine(editor.getCursor("to").line, template);
				},
			});

			}
		});

	}
}

