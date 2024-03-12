import {Component, OnInit, QueryList, ViewChildren} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../services/user-service";
import {CommitDetails, CommitFiles} from "../../../shared/openapi";
import {Observable, switchMap} from "rxjs";
import {AccordionComponent} from "../../shared/accordion-component/accordion.component";

@Component({
  selector: 'codeChanges',
  templateUrl: 'code-file-changes.component.html',
  styleUrls: ['code-file-changes.component.scss'],
})
export class CodeFileChangesComponent implements OnInit {
  @ViewChildren(AccordionComponent) accordions!: QueryList<AccordionComponent>;
  commitData$!: Observable<CommitDetails>;
  filteredFiles: CommitFiles[] = [];

  public allClosed = false
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.commitData$ = this.route.params
      .pipe(
        switchMap((params) => {
          const repoOwner = params['repoOwner'];
          const repoName = params['repoName'];
          const sha = params['sha'];

          return this.userService.getCommitDetails({
            repoOwner: repoOwner,
            repoName: repoName,
            sha: sha
          });
        })
      )

    this.commitData$.subscribe((data) => this.filteredFiles = data.files)
  }

  public parsePatch(patch: string): any[] {
    const changes: { lineNumber: number | null; text: string; added: boolean; removed: boolean }[] = [];

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
    const result = Array.from({ length: count }, (_, index) => ({ index }));
    return result.length > 5 ? result.slice(0, 5) : result
  }

  onSearchResult(result: CommitFiles[]): void {
    this.filteredFiles = result
  }

  toggleAll() {
    this.allClosed = !this.allClosed;
    this.accordions.forEach(accordion => accordion.toggle());
  }
}
