import { Component } from '@angular/core';

@Component({
    selector: 'svg[click-icon]',
    template: `
        <svg:path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <svg:path d="M3 12l3 0" />
        <svg:path d="M12 3l0 3" />
        <svg:path d="M7.8 7.8l-2.2 -2.2" />
        <svg:path d="M16.2 7.8l2.2 -2.2" />
        <svg:path d="M7.8 16.2l-2.2 2.2" />
        <svg:path d="M12 12l9 3l-4 2l-2 4l-3 -9" />
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
export class ClickIcon {}