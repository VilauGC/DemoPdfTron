import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import WebViewer from '@pdftron/webviewer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'demoPdftron';

  @ViewChild('viewer') viewerRef!: ElementRef;

  ngAfterViewInit(): void {
    WebViewer(
      {
        path: '../assets/lib',
        initialDoc: '../assets/RaportNou.pdf',
      },
      this.viewerRef.nativeElement
    )
      .then((instance) => {
        const { documentViewer, annotationManager } = instance.Core;

        // Add header button that will get file data on click
        instance.UI.setHeaderItems((header) => {
          header.push({
            type: 'actionButton',
            text: 'Salvare',
            img: '...',
            onClick: async () => {
              const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              const data = await doc.getFileData({
                // saves the document with annotations in it
                xfdfString,
              });
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: 'application/pdf' });

              // Add code for handling Blob here

              const url = URL.createObjectURL(blob);
              window.open(url);
            },
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
