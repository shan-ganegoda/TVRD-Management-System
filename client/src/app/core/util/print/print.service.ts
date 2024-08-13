import { Injectable } from '@angular/core';
import html2canvas from "html2canvas-pro";
import {jsPDF} from "jspdf";

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  downloadAsPDF(elementid:string,filename:string): void {
    const element: HTMLElement | null = document.getElementById(elementid);
    if (element) {
      element.style.backgroundColor = 'white';
      html2canvas(element).then((canvas: HTMLCanvasElement) => {
        const imgData: string = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        // Adjust the image dimensions and position as needed
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${filename}.pdf`);
      }).catch(error => {
        console.error('Error generating canvas:', error);
      });
    } else {
      console.error('Element with id "qrcode" not found.');
    }
  }
}
