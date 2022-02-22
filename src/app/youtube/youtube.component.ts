import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class YoutubeComponent implements OnInit {
  private _id?: string;

  url?: SafeResourceUrl

  @Input()
  set id(value: string) {
    if (this._id !== value) {
      this._id = value;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${value}`);
    }
  }

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

}
