import { Component } from '@angular/core';

@Component({
    selector: 'svg[pdf-icon]',
    template: `
        <svg:path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <svg:path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z" />
        <svg:path d="M3 12h2a2 2 0 1 0 0 -4h-2v8" />
        <svg:path d="M17 12h3" />
        <svg:path d="M21 8h-4v8" />
`,
    host: {
        '[attr.viewBox]': '"0 0 24 24"',
        '[attr.fill]': '"none"',
        '[attr.width]': '"24"',
        '[attr.height]': '"24"',
        '[attr.stroke]': '"currentColor"',
        '[attr.stroke-width]': '"2"',
        '[attr.stroke-linecap]': '"round"',
        '[attr.stroke-linejoin]': '"round"'
    }
})
export class PdfIcon {}