import { Component } from '@angular/core';

@Component({
    selector: 'svg[close-icon]',
    template: `
        <svg:path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <svg:path d="M18 6l-12 12" />
        <svg:path d="M6 6l12 12" />
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
export class CloseIcon {}