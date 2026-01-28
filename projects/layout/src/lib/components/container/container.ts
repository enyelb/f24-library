import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f24-container',
  standalone: true,
  imports: [],
  templateUrl: './container.html',
  styleUrl: './container.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Container {

}
