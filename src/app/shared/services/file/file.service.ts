import { Injectable } from '@angular/core';
import { UiLoadingService } from '../ui/ui-loading.service';
import { ExportPdfOptions } from '@app/shared/models';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({ providedIn: 'root' })
export class FileService {

  constructor(
    private loadingService: UiLoadingService,
  ) {}

  /** PDF로 다운로드 받는다. */
  async exportPdf(options: ExportPdfOptions): Promise<void> {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);

    const canvasOptions = {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      dpi: 300,
      scrollX: 0,
      scrollY: 0,
      width: options.element.scrollWidth,   // 전체 화면 너비
      height: options.element.scrollHeight, // 전체 화면 높이
      ignoreElements: (el: Element) => {
        const idList = options.ignoreElements ?? [];
        return idList.includes(el.id);
      }
    };
  
    // 급여명세서 조회 화면 캡처
    const canvas = await html2canvas(options.element, canvasOptions);

    const margin = options.margin ?? 0; // 여백 (단위: mm)
  
    // PDF 크기 설정 (캔버스 크기 기반)
    const pdfWidth = canvas.width * 0.264583 + margin * 2;   // 픽셀 → mm (1px = 0.264583mm)
    const pdfHeight = canvas.height * 0.264583 + margin * 2; // 픽셀 → mm
  
    // PDF 생성
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation, // landscape: 가로 방향, portrait: 세로 방향
      unit: 'mm',                       // 단위: mm
      format: [pdfWidth, pdfHeight],    // PDF 크기를 캔버스 크기에 맞춤
    });
  
    // PDF에 이미지 추가
    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth - margin * 2, pdfHeight - margin * 2);
  
    // PDF 저장
    pdf.save(options.fileName);
  
    clearTimeout(loadingTimeout);
    this.loadingService.setLoading(false);
  }

}
