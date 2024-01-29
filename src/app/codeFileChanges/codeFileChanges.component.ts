import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'codeChanges',
  templateUrl: 'codeFileChanges.component.html',
  styleUrls: ['codeFileChanges.component.scss'],
})
export class CodeFileChangesComponent implements OnInit {
  files = [
    {
      "sha": "f02986e7559a6ac6197c1f72a93f11394fa2024c",
      "filename": "Assets/Scripts/GameWin.cs",
      "status": "modified",
      "additions": 3,
      "deletions": 2,
      "changes": 5,
      "blob_url": "https://github.com/AnthyClmnt/Elementals/blob/5860f49b3be0b26ba5fca8b9e54e480b8d2f3723/Assets%2FScripts%2FGameWin.cs",
      "raw_url": "https://github.com/AnthyClmnt/Elementals/raw/5860f49b3be0b26ba5fca8b9e54e480b8d2f3723/Assets%2FScripts%2FGameWin.cs",
      "contents_url": "https://api.github.com/repos/AnthyClmnt/Elementals/contents/Assets%2FScripts%2FGameWin.cs?ref=5860f49b3be0b26ba5fca8b9e54e480b8d2f3723",
      "patch": "@@ -5,8 +5,9 @@ public class GameWin : MonoBehaviour\n {\n     public TMP_Text text;\n \n-    public void Start()\n+    // when scene is loaded the result of the game is shown\n+    public void Start() \n     {\n-        text.text = GameManager.Instance.gameState == GameState.HeroWin ? \"You won!!\" : \"Enemy won :(\";\n+        text.text = GameManager.Instance.gameState == GameState.HeroWin ? \"You won!!\" : \"Enemy won :(\"; // change text of the game result\n     }\n }"
    },
    // Add more files as needed
  ];

  changes: { lineNumber: number; text: string; added: boolean; removed: boolean }[] = [];

  ngOnInit() {
    this.processCode();
  }

  private processCode(): void {
    const patch = this.files[0].patch;
    this.changes = this.parsePatch(patch);
  }

  private parsePatch(patch: string): any[] {
    const changes: any[] = [];

    const lines = patch.split('\n');
    let lineNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('@@')) {
        const match = line.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);

        if (match) {
          lineNumber = parseInt(match[1]);

          // Add the diff header line without assigning a line number
          changes.push({ lineNumber: null, text: line, added: false, removed: false });

          while (++i < lines.length && !lines[i].startsWith('@@')) {
            const text = lines[i].substring(1);
            const added = lines[i].startsWith('+');
            const removed = lines[i].startsWith('-');

            changes.push({ lineNumber, text, added, removed });
            if (!removed) {
              lineNumber++;
            }
          }

          i--;
        }
      }
    }

    return changes;
  }

  getRange(count: number): any[] {
    return Array.from({ length: count }, (_, index) => ({ index }));
  }
}
