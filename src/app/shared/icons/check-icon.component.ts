import { Component } from '@angular/core';

@Component({
    selector: 'svg[check-icon]',
    template: `
        <svg:path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <svg:path d="M9 12l2 2l4 -4" />
        <svg:path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
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
export class CheckIcon {}