import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  standalone: true,
  imports: [
    ChartModule,
  ],
  selector: 'ui-chart',
  templateUrl: './ui-chart.component.html',
  styleUrl: './ui-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiChartComponent {

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  /** 차트 데이터 */
  @Input() data: any;

  /** 차트 옵션 */
  @Input() options?: any;

  /** 차트 type */
  @Input() type?: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';

  /** 차트 width */
  @Input() width?: string;

  /** 차트 height */
  @Input() height?: string;

}
