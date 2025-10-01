import { Component } from '@angular/core';

@Component({
    selector: 'svg[plus-icon]',
    template: `
        <svg:path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <svg:path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
        <svg:path d="M9 12h6" />
        <svg:path d="M12 9v6" />
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
export class PlusIcon {}